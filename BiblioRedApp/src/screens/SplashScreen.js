import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Imagen de biblioteca (Pexels, foto de Karol D, uso libre):
// https://www.pexels.com/photo/books-on-shelves-in-library-333304/
export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/splash-biblioteca.jpg')} style={styles.image} />
      <Text style={styles.titulo}>BiblioRed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  image: { flex: 1, width: '100%' },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', padding: 20 },
});
