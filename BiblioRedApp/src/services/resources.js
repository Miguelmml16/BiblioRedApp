// Definición de los recursos reales del API de Django y su forma de
// consulta/creación. Endpoints confirmados en /api/: libros, categorias,
// socios, donaciones, prestamos (todos paginados estilo DRF:
// { count, next, previous, results }).
import { getJSON, postJSON } from './api';

export const ENDPOINTS = {
  libros: '/libros/',
  categorias: '/categorias/',
  socios: '/socios/',
  prestamos: '/prestamos/',
  donaciones: '/donaciones/',
};

// Trae todas las páginas de un recurso (los datasets del taller son pequeños).
export async function listAll(resource) {
  let next = ENDPOINTS[resource];
  let out = [];
  let guard = 0;
  while (next && guard < 50) {
    const data = await getJSON(next);
    if (Array.isArray(data)) {
      out = out.concat(data);
      next = null;
    } else {
      out = out.concat(data?.results || []);
      next = data?.next || null;
    }
    guard += 1;
  }
  return out;
}

export async function getCount(resource) {
  const data = await getJSON(ENDPOINTS[resource]);
  if (Array.isArray(data)) return data.length;
  return data?.count ?? 0;
}

export async function createResource(resource, payload) {
  return postJSON(ENDPOINTS[resource], payload);
}

// Configuración de UI por módulo: cómo listar y cómo crear un registro.
// type de campo: 'text' | 'number' | 'multiline' | 'select-resource'
export const MODULES = {
  libros: {
    titulo: 'Libros',
    icono: 'book',
    descripcion: 'Catálogo de libros disponibles en la biblioteca.',
    listado: {
      titulo: (item) => item.titulo,
      subtitulo: (item) => item.autor,
      badges: (item) => [
        { texto: item.categoria_nombre, tono: 'accent' },
        { texto: item.disponible ? 'Disponible' : 'No disponible', tono: item.disponible ? 'ok' : 'danger' },
      ],
      meta: (item) => `${item.ejemplares_disponibles ?? 0} / ${item.ejemplares_totales ?? 0} ejemplares disponibles`,
    },
    crear: {
      campos: [
        { name: 'titulo', label: 'Título', type: 'text', required: true },
        { name: 'autor', label: 'Autor', type: 'text', required: true },
        { name: 'categoria', label: 'Categoría', type: 'select-resource', resource: 'categorias', labelKey: 'nombre', required: true },
        { name: 'editorial', label: 'Editorial', type: 'text' },
        { name: 'isbn', label: 'ISBN', type: 'text' },
        { name: 'anio_publicacion', label: 'Año de publicación', type: 'number' },
        { name: 'ejemplares_totales', label: 'Ejemplares totales', type: 'number', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'multiline' },
      ],
    },
  },
  categorias: {
    titulo: 'Categorías',
    icono: 'pricetags',
    descripcion: 'Clasificación temática de los libros.',
    listado: {
      titulo: (item) => item.nombre,
      subtitulo: (item) => item.descripcion,
      badges: () => [],
      meta: () => null,
    },
    crear: {
      campos: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'multiline' },
      ],
    },
  },
  socios: {
    titulo: 'Socios',
    icono: 'people',
    descripcion: 'Personas registradas que pueden solicitar préstamos.',
    listado: {
      titulo: (item) => item.nombre_completo || `${item.nombre} ${item.apellido}`,
      subtitulo: (item) => item.cedula,
      badges: (item) => [{ texto: item.activo ? 'Activo' : 'Inactivo', tono: item.activo ? 'ok' : 'danger' }],
      meta: (item) => [item.email, item.telefono].filter(Boolean).join(' · '),
    },
    crear: {
      campos: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'apellido', label: 'Apellido', type: 'text', required: true },
        { name: 'cedula', label: 'Cédula', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'telefono', label: 'Teléfono', type: 'text' },
        { name: 'direccion', label: 'Dirección', type: 'text' },
      ],
    },
  },
  prestamos: {
    titulo: 'Préstamos',
    icono: 'swap-horizontal',
    descripcion: 'Registro de préstamos y fechas de devolución.',
    listado: {
      titulo: (item) => item.libro_titulo,
      subtitulo: (item) => `Socio: ${item.socio_nombre}`,
      badges: (item) => [
        {
          texto: item.estado,
          tono: item.estado === 'DEVUELTO' ? 'ok' : item.estado === 'ATRASADO' || item.atrasado ? 'danger' : 'accent',
        },
      ],
      meta: (item) =>
        `Prestado: ${item.fecha_prestamo || '-'}  ·  Devolución esperada: ${item.fecha_devolucion_esperada || '-'}`,
    },
    crear: {
      campos: [
        { name: 'libro', label: 'Libro', type: 'select-resource', resource: 'libros', labelKey: 'titulo', required: true },
        { name: 'socio', label: 'Socio', type: 'select-resource', resource: 'socios', labelKey: 'nombre_completo', required: true },
        { name: 'fecha_devolucion_esperada', label: 'Fecha devolución esperada (AAAA-MM-DD)', type: 'text', required: true },
      ],
    },
  },
  donaciones: {
    titulo: 'Donaciones',
    icono: 'gift',
    descripcion: 'Registro de libros donados a la biblioteca.',
    listado: {
      titulo: (item) => item.libro_titulo,
      subtitulo: (item) => `Donante: ${item.donante}`,
      badges: (item) => [{ texto: `x${item.cantidad}`, tono: 'accent' }],
      meta: (item) => item.observaciones,
    },
    crear: {
      campos: [
        { name: 'libro', label: 'Libro donado', type: 'select-resource', resource: 'libros', labelKey: 'titulo', required: true },
        { name: 'donante', label: 'Donante', type: 'text', required: true },
        { name: 'cantidad', label: 'Cantidad', type: 'number', required: true },
        { name: 'observaciones', label: 'Observaciones', type: 'multiline' },
      ],
    },
  },
};
