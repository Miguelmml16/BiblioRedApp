// Módulo Préstamos: control de salidas y devoluciones.
import React from 'react';
import ModuloScreen from '../components/ModuloScreen';

export default function PrestamosScreen() {
  return (
    <ModuloScreen
      icono="swap-horizontal"
      titulo="Préstamos"
      descripcion="Registro de préstamos y fechas de devolución."
      campos={['Libro', 'Socio', 'Fecha de préstamo', 'Fecha de devolución']}
    />
  );
}
