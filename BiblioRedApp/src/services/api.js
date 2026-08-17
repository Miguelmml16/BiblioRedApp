// Cliente HTTP hacia el backend real de Django (Banco de Libro).
//
// El backend NO expone Token/JWT (se probaron /api/token/, /api-token-auth/,
// /api/auth/login/, djoser, dj-rest-auth: todos 404). El único mecanismo de
// autenticación disponible es el que usa el propio panel de administración
// de Django: login por SESIÓN contra /admin/login/ (cookie `sessionid`) con
// protección CSRF (cookie `csrftoken` + header `X-CSRFToken`). Solo cuentas
// staff pueden autenticarse; la lectura de los recursos (GET) es pública.
//
// Como React Native no expone un cookie-jar automático fiable en Expo Go,
// esta capa gestiona las cookies "a mano": lee `Set-Cookie` de cada
// respuesta, guarda sessionid/csrftoken en SecureStore y los reenvía en cada
// petición siguiente.
import * as SecureStore from './secureStorage';

export const BASE_URL = 'https://bancolibro.alwaysdata.net';
export const API_URL = `${BASE_URL}/api`;

const SESSION_KEY = 'bl_sessionid';
const CSRF_KEY = 'bl_csrftoken';
const PROFILE_KEY = 'bl_profile';
const REQUEST_TIMEOUT_MS = 15000;

let sessionId = null;
let csrfToken = null;
let cookiesReady = false;

export class ApiError extends Error {
  constructor(message, { type = 'server', status = null, fields = null } = {}) {
    super(message);
    this.type = type; // 'network' | 'auth' | 'validation' | 'server'
    this.status = status;
    this.fields = fields;
  }
}

async function loadCookies() {
  if (cookiesReady) return;
  const [sid, csrf] = await Promise.all([
    SecureStore.getItemAsync(SESSION_KEY),
    SecureStore.getItemAsync(CSRF_KEY),
  ]);
  sessionId = sid || null;
  csrfToken = csrf || null;
  cookiesReady = true;
}

async function persistCookies() {
  await Promise.all([
    sessionId
      ? SecureStore.setItemAsync(SESSION_KEY, sessionId)
      : SecureStore.deleteItemAsync(SESSION_KEY).catch(() => {}),
    csrfToken
      ? SecureStore.setItemAsync(CSRF_KEY, csrfToken)
      : SecureStore.deleteItemAsync(CSRF_KEY).catch(() => {}),
  ]);
}

// Extrae el valor de una cookie por nombre desde el header Set-Cookie crudo.
// No intenta separar cookies individuales (los `Expires=...GMT` traen comas
// que romperían un split ingenuo); solo busca el par nombre=valor.
function extractCookie(rawSetCookie, name) {
  if (!rawSetCookie) return undefined;
  const match = rawSetCookie.match(new RegExp(`${name}=("")?([^;,]*)`));
  if (!match) return undefined;
  const value = match[2];
  return value === '' ? '' : value;
}

function updateCookiesFromResponse(response) {
  const raw = response.headers?.get?.('set-cookie');
  if (!raw) return;
  const sid = extractCookie(raw, 'sessionid');
  const csrf = extractCookie(raw, 'csrftoken');
  if (sid !== undefined) sessionId = sid || null; // Django manda sessionid="" al hacer logout/expirar
  if (csrf !== undefined && csrf) csrfToken = csrf;
}

function buildCookieHeader() {
  const parts = [];
  if (sessionId) parts.push(`sessionid=${sessionId}`);
  if (csrfToken) parts.push(`csrftoken=${csrfToken}`);
  return parts.join('; ');
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new ApiError('La solicitud tardó demasiado. Verifica tu conexión a internet.', { type: 'network' });
    }
    throw new ApiError('No se pudo conectar con el servidor. Verifica tu conexión a internet.', { type: 'network' });
  } finally {
    clearTimeout(timeout);
  }
}

