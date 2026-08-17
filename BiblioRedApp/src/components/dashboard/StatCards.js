import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const ITEMS = [
  { key: 'libros', icono: 'book-outline', etiqueta: 'Libros' },
  { key: 'ejemplaresDisponibles', icono: 'checkmark-outline', etiqueta: 'Ejemplares disponibles' },
  { key: 'socios', icono: 'people-outline', etiqueta: 'Socios' },
  { key: 'prestamosActivos', icono: 'calendar-outline', etiqueta: 'Préstamos activos' },
];

export default function StatCards({ stats, loading }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.row}>
      {ITEMS.map((item) => (
        <View key={item.key} style={styles.card}>
          <View style={styles.iconBox}>
            <Ionicons name={item.icono} size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.valor}>{stats[item.key]}</Text>
            )}
            <Text style={styles.etiqueta} numberOfLines={1}>
              {item.etiqueta}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, paddingTop: 16 },
    card: {
      flexBasis: '47%',
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 14,
      padding: 14,
    },
    iconBox: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    valor: { color: colors.text, fontSize: 19, fontWeight: 'bold' },
    etiqueta: { color: colors.gray, fontSize: 11, marginTop: 1 },
  });
