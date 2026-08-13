// Pantalla HOME: bienvenida + estadísticas reales + accesos a los módulos.
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { getCount } from '../services/resources';

const MODULOS = [
  { nombre: 'Libros', icono: 'book', destino: 'Libros' },
  { nombre: 'Socios', icono: 'people', destino: 'Socios' },
  { nombre: 'Préstamos', icono: 'swap-horizontal', destino: 'Préstamos' },
  { nombre: 'Donaciones', icono: 'gift', destino: 'Donaciones' },
  { nombre: 'Categorías', icono: 'pricetags', destino: 'Categorías' },
];

const STAT_RECURSOS = [
  { key: 'libros', etiqueta: 'Libros' },
  { key: 'socios', etiqueta: 'Socios' },
  { key: 'prestamos', etiqueta: 'Préstamos' },
];

export default function HomeScreen() {
  const { usuario } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState({});
  const [cargandoStats, setCargandoStats] = useState(true);
  const [errorStats, setErrorStats] = useState(false);

  useEffect(() => {
    let activo = true;
    (async () => {
      setCargandoStats(true);
      setErrorStats(false);
      try {
        const resultados = await Promise.all(STAT_RECURSOS.map((r) => getCount(r.key)));
        if (!activo) return;
        const nuevo = {};
        STAT_RECURSOS.forEach((r, i) => (nuevo[r.key] = resultados[i]));
        setStats(nuevo);
      } catch {
        if (activo) setErrorStats(true);
      } finally {
        if (activo) setCargandoStats(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Barra superior con menú (abre Drawer) */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.getParent()?.openDrawer()}>
          <Ionicons name="menu" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Banco de Libro</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Saludo */}
      <View style={styles.saludoCard}>
        <Text style={styles.saludo}>Hola, {usuario?.nombre?.split(' ')[0] || 'invitado'} 👋</Text>
        <Text style={styles.saludoSub}>Bienvenido al sistema de gestión de la biblioteca comunitaria.</Text>
      </View>

      {!usuario && (
        <TouchableOpacity style={styles.loginCard} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
          <Text style={styles.loginCardText}>
            Estás navegando como invitado. Inicia sesión (cuenta staff) para poder crear registros.
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      )}

      {/* Estadísticas rápidas (en vivo desde la API) */}
      <View style={styles.stats}>
        {STAT_RECURSOS.map((r) => (
          <View key={r.key} style={styles.stat}>
            {cargandoStats ? (
              <ActivityIndicator color={colors.accent} size="small" />
            ) : (
              <Text style={styles.statValor}>{errorStats ? '—' : stats[r.key]}</Text>
            )}
            <Text style={styles.statEtq}>{r.etiqueta}</Text>
          </View>
        ))}
      </View>

      {/* Accesos a módulos */}
      <Text style={styles.seccion}>Módulos</Text>
      <View style={styles.grid}>
        {MODULOS.map((m, i) => (
          <TouchableOpacity key={i} style={styles.moduloCard} onPress={() => navigation.navigate(m.destino)}>
            <Ionicons name={m.icono} size={28} color={colors.primary} />
            <Text style={styles.moduloText}>{m.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  topTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  saludoCard: { backgroundColor: colors.primary, borderRadius: 16, padding: 18, marginBottom: 16 },
  saludo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  saludoSub: { color: '#d7e6e0', fontSize: 13, marginTop: 4 },
  loginCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card,
    borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.line,
  },
  loginCardText: { flex: 1, fontSize: 12, color: colors.text },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  stat: {
    flex: 1, backgroundColor: colors.card, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: colors.line,
  },
  statValor: { fontSize: 22, fontWeight: 'bold', color: colors.accent },
  statEtq: { fontSize: 12, color: colors.gray },
  seccion: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moduloCard: {
    width: '47%', backgroundColor: colors.card, borderRadius: 14, paddingVertical: 22,
    alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.line,
  },
  moduloText: { fontSize: 14, fontWeight: '600', color: colors.text },
});