function formatErrorBody(data, fallback) {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (typeof data === 'object') {
    const partes = Object.entries(data).map(([campo, msgs]) => {
      const texto = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
      return `${campo}: ${texto}`;
    });
    if (partes.length) return partes.join('\n');
  }
  return fallback;
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// Petición genérica a /api/<recurso>/ con cookies + CSRF adjuntos automáticamente.
export async function apiRequest(pathOrUrl, { method = 'GET', body } = {}) {
  await loadCookies();

  const url = /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${API_URL}${pathOrUrl}`;
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const cookieHeader = buildCookieHeader();
  if (cookieHeader) headers['Cookie'] = cookieHeader;
  if (csrfToken && method !== 'GET' && method !== 'HEAD') {
    headers['X-CSRFToken'] = csrfToken;
    // Django exige un Referer del mismo origen en peticiones HTTPS que
    // modifican estado (chequeo CSRF adicional además del token); RN no lo
    // manda solo, así que lo fijamos a mano o el backend responde 403
    // "CSRF Failed: Referer checking failed - no Referer.".
    headers['Referer'] = `${BASE_URL}/`;
  }

  const response = await fetchWithTimeout(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  updateCookiesFromResponse(response);
  await persistCookies();

  if (response.status === 401 || response.status === 403) {
    const data = await safeJson(response);
    throw new ApiError(
      formatErrorBody(data, 'Debes iniciar sesión con una cuenta autorizada para realizar esta acción.'),
      { type: 'auth', status: response.status }
    );
  }
  if (response.status === 400) {
    const data = await safeJson(response);
    throw new ApiError(formatErrorBody(data, 'Los datos enviados no son válidos.'), {
      type: 'validation',
      status: 400,
      fields: data,
    });
  }
  if (!response.ok) {
    const data = await safeJson(response);
    throw new ApiError(formatErrorBody(data, `Error del servidor (${response.status}).`), {
      type: 'server',
      status: response.status,
    });
  }
  if (response.status === 204) return null;
  return safeJson(response);
}

export const getJSON = (pathOrUrl) => apiRequest(pathOrUrl, { method: 'GET' });
export const postJSON = (pathOrUrl, body) => apiRequest(pathOrUrl, { method: 'POST', body });
export const patchJSON = (pathOrUrl, body) => apiRequest(pathOrUrl, { method: 'PATCH', body });
export const deleteJSON = (pathOrUrl) => apiRequest(pathOrUrl, { method: 'DELETE' });

// ---------------------------------------------------------------------------
// Autenticación por sesión de Django (ver cabecera del archivo).
// ---------------------------------------------------------------------------

async function getLoginPageToken() {
  const url = `${BASE_URL}/admin/login/?next=/`;
  const response = await fetchWithTimeout(url, { headers: { Accept: 'text/html' } });
  updateCookiesFromResponse(response);
  const html = await response.text();
  const match = html.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);
  return match ? match[1] : csrfToken;
}

export async function login(usuario, password) {
  await loadCookies();
  try {
    const token = await getLoginPageToken();
    const url = `${BASE_URL}/admin/login/?next=/`;
    const body = new URLSearchParams({
      csrfmiddlewaretoken: token || '',
      username: usuario,
      password,
      next: '/',
    }).toString();

    const cookieHeader = [`csrftoken=${token || ''}`, sessionId ? `sessionid=${sessionId}` : null]
      .filter(Boolean)
      .join('; ');

    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: url,
        Cookie: cookieHeader,
      },
      body,
    });

    updateCookiesFromResponse(response);
    const html = await response.text();
    const fallo = response.url.includes('/admin/login') || html.includes('errornote');

    if (fallo) {
      await persistCookies();
      const mensajeMatch = html.match(/class="errornote">\s*([\s\S]*?)\s*</);
      return {
        ok: false,
        mensaje: mensajeMatch
          ? mensajeMatch[1].trim()
          : 'Usuario o contraseña incorrectos, o la cuenta no tiene permisos de staff.',
      };
    }

    await persistCookies();
    const perfil = { usuario, nombre: usuario, rol: 'Staff' };
    await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(perfil));
    return { ok: true, usuario: perfil };
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, mensaje: e.message };
    return { ok: false, mensaje: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.' };
  }
}

export async function logout() {
  try {
    await loadCookies();
    const cookieHeader = buildCookieHeader();
    await fetchWithTimeout(`${BASE_URL}/admin/logout/?next=/`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
  } catch {
    // Si no hay conexión igual limpiamos la sesión localmente.
  }
  sessionId = null;
  csrfToken = null;
  await Promise.all([
    SecureStore.deleteItemAsync(SESSION_KEY).catch(() => {}),
    SecureStore.deleteItemAsync(CSRF_KEY).catch(() => {}),
    SecureStore.deleteItemAsync(PROFILE_KEY).catch(() => {}),
  ]);
}

// Restaura el perfil guardado (si existe) al abrir la app. La cookie de
// sesión viaja automáticamente en la siguiente petición autenticada; si ya
// expiró en el servidor, esa petición fallará con 401/403 y la pantalla que
// la dispare debe manejarlo (ver ApiError type 'auth').
export async function restoreProfile() {
  const raw = await SecureStore.getItemAsync(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}
