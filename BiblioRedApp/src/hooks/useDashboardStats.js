// Estadísticas del encabezado del dashboard: libros, ejemplares disponibles,
// socios y préstamos activos — calculadas en vivo desde la API.
import { useCallback, useEffect, useState } from 'react';
import { listAll } from '../services/resources';

const VACIO = { libros: 0, ejemplaresDisponibles: 0, socios: 0, prestamosActivos: 0 };

export function useDashboardStats(refreshKey = 0) {
  const [stats, setStats] = useState(VACIO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [libros, socios, prestamos] = await Promise.all([
        listAll('libros'),
        listAll('socios'),
        listAll('prestamos'),
      ]);
      setStats({
        libros: libros.length,
        ejemplaresDisponibles: libros.reduce((suma, l) => suma + (l.ejemplares_disponibles ?? 0), 0),
        socios: socios.length,
        prestamosActivos: prestamos.filter((p) => p.estado !== 'DEVUELTO').length,
      });
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las estadísticas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return { stats, loading, error, reload: load };
}
