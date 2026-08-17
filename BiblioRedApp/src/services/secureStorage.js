// Envoltorio de almacenamiento seguro: usa expo-secure-store en iOS/Android
// (Keychain/Keystore) y localStorage en web, ya que expo-secure-store no
// tiene implementación para esa plataforma.
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

export async function getItemAsync(key) {
  if (isWeb) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

export async function setItemAsync(key, value) {
  if (isWeb) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignorar (ej. modo privado sin acceso a localStorage).
    }
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

export async function deleteItemAsync(key) {
  if (isWeb) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // no-op
    }
    return;
  }
  return SecureStore.deleteItemAsync(key);
}
