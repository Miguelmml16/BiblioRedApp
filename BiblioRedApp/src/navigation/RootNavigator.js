// Navegador raíz: "Main" es el Drawer que aloja el panel (DashboardScreen),
// siempre visible — los 5 recursos son de lectura pública. Login es una
// pantalla modal que se abre bajo demanda para desbloquear crear/editar/
// eliminar (requiere staff).
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();
const SPLASH_MIN_MS = 1500;

export default function RootNavigator() {
  const { cargando } = useAuth();
  const [tiempoMinimoCumplido, setTiempoMinimoCumplido] = useState(false);

  // La restauración de sesión (SecureStore local) es casi instantánea; se
  // fuerza un tiempo mínimo para que el splash con la imagen sea visible.
  useEffect(() => {
    const timer = setTimeout(() => setTiempoMinimoCumplido(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  if (cargando || !tiempoMinimoCumplido) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
