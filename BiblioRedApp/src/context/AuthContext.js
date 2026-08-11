// Contexto de autenticación: guarda el usuario logueado y expone login/logout.
// Reto 1: la sesión se guarda en AsyncStorage y se restaura al abrir la app.
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDB, validarUsuario } from '../database/db';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const SESION_KEY = 'sesion_activa';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al iniciar la app: preparar BD y restaurar sesión guardada (Reto 1).
  useEffect(() => {
    (async () => {
      try {
        await initDB();
        const guardada = await AsyncStorage.getItem(SESION_KEY);
        if (guardada) {
          setUsuario(JSON.parse(guardada));
        }
      } catch (e) {
        console.log('Error inicializando:', e);
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  // Login: valida contra SQLite y persiste la sesión.
  const login = async (user, pass) => {
    const encontrado = await validarUsuario(user, pass);
    if (encontrado) {
      setUsuario(encontrado);
      await AsyncStorage.setItem(SESION_KEY, JSON.stringify(encontrado));
      return { ok: true };
    }
    return { ok: false, mensaje: 'Usuario o contraseña incorrectos' };
  };

  // Logout: limpia estado y sesión persistida.
  const logout = async () => {
    setUsuario(null);
    await AsyncStorage.removeItem(SESION_KEY);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
