// Contexto de autenticación: sesión contra el backend real de Django.
// La app funciona sin sesión (los 5 módulos son de lectura pública); el
// login solo se exige para poder crear registros (requiere cuenta staff).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginRequest, logout as logoutRequest, restoreProfile } from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al iniciar la app: restaurar el perfil guardado localmente (si lo hay).
  // La cookie de sesión viaja aparte y se valida en la primera petición
  // autenticada real (crear un registro); si expiró, esa acción devolverá
  // un error 401/403 que la pantalla mostrará y pedirá reautenticación.
  useEffect(() => {
    (async () => {
      try {
        const perfil = await restoreProfile();
        if (perfil) setUsuario(perfil);
      } catch (e) {
        console.log('Error restaurando sesión:', e);
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const login = async (usuarioTexto, password) => {
    const res = await loginRequest(usuarioTexto, password);
    if (res.ok) setUsuario(res.usuario);
    return res;
  };

  const logout = async () => {
    await logoutRequest();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>{children}</AuthContext.Provider>
  );
}
