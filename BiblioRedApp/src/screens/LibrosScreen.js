// Módulo Libros: inventario de ejemplares.
import React from 'react';
import ModuloScreen from '../components/ModuloScreen';

export default function LibrosScreen() {
  return (
    <ModuloScreen
      icono="book"
      titulo="Libros"
      descripcion="Inventario de libros disponibles en la biblioteca."
      campos={['Título', 'Autor', 'Categoría', 'Editorial', 'Ejemplares totales']}
    />
  );
}
