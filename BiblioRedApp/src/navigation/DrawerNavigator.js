// Menú lateral (Drawer). Integra el TAB (en "Inicio") con el resto de módulos.
// Reto 2: muestra info del usuario arriba. Incluye botón de cerrar sesión.
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

import TabNavigator from './TabNavigator';
import LibrosScreen from '../screens/LibrosScreen';
import SociosScreen from '../screens/SociosScreen';
import PrestamosScreen from '../screens/PrestamosScreen';
import DonacionesScreen from '../screens/DonacionesScreen';
import CategoriasScreen from '../screens/CategoriasScreen';

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer: cabecera de usuario + items + logout.
// Sin sesión, muestra un estado "Invitado" con botón para iniciar sesión
// (los módulos se pueden consultar igual; el login solo habilita crear).
function ContenidoDrawer(props) {
  const { usuario, logout } = useAuth();
  const nombre = usuario?.nombre || 'Invitado';
  const avatar =
    'https://ui-avatars.com/api/?background=356a5b&color=fff&size=128&name=' +
    encodeURIComponent(nombre);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Cabecera con datos del usuario autenticado (o invitado) */}
        <View style={styles.perfil}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.nombre}>{nombre}</Text>
          {usuario ? (
            <>
              <Text style={styles.usuario}>@{usuario?.usuario}</Text>
              <View style={styles.rolBadge}>
                <Text style={styles.rolText}>{usuario?.rol}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.usuario}>Sesión no iniciada</Text>
          )}
        </View>

        {/* Lista de módulos del Drawer */}
        <View style={{ paddingTop: 8 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Botón fijo abajo: cerrar sesión o iniciar sesión */}
      {usuario ? (
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.login} onPress={() => props.navigation.navigate('Login')}>
          <Ionicons name="log-in-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Iniciar sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <ContenidoDrawer {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: '#eef4f1',
        drawerLabelStyle: { marginLeft: -12, fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={TabNavigator}
        options={{
          title: 'Banco de Libro',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Libros"
        component={LibrosScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Socios"
        component={SociosScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Préstamos"
        component={PrestamosScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="swap-horizontal-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Donaciones"
        component={DonacionesScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="gift-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Categorías"
        component={CategoriasScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="pricetags-outline" size={size} color={color} /> }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  perfil: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  avatar: { width: 76, height: 76, borderRadius: 38, borderWidth: 2, borderColor: '#fff' },
  nombre: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginTop: 10 },
  usuario: { color: '#d7e6e0', fontSize: 13 },
  rolBadge: { backgroundColor: '#ffffff33', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
  rolText: { color: '#fff', fontSize: 12 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.danger,
    paddingVertical: 14,
    margin: 12,
    borderRadius: 10,
  },
  login: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    margin: 12,
    borderRadius: 10,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
