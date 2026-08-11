// Módulo Categorías: clasificación temática de los libros.
import React from 'react';
import ModuloScreen from '../components/ModuloScreen';

export default function CategoriasScreen() {
  return (
    <ModuloScreen
      icono="pricetags"
      titulo="Categorías"
      descripcion="Clasificación temática de los libros."
      campos={['Nombre', 'Descripción']}
    />
  );
}
