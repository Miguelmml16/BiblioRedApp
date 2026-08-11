// Módulo Socios: usuarios registrados que solicitan préstamos.
import React from 'react';
import ModuloScreen from '../components/ModuloScreen';

export default function SociosScreen() {
  return (
    <ModuloScreen
      icono="people"
      titulo="Socios"
      descripcion="Personas registradas que pueden solicitar préstamos."
      campos={['Nombre', 'Apellido', 'Cédula', 'Email', 'Teléfono']}
    />
  );
}
