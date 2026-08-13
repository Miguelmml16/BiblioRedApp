// Pantalla base de un módulo: lista en vivo desde la API de Django +
// formulario de creación. La lectura es pública; crear requiere sesión
// (cuenta staff) y usa el token de sesión adjunto automáticamente por
// src/services/api.js.
import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useResourceList } from '../hooks/useResourceList';
import { MODULES } from '../services/resources';

const TONOS = {
  ok: { bg: '#e4f3ec', fg: colors.ok },
  danger: { bg: '#fbe9e5', fg: colors.danger },
  accent: { bg: '#f1e7db', fg: colors.accent },
};

function Badge({ texto, tono = 'accent' }) {
  if (!texto) return null;
  const paleta = TONOS[tono] || TONOS.accent;
  return (
    <View style={[styles.badge, { backgroundColor: paleta.bg }]}>
      <Text style={[styles.badgeText, { color: paleta.fg }]}>{texto}</Text>
    </View>
  );
}

// Selector simple por chips para campos de clave foránea (categoría, libro, socio).
function ChipSelect({ resource, labelKey, value, onChange }) {
  const { data, loading, error } = useResourceList(resource);

  if (loading) return <ActivityIndicator style={{ marginVertical: 10 }} color={colors.primary} />;
  if (error) return <Text style={styles.chipError}>No se pudieron cargar las opciones.</Text>;
  if (!data.length) return <Text style={styles.chipError}>No hay opciones disponibles todavía.</Text>;

  return (
    <View style={styles.chipsWrap}>
      {data.map((item) => {
        const selected = value === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.chip, selected && styles.chipActivo]}
            onPress={() => onChange(item.id)}
          >
            <Text style={[styles.chipText, selected && styles.chipTextActivo]} numberOfLines={1}>
              {item[labelKey]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ModuloScreen({ resource }) {
  const config = MODULES[resource];
  const { usuario } = useAuth();
  const navigation = useNavigation();
  const { data, loading, refreshing, error, submitting, submitError, reload, refresh, create, clearSubmitError } =
    useResourceList(resource);

  const camposIniciales = useMemo(
    () => Object.fromEntries(config.crear.campos.map((c) => [c.name, ''])),
    [config]
  );
  const [form, setForm] = useState(camposIniciales);
  const [formError, setFormError] = useState('');

  const setCampo = (name, valor) => {
    setForm((prev) => ({ ...prev, [name]: valor }));
  };

  const guardar = async () => {
    setFormError('');
    clearSubmitError();

    const faltante = config.crear.campos.find((c) => c.required && !form[c.name] && form[c.name] !== 0);
    if (faltante) {
      setFormError(`El campo "${faltante.label}" es obligatorio.`);
      return;
    }

    const payload = {};
    config.crear.campos.forEach((c) => {
      const valor = form[c.name];
      if (valor === '' || valor === undefined) return;
      payload[c.name] = c.type === 'number' ? Number(valor) : valor;
    });

    const ok = await create(payload);
    if (ok) setForm(camposIniciales);
  };

  const renderCampo = (campo) => {
    if (campo.type === 'select-resource') {
      return (
        <ChipSelect
          key={campo.name}
          resource={campo.resource}
          labelKey={campo.labelKey}
          value={form[campo.name]}
          onChange={(v) => setCampo(campo.name, v)}
        />
      );
    }
    return (
      <TextInput
        key={campo.name}
        style={[styles.input, campo.type === 'multiline' && styles.inputMultiline]}
        placeholder={campo.label}
        placeholderTextColor="#aaa"
        value={String(form[campo.name] ?? '')}
        onChangeText={(v) => setCampo(campo.name, v)}
        keyboardType={campo.type === 'number' ? 'numeric' : 'default'}
        multiline={campo.type === 'multiline'}
      />
    );
  };

  const Header = (
    <View>
      <View style={styles.header}>
        <View style={styles.iconoBox}>
          <Ionicons name={config.icono} size={26} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>{config.titulo}</Text>
          {config.descripcion ? <Text style={styles.desc}>{config.descripcion}</Text> : null}
        </View>
      </View>

      {/* Formulario de creación (solo si hay sesión iniciada) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nuevo registro</Text>
        {usuario ? (
          <>
            {config.crear.campos.map((campo) => (
              <View key={campo.name}>
                <Text style={styles.label}>{campo.label}</Text>
                {renderCampo(campo)}
              </View>
            ))}
            {(formError || submitError) ? <Text style={styles.error}>{formError || submitError}</Text> : null}
            <TouchableOpacity style={styles.boton} onPress={guardar} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <Text style={styles.botonText}>Guardar</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.guestBox}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.gray} />
            <Text style={styles.guestText}>Inicia sesión con una cuenta staff para agregar registros.</Text>
            <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.botonSecundarioText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.seccion}>Registros ({loading ? '…' : data.length})</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline-outline" size={20} color={colors.danger} />
          <Text style={styles.errorBoxText}>{error}</Text>
          <TouchableOpacity style={styles.reintentar} onPress={reload}>
            <Text style={styles.reintentarText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={loading ? [] : data}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={Header}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
      ListEmptyComponent={
        !loading && !error ? <Text style={styles.vacio}>Todavía no hay registros.</Text> : null
      }
      renderItem={({ item }) => {
        const badges = config.listado.badges(item);
        const meta = config.listado.meta(item);
        return (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitulo}>{config.listado.titulo(item)}</Text>
              {config.listado.subtitulo(item) ? (
                <Text style={styles.itemSub}>{config.listado.subtitulo(item)}</Text>
              ) : null}
              {meta ? <Text style={styles.itemMeta}>{meta}</Text> : null}
              {badges.length ? (
                <View style={styles.badgesRow}>
                  {badges.map((b, i) => (
                    <Badge key={i} texto={b.texto} tono={b.tono} />
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        );
      }}
    />
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
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: colors.line, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 10 },
  label: { fontSize: 13, color: colors.gray, marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: colors.line, borderRadius: 9,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colors.text,
  },
  inputMultiline: { minHeight: 70, textAlignVertical: 'top' },
  boton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 13, marginTop: 18,
  },
  botonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  error: { color: colors.danger, marginTop: 10, fontSize: 13 },
  guestBox: { alignItems: 'center', paddingVertical: 10, gap: 8 },
  guestText: { color: colors.gray, fontSize: 13, textAlign: 'center' },
  botonSecundario: {
    borderWidth: 1, borderColor: colors.primary, borderRadius: 9,
    paddingHorizontal: 16, paddingVertical: 9, marginTop: 4,
  },
  botonSecundarioText: { color: colors.primary, fontWeight: 'bold', fontSize: 13 },
  seccion: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
  loadingBox: { paddingVertical: 30 },
  vacio: { textAlign: 'center', color: colors.gray, fontSize: 13, marginTop: 10 },
  errorBox: {
    backgroundColor: '#fbe9e5', borderRadius: 12, padding: 14, marginBottom: 12,
    alignItems: 'center', gap: 6,
  },
  errorBoxText: { color: colors.danger, fontSize: 13, textAlign: 'center' },
  reintentar: { backgroundColor: colors.danger, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, marginTop: 4 },
  reintentarText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  item: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: colors.line,
  },
  itemTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.text },
  itemSub: { fontSize: 13, color: colors.gray, marginTop: 2 },
  itemMeta: { fontSize: 12, color: colors.gray, marginTop: 4 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    borderWidth: 1, borderColor: colors.line, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 8, maxWidth: 180,
  },
  chipActivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text },
  chipTextActivo: { color: '#fff', fontWeight: '600' },
  chipError: { fontSize: 12, color: colors.gray, fontStyle: 'italic', marginBottom: 6 },
});
