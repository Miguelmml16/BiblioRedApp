// Definición de los recursos reales del API de Django y su forma de
// consulta/creación/edición. Endpoints confirmados en /api/: libros,
// categorias, socios, donaciones, prestamos (todos paginados estilo DRF:
// { count, next, previous, results }).
import { getJSON, postJSON, patchJSON, deleteJSON } from './api';

export const ENDPOINTS = {
  libros: '/libros/',
  categorias: '/categorias/',
  socios: '/socios/',
  prestamos: '/prestamos/',
  donaciones: '/donaciones/',
};

const itemUrl = (resource, id) => `${ENDPOINTS[resource]}${id}/`;

// Trae todas las páginas de un recurso (los datasets del taller son pequeños).
export async function listAll(resource) {
  let next = ENDPOINTS[resource];
  let out = [];
  let guard = 0;
  while (next && guard < 50) {
    const data = await getJSON(next);
    if (Array.isArray(data)) {
      out = out.concat(data);
      next = null;
    } else {
      out = out.concat(data?.results || []);
      next = data?.next || null;
    }
    guard += 1;
  }
  return out;
}

export async function getCount(resource) {
  const data = await getJSON(ENDPOINTS[resource]);
  if (Array.isArray(data)) return data.length;
  return data?.count ?? 0;
}

export const createResource = (resource, payload) => postJSON(ENDPOINTS[resource], payload);
// PATCH (no PUT): solo envía los campos editados, sin exigir el resto del
// serializer (ej. "fecha_prestamo" no forma parte del formulario de edición).
export const updateResource = (resource, id, payload) => patchJSON(itemUrl(resource, id), payload);
export const deleteResource = (resource, id) => deleteJSON(itemUrl(resource, id));

// Configuración de UI por módulo: cómo listar (tarjeta tipo fila de tabla)
// y cómo crear/editar un registro.
// type de campo: 'text' | 'number' | 'multiline' | 'select-resource'
export const MODULES = {
  libros: {
    titulo: 'Libros',
    tituloSingular: 'libro',
    icono: 'book',
    descripcion: 'Catálogo de libros disponibles en la biblioteca.',
    listado: {
      titulo: (item) => item.titulo,
      subtitulo: (item) => item.autor,
      badges: (item) => [
        { texto: item.categoria_nombre, tono: 'accent' },
        { texto: item.disponible ? 'Disponible' : 'No disponible', tono: item.disponible ? 'ok' : 'danger' },
      ],
      filas: (item) => [
        { label: 'Editorial', value: item.editorial || '—' },
        { label: 'Año', value: item.anio_publicacion || '—' },
        { label: 'Ejemplares', value: `${item.ejemplares_disponibles ?? 0} / ${item.ejemplares_totales ?? 0}` },
      ],
    },
    campos: [
      { name: 'titulo', label: 'Título', type: 'text', required: true },
      { name: 'autor', label: 'Autor', type: 'text', required: true },
      { name: 'categoria', label: 'Categoría', type: 'select-resource', resource: 'categorias', labelKey: 'nombre', required: true },
      { name: 'editorial', label: 'Editorial', type: 'text' },
      { name: 'isbn', label: 'ISBN', type: 'text' },
      { name: 'anio_publicacion', label: 'Año de publicación', type: 'number' },
      { name: 'ejemplares_totales', label: 'Ejemplares totales', type: 'number', required: true },
      { name: 'descripcion', label: 'Descripción', type: 'multiline' },
    ],
  },
  categorias: {
    titulo: 'Categorías',
    tituloSingular: 'categoría',
    icono: 'pricetags',
    descripcion: 'Clasificación temática de los libros.',
    listado: {
      titulo: (item) => item.nombre,
      subtitulo: (item) => item.descripcion,
      badges: () => [],
      filas: () => [],
    },
    campos: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'descripcion', label: 'Descripción', type: 'multiline' },
    ],
  },
  socios: {
    titulo: 'Socios',
    tituloSingular: 'socio',
    icono: 'people',
    descripcion: 'Personas registradas que pueden solicitar préstamos.',
    listado: {
      titulo: (item) => item.nombre_completo || `${item.nombre} ${item.apellido}`,
      subtitulo: (item) => `Cédula: ${item.cedula}`,
      badges: (item) => [{ texto: item.activo ? 'Activo' : 'Inactivo', tono: item.activo ? 'ok' : 'danger' }],
      filas: (item) => [
        { label: 'Email', value: item.email || '—' },
        { label: 'Teléfono', value: item.telefono || '—' },
      ],
    },
    campos: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'apellido', label: 'Apellido', type: 'text', required: true },
      { name: 'cedula', label: 'Cédula', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'direccion', label: 'Dirección', type: 'text' },
    ],
  },
  prestamos: {
    titulo: 'Préstamos',
    tituloSingular: 'préstamo',
    icono: 'swap-horizontal',
    descripcion: 'Registra préstamos y devoluciones de la comunidad.',
    listado: {
      titulo: (item) => item.libro_titulo,
      subtitulo: (item) => `Socio: ${item.socio_nombre} (#${item.socio})  ·  Libro #${item.libro}`,
      badges: (item) => [
        {
          texto: item.estado,
          tono: item.estado === 'DEVUELTO' ? 'ok' : item.estado === 'ATRASADO' || item.atrasado ? 'danger' : 'warning',
        },
        item.atrasado ? { texto: 'Atrasado', tono: 'danger' } : null,
      ].filter(Boolean),
      filas: (item) => [
        { label: 'Prestado', value: item.fecha_prestamo || '—' },
        { label: 'Devolver antes', value: item.fecha_devolucion_esperada || '—' },
        { label: 'Devuelto el', value: item.fecha_devolucion_real || '—' },
      ],
    },
    campos: [
      { name: 'libro', label: 'Libro', type: 'select-resource', resource: 'libros', labelKey: 'titulo', required: true },
      { name: 'socio', label: 'Socio', type: 'select-resource', resource: 'socios', labelKey: 'nombre_completo', required: true },
      { name: 'fecha_devolucion_esperada', label: 'Fecha devolución esperada (AAAA-MM-DD)', type: 'text', required: true },
    ],
    // Acción rápida "Devolver": marca el préstamo como devuelto hoy (PATCH
    // parcial, solo estos dos campos).
    puedeDevolver: (item) => item.estado !== 'DEVUELTO',
    devolverPayload: () => ({
      fecha_devolucion_real: new Date().toISOString().slice(0, 10),
      estado: 'DEVUELTO',
    }),
  },
  donaciones: {
    titulo: 'Donaciones',
    tituloSingular: 'donación',
    icono: 'gift',
    descripcion: 'Registro de libros donados a la biblioteca.',
    listado: {
      titulo: (item) => item.libro_titulo,
      subtitulo: (item) => `Donante: ${item.donante}`,
      badges: (item) => [{ texto: `x${item.cantidad}`, tono: 'accent' }],
      filas: (item) => [
        { label: 'Fecha', value: item.fecha_donacion || '—' },
        { label: 'Observaciones', value: item.observaciones || '—' },
      ],
    },
    campos: [
      { name: 'libro', label: 'Libro donado', type: 'select-resource', resource: 'libros', labelKey: 'titulo', required: true },
      { name: 'donante', label: 'Donante', type: 'text', required: true },
      { name: 'cantidad', label: 'Cantidad', type: 'number', required: true },
      { name: 'observaciones', label: 'Observaciones', type: 'multiline' },
    ],
  },
};

export const RESOURCE_ORDER = ['prestamos', 'libros', 'socios', 'donaciones', 'categorias'];
