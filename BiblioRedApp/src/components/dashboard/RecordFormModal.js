import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useResourceList } from '../../hooks/useResourceList';

function ChipSelect({ resource, labelKey, value, onChange }) {
  const { colors } = useTheme();
  const { data, loading, error } = useResourceList(resource);
  const styles = getChipStyles(colors);

  if (loading) return <ActivityIndicator style={{ marginVertical: 10 }} color={colors.primary} />;
  if (error) return <Text style={styles.info}>No se pudieron cargar las opciones.</Text>;
  if (!data.length) return <Text style={styles.info}>No hay opciones disponibles todavía.</Text>;

  return (
    <View style={styles.wrap}>
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

export default function RecordFormModal({ visible, config, initialItem, submitting, submitError, onSubmit, onClose }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const esEdicion = Boolean(initialItem);

  const valoresIniciales = useMemo(() => {
    const base = {};
    config.campos.forEach((c) => {
      base[c.name] = initialItem ? initialItem[c.name] ?? '' : '';
    });
    return base;
  }, [config, initialItem]);

  const [form, setForm] = useState(valoresIniciales);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setForm(valoresIniciales);
    setFormError('');
  }, [valoresIniciales, visible]);

  const setCampo = (name, valor) => setForm((prev) => ({ ...prev, [name]: valor }));

  const guardar = async () => {
    setFormError('');
    const faltante = config.campos.find((c) => c.required && !form[c.name] && form[c.name] !== 0);
    if (faltante) {
      setFormError(`El campo "${faltante.label}" es obligatorio.`);
      return;
    }
    const payload = {};
    config.campos.forEach((c) => {
      const valor = form[c.name];
      if (valor === '' || valor === undefined) return;
      payload[c.name] = c.type === 'number' ? Number(valor) : valor;
    });
    const ok = await onSubmit(payload);
    if (ok) onClose();
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
        placeholderTextColor={colors.gray}
        value={String(form[campo.name] ?? '')}
        onChangeText={(v) => setCampo(campo.name, v)}
        keyboardType={campo.type === 'number' ? 'numeric' : 'default'}
        multiline={campo.type === 'multiline'}
      />
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.sheetWrap}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.headerTitulo}>
                {esEdicion ? `Editar ${config.tituloSingular}` : `Nuevo ${config.tituloSingular}`}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 18 }} keyboardShouldPersistTaps="handled">
              {config.campos.map((campo) => (
                <View key={campo.name} style={{ marginBottom: 4 }}>
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
                    <Text style={styles.botonText}>{esEdicion ? 'Guardar cambios' : 'Crear'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const getChipStyles = (colors) =>
  StyleSheet.create({
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4, marginTop: 4 },
    chip: {
      borderWidth: 1, borderColor: colors.line, borderRadius: 20,
      paddingHorizontal: 12, paddingVertical: 8, maxWidth: 220,
    },
    chipActivo: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontSize: 13, color: colors.text },
    chipTextActivo: { color: '#fff', fontWeight: '600' },
    info: { fontSize: 12, color: colors.gray, fontStyle: 'italic', marginBottom: 6 },
  });

const getStyles = (colors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: '#00000099', justifyContent: 'flex-end' },
    sheetWrap: { maxHeight: '88%' },
    sheet: {
      backgroundColor: colors.bg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      borderColor: colors.line,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: 18, borderBottomWidth: 1, borderBottomColor: colors.line,
    },
    headerTitulo: { color: colors.text, fontSize: 17, fontWeight: 'bold' },
    label: { fontSize: 13, color: colors.gray, marginTop: 12, marginBottom: 6 },
    input: {
      borderWidth: 1, borderColor: colors.line, borderRadius: 9, backgroundColor: colors.card,
      paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colors.text,
    },
    inputMultiline: { minHeight: 70, textAlignVertical: 'top' },
    error: { color: colors.danger, marginTop: 12, fontSize: 13 },
    boton: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, marginTop: 20,
    },
    botonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  });
