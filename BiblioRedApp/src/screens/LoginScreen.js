// Pantalla de Login. Autentica contra la sesión de Django (solo cuentas
// staff pueden iniciar sesión; ver src/services/api.js).
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const entrar = async () => {
    setError('');
    if (!usuario || !password) {
      setError('Ingresa usuario y contraseña');
      return;
    }
    setCargando(true);
    const res = await login(usuario.trim(), password);
    setCargando(false);
    if (!res.ok) {
      setError(res.mensaje);
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {navigation.canGoBack() && (
          <TouchableOpacity style={styles.cerrar} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Logo / cabecera */}
        <View style={styles.logoBox}>
          <View style={styles.logoCirc}>
            <Ionicons name="library" size={54} color="#fff" />
          </View>
          <Text style={styles.titulo}>Banco de Libro</Text>
          <Text style={styles.subtitulo}>Biblioteca Comunitaria</Text>
        </View>

        {/* Tarjeta de formulario */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>

          <Text style={styles.label}>Usuario</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color={colors.gray} />
            <TextInput
              style={styles.input}
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              placeholder="admin"
              placeholderTextColor="#aaa"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.gray} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!verPass}
              placeholder="••••"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setVerPass(!verPass)}>
              <Ionicons name={verPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.boton} onPress={entrar} disabled={cargando}>
            <Text style={styles.botonText}>{cargando ? 'Verificando...' : 'Ingresar'}</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>Ingresa con una cuenta staff de Django (panel de administración).</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  cerrar: { position: 'absolute', top: 8, right: 8, padding: 8, zIndex: 1 },
  logoBox: { alignItems: 'center', marginBottom: 26 },
  logoCirc: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#ffffff22',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  subtitulo: { color: '#d7e6e0', fontSize: 14, marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 22 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 14 },
  label: { fontSize: 13, color: colors.gray, marginBottom: 6, marginTop: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: colors.line, borderRadius: 10, paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  error: { color: colors.danger, marginTop: 10, fontSize: 13 },
  boton: {
    backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 18,
  },
  botonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { textAlign: 'center', color: colors.gray, fontSize: 12, marginTop: 14 },
});
