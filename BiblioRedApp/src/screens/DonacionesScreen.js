// Módulo Donaciones: entradas de ejemplares donados.
import React from 'react';
import ModuloScreen from '../components/ModuloScreen';

export default function DonacionesScreen() {
  return (
    <ModuloScreen
      icono="gift"
      titulo="Donaciones"
      descripcion="Registro de libros donados a la biblioteca."
      campos={['Libro', 'Donante', 'Cantidad', 'Observaciones']}
    />
  );
}
