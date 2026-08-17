import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DigimonScreen() {
  const navigation = useNavigation();
  const [digimon, setDigimon] = useState(null);

  useEffect(() => {
    fetch('https://digi-api.com/api/v1/digimon/16')
      .then((res) => res.json())
      .then((data) => setDigimon(data));
  }, []);

  if (!digimon) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: digimon.images[0].href }} style={styles.imagen} />
      <Text style={styles.nombre}>{digimon.name}</Text>
      <Text style={styles.texto}>Nivel: {digimon.levels[0]?.level}</Text>
      <Text style={styles.texto}>Tipo: {digimon.types[0]?.type}</Text>
      <Text style={styles.texto}>Atributo: {digimon.attributes[0]?.attribute}</Text>

      <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.botonTexto}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  imagen: { width: 150, height: 150, marginBottom: 16 },
  nombre: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  texto: { fontSize: 16, marginBottom: 4 },
  boton: { marginTop: 20, backgroundColor: '#7c3aed', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
