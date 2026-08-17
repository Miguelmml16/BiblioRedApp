import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const TONOS = {
  ok: { bgDark: '#123a24', fgDark: '#22c55e', bgLight: '#dcf5e4', fgLight: '#15803d' },
  danger: { bgDark: '#3a1414', fgDark: '#ef4444', bgLight: '#fbe1e1', fgLight: '#dc2626' },
  accent: { bgDark: '#2a1f47', fgDark: '#a78bfa', bgLight: '#ece6fb', fgLight: '#6d28d9' },
  warning: { bgDark: '#3a2c0f', fgDark: '#eab308', bgLight: '#fbecc7', fgLight: '#a5690f' },
};

function Badge({ texto, tono = 'accent' }) {
  const { colors } = useTheme();
  if (!texto) return null;
  const paleta = TONOS[tono] || TONOS.accent;
  const bg = colors.dark ? paleta.bgDark : paleta.bgLight;
  const fg = colors.dark ? paleta.fgDark : paleta.fgLight;
  return (
    <View style={{ backgroundColor: bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ color: fg, fontSize: 11, fontWeight: '700' }}>{texto}</Text>
    </View>
  );
}

export default function RecordCard({ item, config, usuario, mutating, onEdit, onDelete, onDevolver }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const badges = config.listado.badges(item);
  const filas = config.listado.filas(item);
  const puedeDevolver = config.puedeDevolver ? config.puedeDevolver(item) : false;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.tituloRow}>
            <Text style={styles.idText}>#{item.id}</Text>
            <Text style={styles.titulo} numberOfLines={1}>
              {config.listado.titulo(item)}
            </Text>
          </View>
          {config.listado.subtitulo(item) ? (
            <Text style={styles.subtitulo}>{config.listado.subtitulo(item)}</Text>
          ) : null}
        </View>
        {mutating ? <ActivityIndicator size="small" color={colors.primary} /> : null}
      </View>

      {badges.length ? (
        <View style={styles.badgesRow}>
          {badges.map((b, i) => (
            <Badge key={i} texto={b.texto} tono={b.tono} />
          ))}
        </View>
      ) : null}

      {filas.length ? (
        <View style={styles.filas}>
          {filas.map((f, i) => (
            <View key={i} style={styles.fila}>
              <Text style={styles.filaLabel}>{f.label}</Text>
              <Text style={styles.filaValor} numberOfLines={1}>
                {String(f.value)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {usuario ? (
        <View style={styles.acciones}>
          {puedeDevolver ? (
            <TouchableOpacity style={[styles.boton, styles.botonOk]} onPress={onDevolver} disabled={mutating}>
              <Text style={styles.botonOkText}>Devolver</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.boton} onPress={onEdit} disabled={mutating}>
            <Text style={styles.botonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.boton, styles.botonDanger]} onPress={onDelete} disabled={mutating}>
            <Text style={styles.botonDangerText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.line,
      padding: 14,
      marginBottom: 10,
    },
    header: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    tituloRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    idText: { color: colors.gray, fontSize: 12, fontWeight: '600' },
    titulo: { color: colors.text, fontSize: 15, fontWeight: 'bold', flexShrink: 1 },
    subtitulo: { color: colors.gray, fontSize: 12, marginTop: 2 },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
    filas: { marginTop: 10, gap: 4 },
    fila: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    filaLabel: { color: colors.gray, fontSize: 12 },
    filaValor: { color: colors.text, fontSize: 12, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
    acciones: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
    boton: {
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 9,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    botonText: { color: colors.text, fontSize: 12, fontWeight: '700' },
    botonOk: { borderColor: colors.ok, backgroundColor: colors.dark ? '#123a24' : '#dcf5e4' },
    botonOkText: { color: colors.ok, fontSize: 12, fontWeight: '700' },
    botonDanger: { borderColor: colors.danger },
    botonDangerText: { color: colors.danger, fontSize: 12, fontWeight: '700' },
  });
