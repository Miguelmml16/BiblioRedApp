import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { MODULES, RESOURCE_ORDER } from '../../services/resources';

export default function ResourceTabs({ activo, onChange }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.wrap}
    >
      {RESOURCE_ORDER.map((key) => {
        const config = MODULES[key];
        const seleccionado = key === activo;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.tab, seleccionado && styles.tabActivo]}
            onPress={() => onChange(key)}
          >
            <Ionicons name={config.icono} size={15} color={seleccionado ? '#fff' : colors.gray} />
            <Text style={[styles.tabText, seleccionado && styles.tabTextActivo]}>{config.titulo}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    wrap: { marginTop: 16, paddingHorizontal: 16 },
    row: { gap: 8, paddingBottom: 4 },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 11,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
    },
    tabActivo: { backgroundColor: colors.primary, borderColor: colors.primary },
    tabText: { color: colors.gray, fontSize: 13, fontWeight: '600' },
    tabTextActivo: { color: '#fff' },
  });
