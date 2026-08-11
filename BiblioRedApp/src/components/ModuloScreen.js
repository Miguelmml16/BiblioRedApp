// Componente reutilizable: pantalla base de un módulo con su formulario inicial.
// En esta etapa NO guarda datos; solo muestra la estructura visual.
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function ModuloScreen({ icono = 'cube-outline', titulo, descripcion, campos = [] }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header}>
        <View style={styles.iconoBox}>
          <Ionicons name={icono} size={26} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>{titulo}</Text>
          {descripcion ? <Text style={styles.desc}>{descripcion}</Text> : null}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nuevo registro</Text>
        {campos.map((campo, i) => (
          <View key={i}>
            <Text style={styles.label}>{campo}</Text>
            <TextInput style={styles.input} placeholder={campo} placeholderTextColor="#aaa" />
          </View>
        ))}
        <TouchableOpacity style={styles.boton}>
          <Ionicons name="save-outline" size={18} color="#fff" />
          <Text style={styles.botonText}>Guardar</Text>
        </TouchableOpacity>
        <Text style={styles.nota}>
          * Pantalla base. La conexión con la API REST se implementará en la siguiente etapa.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconoBox: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  titulo: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  desc: { fontSize: 13, color: colors.gray, marginTop: 2 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: colors.line },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 10 },
  label: { fontSize: 13, color: colors.gray, marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: colors.line, borderRadius: 9,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colors.text,
  },
  boton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 13, marginTop: 18,
  },
  botonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  nota: { fontSize: 11, color: colors.gray, marginTop: 12, fontStyle: 'italic' },
});
