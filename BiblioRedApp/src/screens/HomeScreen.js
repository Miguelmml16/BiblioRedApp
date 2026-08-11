// Pantalla HOME: bienvenida + accesos a los módulos del sistema.
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const MODULOS = [
  { nombre: 'Libros', icono: 'book', destino: 'Libros' },
  { nombre: 'Socios', icono: 'people', destino: 'Socios' },
  { nombre: 'Préstamos', icono: 'swap-horizontal', destino: 'Préstamos' },
  { nombre: 'Donaciones', icono: 'gift', destino: 'Donaciones' },
  { nombre: 'Categorías', icono: 'pricetags', destino: 'Categorías' },
];

const STATS = [
  { valor: '8', etiqueta: 'Libros' },
  { valor: '4', etiqueta: 'Socios' },
  { valor: '2', etiqueta: 'Préstamos' },
];

export default function HomeScreen() {
  const { usuario } = useAuth();
  const navigation = useNavigation();

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
        <Text style={styles.saludo}>Hola, {usuario?.nombre?.split(' ')[0] || 'Usuario'} 👋</Text>
        <Text style={styles.saludoSub}>Bienvenido al sistema de gestión de la biblioteca comunitaria.</Text>
      </View>

      {/* Estadísticas rápidas */}
      <View style={styles.stats}>
        {STATS.map((s, i) => (
          <View key={i} style={styles.stat}>
            <Text style={styles.statValor}>{s.valor}</Text>
            <Text style={styles.statEtq}>{s.etiqueta}</Text>
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
