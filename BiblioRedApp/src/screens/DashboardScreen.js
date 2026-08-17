// Pantalla única del panel: topbar + estadísticas + pestañas de recursos +
// lista en vivo con crear/editar/eliminar (y "Devolver" para préstamos).
import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useResourceList } from '../hooks/useResourceList';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { MODULES } from '../services/resources';

import Topbar from '../components/dashboard/Topbar';
import StatCards from '../components/dashboard/StatCards';
import ResourceTabs from '../components/dashboard/ResourceTabs';
import RecordCard from '../components/dashboard/RecordCard';
import RecordFormModal from '../components/dashboard/RecordFormModal';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { usuario, logout } = useAuth();
  const navigation = useNavigation();
  const styles = getStyles(colors);

  const [resource, setResource] = useState('prestamos');
  const config = MODULES[resource];

  const {
    data, loading, refreshing, error, submitting, submitError,
    mutatingId, reload, refresh, create, update, quickUpdate, remove, clearSubmitError,
  } = useResourceList(resource);

  const [statsKey, setStatsKey] = useState(0);
  const { stats, loading: statsLoading } = useDashboardStats(statsKey);

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);

  const refrescarTodo = () => {
    refresh();
    setStatsKey((k) => k + 1);
  };

  const abrirCrear = () => {
    setEditando(null);
    clearSubmitError();
    setModalVisible(true);
  };

  const abrirEditar = (item) => {
    setEditando(item);
    clearSubmitError();
    setModalVisible(true);
  };

  const confirmarEliminar = (item) => {
    Alert.alert(
      `Eliminar ${config.tituloSingular}`,
      `¿Seguro que deseas eliminar "${config.listado.titulo(item)}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const ok = await remove(item.id);
            if (ok) setStatsKey((k) => k + 1);
          },
        },
      ]
    );
  };

  const devolver = async (item) => {
    const ok = await quickUpdate(item.id, config.devolverPayload(item));
    if (ok) setStatsKey((k) => k + 1);
  };

  const guardarFormulario = async (payload) => {
    const ok = editando ? await update(editando.id, payload) : await create(payload);
    if (ok) setStatsKey((k) => k + 1);
    return ok;
  };

  const Header = (
    <View>
      <StatCards stats={stats} loading={statsLoading} />
      <ResourceTabs activo={resource} onChange={setResource} />

      <View style={styles.seccionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.seccionTitulo}>{config.titulo}</Text>
          <Text style={styles.seccionDesc}>{config.descripcion}</Text>
        </View>
        {usuario ? (
          <TouchableOpacity style={styles.nuevoBtn} onPress={abrirCrear}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.nuevoBtnText}>Nuevo {config.tituloSingular}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {!usuario ? (
        <TouchableOpacity style={styles.guestBanner} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.primary} />
          <Text style={styles.guestBannerText}>
            Estás como invitado: puedes consultar todo. Inicia sesión (cuenta staff) para crear, editar o eliminar.
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline-outline" size={18} color={colors.danger} />
          <Text style={styles.errorBoxText}>{error}</Text>
          <TouchableOpacity style={styles.reintentar} onPress={reload}>
            <Text style={styles.reintentarText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {loading ? (
        <View style={{ paddingVertical: 30 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Topbar
        refreshing={refreshing}
        onRefresh={refrescarTodo}
        usuario={usuario}
        onLoginPress={() => navigation.navigate('Login')}
        onLogoutPress={logout}
      />

      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        data={loading ? [] : data}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={Header}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refrescarTodo} colors={[colors.primary]} />}
        ListEmptyComponent={!loading && !error ? <Text style={styles.vacio}>Todavía no hay registros.</Text> : null}
        renderItem={({ item }) => (
          <RecordCard
            item={item}
            config={config}
            usuario={usuario}
            mutating={mutatingId === item.id}
            onEdit={() => abrirEditar(item)}
            onDelete={() => confirmarEliminar(item)}
            onDevolver={() => devolver(item)}
          />
        )}
      />

      <RecordFormModal
        visible={modalVisible}
        config={config}
        initialItem={editando}
        submitting={submitting}
        submitError={submitError}
        onSubmit={guardarFormulario}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    seccionHeader: {
      flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingTop: 20, gap: 10,
    },
    seccionTitulo: { color: colors.text, fontSize: 20, fontWeight: 'bold' },
    seccionDesc: { color: colors.gray, fontSize: 12, marginTop: 2 },
    nuevoBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    },
    nuevoBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    guestBanner: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
      borderRadius: 12, padding: 12, marginHorizontal: 16, marginTop: 14,
    },
    guestBannerText: { flex: 1, color: colors.text, fontSize: 11.5 },
    errorBox: {
      backgroundColor: colors.dark ? '#2a1414' : '#fbe1e1', borderRadius: 12, padding: 14,
      marginHorizontal: 16, marginTop: 14, alignItems: 'center', gap: 6,
    },
    errorBoxText: { color: colors.danger, fontSize: 13, textAlign: 'center' },
    reintentar: { backgroundColor: colors.danger, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, marginTop: 4 },
    reintentarText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    vacio: { textAlign: 'center', color: colors.gray, fontSize: 13, marginTop: 20 },
  });
