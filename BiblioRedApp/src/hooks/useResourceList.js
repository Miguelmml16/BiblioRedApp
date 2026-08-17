// Hook compartido por los módulos: carga (con spinner), error con reintento,
// pull-to-refresh y CRUD completo (crear/editar/eliminar) contra la API real.
import { useCallback, useEffect, useState } from 'react';
import { listAll, createResource, updateResource, deleteResource } from '../services/resources';

export function useResourceList(resource) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [mutatingId, setMutatingId] = useState(null);

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

  const update = useCallback(
    async (id, payload) => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const actualizado = await updateResource(resource, id, payload);
        setData((prev) => prev.map((item) => (item.id === id ? actualizado : item)));
        return true;
      } catch (e) {
        setSubmitError(e.message || 'No se pudo actualizar el registro.');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [resource]
  );

  // Actualización "silenciosa" para acciones rápidas de fila (ej. Devolver),
  // con su propio indicador de carga por id en vez del spinner del formulario.
  const quickUpdate = useCallback(
    async (id, payload) => {
      setMutatingId(id);
      setError(null);
      try {
        const actualizado = await updateResource(resource, id, payload);
        setData((prev) => prev.map((item) => (item.id === id ? actualizado : item)));
        return true;
      } catch (e) {
        setError(e.message || 'No se pudo actualizar el registro.');
        return false;
      } finally {
        setMutatingId(null);
      }
    },
    [resource]
  );

  const remove = useCallback(
    async (id) => {
      setMutatingId(id);
      setError(null);
      try {
        await deleteResource(resource, id);
        setData((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (e) {
        setError(e.message || 'No se pudo eliminar el registro.');
        return false;
      } finally {
        setMutatingId(null);
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
    mutatingId,
    reload: () => load(false),
    refresh: () => load(true),
    create,
    update,
    quickUpdate,
    remove,
    clearSubmitError: () => setSubmitError(null),
  };
}
