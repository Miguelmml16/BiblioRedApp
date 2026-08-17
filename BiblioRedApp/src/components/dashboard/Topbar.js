import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Tema, sesión y "acerca de" viven en el Drawer (ver CustomDrawerContent);
// aquí solo quedan acciones propias de esta pantalla (menú y refresco) para
// no duplicar controles entre el Topbar y el Drawer.
export default function Topbar({ onMenuPress, refreshing, onRefresh }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <TouchableOpacity style={styles.iconBtn} onPress={onMenuPress}>
          <Ionicons name="menu" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.logo}>
          <Ionicons name="book" size={22} color="#fff" />
        </View>
        <View>
          <Text style={styles.titulo}>BiblioRed</Text>
          <Text style={styles.subtitulo}>Panel de gestión</Text>
        </View>
      </View>

      <View style={styles.acciones}>
        <TouchableOpacity style={styles.iconBtn} onPress={onRefresh} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Ionicons name="refresh" size={18} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 54,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logo: {
      width: 40,
      height: 40,
      borderRadius: 11,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titulo: { color: colors.text, fontSize: 17, fontWeight: 'bold' },
    subtitulo: { color: colors.gray, fontSize: 12 },
    acciones: { flexDirection: 'row', gap: 8 },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: colors.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
