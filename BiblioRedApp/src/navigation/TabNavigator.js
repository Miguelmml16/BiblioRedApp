// Navegación por pestañas (TAB): HOME + dos módulos (Libros y Préstamos).
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import LibrosScreen from '../screens/LibrosScreen';
import PrestamosScreen from '../screens/PrestamosScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9aa0a6',
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => {
          let icono = 'ellipse-outline';
          if (route.name === 'Home') icono = 'home';
          else if (route.name === 'Libros') icono = 'book';
          else if (route.name === 'Préstamos') icono = 'swap-horizontal';
          return <Ionicons name={icono} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Libros" component={LibrosScreen} />
      <Tab.Screen name="Préstamos" component={PrestamosScreen} />
    </Tab.Navigator>
  );
}
