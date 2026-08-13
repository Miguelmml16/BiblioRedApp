// Hook compartido por los módulos: carga (con spinner), error con reintento,
// pull-to-refresh y creación de registros contra la API real.
import { useCallback, useEffect, useState } from 'react';
import { listAll, createResource } from '../services/resources';

export function useResourceList(resource) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const load = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
        const items = await listAll(resource);
        setData(items);
      } catch (e) {
        setError(e.message || 'No se pudieron cargar los datos.');
      } finally {
        isRefresh ? setRefreshing(false) : setLoading(false);
      }
    },
    [resource]
  );

  useEffect(() => {
    load(false);
  }, [load]);

  const create = useCallback(
    async (payload) => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const nuevo = await createResource(resource, payload);
        setData((prev) => [nuevo, ...prev]);
        return true;
      } catch (e) {
        setSubmitError(e.message || 'No se pudo guardar el registro.');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [resource]
  );

  return {
    data,
    loading,
    refreshing,
    error,
    submitting,
    submitError,
    reload: () => load(false),
    refresh: () => load(true),
    create,
    clearSubmitError: () => setSubmitError(null),
  };
}
