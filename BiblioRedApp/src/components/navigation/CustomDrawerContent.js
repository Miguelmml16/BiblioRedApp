// Contenido del Drawer: marca, sesión y preferencias. No repite nada que ya
// viva en el Topbar/Dashboard (refresco, pestañas de recursos) — aquí solo
// controles de alcance "app" (sesión, tema, navegación de secciones).
import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function CustomDrawerContent(props) {
  const { navigation, state } = props;
  const { colors, dark, toggle } = useTheme();
  const { usuario, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const styles = getStyles(colors);

  const activo = state.routeNames[state.index] === 'Dashboard';

  const irALogin = () => {
    navigation.closeDrawer();
    navigation.navigate('Login');
  };

  const cerrarSesion = async () => {
    navigation.closeDrawer();
    await logout();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.card }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 0 }}
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="book" size={22} color="#fff" />
          </View>
          <View>
            <Text style={styles.titulo}>BiblioRed</Text>
            <Text style={styles.subtitulo}>Panel de gestión</Text>
          </View>
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name={usuario ? 'person' : 'person-outline'} size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userNombre} numberOfLines={1}>
              {usuario?.nombre || usuario?.username || 'Invitado'}
            </Text>
            <View style={[styles.badge, { backgroundColor: usuario ? colors.ok : colors.gray }]}>
              <Text style={styles.badgeText}>{usuario ? 'Staff' : 'Modo lectura'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.item, activo && styles.itemActivo]}
          onPress={() => {
            navigation.navigate('Dashboard');
            navigation.closeDrawer();
          }}
        >
          <Ionicons name="grid" size={18} color={activo ? '#fff' : colors.text} />
          <Text style={[styles.itemText, activo && styles.itemTextActivo]}>Panel principal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            navigation.navigate('Digimon');
            navigation.closeDrawer();
          }}
        >
          <Ionicons name="paw" size={18} color={colors.text} />
          <Text style={styles.itemText}>Digimon</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.item}>
          <Ionicons name={dark ? 'moon' : 'sunny'} size={18} color={colors.text} />
          <Text style={styles.itemText}>Tema oscuro</Text>
          <Switch
            value={dark}
            onValueChange={toggle}
            trackColor={{ false: colors.line, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </DrawerContentScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        {usuario ? (
          <TouchableOpacity style={styles.sesionBtn} onPress={cerrarSesion}>
            <Ionicons name="log-out-outline" size={17} color={colors.danger} />
            <Text style={[styles.sesionBtnText, { color: colors.danger }]}>Cerrar sesión</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.sesionBtn, styles.sesionBtnPrimary]} onPress={irALogin}>
            <Ionicons name="log-in-outline" size={17} color="#fff" />
            <Text style={[styles.sesionBtnText, { color: '#fff' }]}>Iniciar sesión</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.version}>BiblioRed · v1.0</Text>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    brand: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, marginBottom: 18 },
    logo: {
      width: 40, height: 40, borderRadius: 11, backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
    },
    titulo: { color: colors.text, fontSize: 17, fontWeight: 'bold' },
    subtitulo: { color: colors.gray, fontSize: 12 },
    userCard: {
      flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 14,
      backgroundColor: colors.cardAlt, borderRadius: 12, padding: 12,
    },
    avatar: {
      width: 34, height: 34, borderRadius: 17, backgroundColor: colors.card,
      alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line,
    },
    userNombre: { color: colors.text, fontSize: 14, fontWeight: '700' },
    badge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 3 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    divider: { height: 1, backgroundColor: colors.line, marginVertical: 14, marginHorizontal: 14 },
    item: {
      flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 8,
      paddingHorizontal: 10, paddingVertical: 11, borderRadius: 10,
    },
    itemActivo: { backgroundColor: colors.primary },
    itemText: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' },
    itemTextActivo: { color: '#fff' },
    footer: {
      borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 14, paddingHorizontal: 14, gap: 10,
    },
    sesionBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      borderWidth: 1, borderColor: colors.line, borderRadius: 10, paddingVertical: 11,
    },
    sesionBtnPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
    sesionBtnText: { fontSize: 13, fontWeight: '700' },
    version: { textAlign: 'center', color: colors.gray, fontSize: 11 },
  });
