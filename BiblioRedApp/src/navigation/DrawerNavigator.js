// Drawer del área principal: hoy solo aloja el Dashboard, pero es el punto
// de entrada para futuras secciones de la app (además del menú de sesión/
// tema). El cambio de recurso (Libros, Socios, ...) sigue viviendo en las
// pestañas del Dashboard: no se duplica aquí.
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { useTheme } from '../context/ThemeContext';
import DashboardScreen from '../screens/DashboardScreen';
import DigimonScreen from '../screens/DigimonScreen';
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.55)',
        drawerStyle: { backgroundColor: colors.card, width: 300 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Digimon" component={DigimonScreen} />
    </Drawer.Navigator>
  );
}
