import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card, { CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import { fetchAircraft, createAircraft, updateAircraft } from '../services/apiService';
import { Plus, Edit } from 'lucide-react';

/**
 * Componente Aviones - Gestión de aeronaves
 * 
 * Permite gestionar la información de los aviones del aeroclub.
 * 
 * CONECTADO CON BACKEND:
 * - GET /api/avion - Obtener lista de aviones
 * - POST /api/avion - Crear nuevo avión
 * - PUT /api/avion/{id} - Actualizar avión existente
 * 
 * Estados posibles:
 * - Disponible: El avión está operativo y disponible para volar
 * - Mantenimiento: El avión está en mantenimiento programado
 * - Fuera de servicio: El avión no está disponible
 */
export default function Aviones() {
  const [aviones, setAviones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingAvion, setEditingAvion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    matricula: '',
    modelo: '',
    estado: 'DISPONIBLE',
  });

  useEffect(() => {
    loadAviones();
  }, []);

  /**
   * Carga la lista de aviones
   * Endpoint: GET /api/avion
   */
  const loadAviones = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAircraft();
      setAviones(data);
    } catch (error) {
      console.error('Error al cargar aviones:', error);
      setError('Error al cargar los aviones. Intenta nuevamente.');
      setAviones([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre el modal para crear o editar un avión
   */
  const handleOpenModal = (avion = null) => {
    if (avion) {
      setEditingAvion(avion);
      setFormData({
        matricula: avion.matricula,
        modelo: avion.modelo,
        estado: avion.estado,
      });
    } else {
      setEditingAvion(null);
      setFormData({
        matricula: '',
        modelo: '',
        estado: 'DISPONIBLE',
      });
    }
    setShowModal(true);
  };

  /**
   * Maneja el cambio en los inputs del formulario
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Guarda un avión (crear o actualizar)
   * Endpoints:
   * - POST /api/avion (crear)
   * - PUT /api/avion/{id} (actualizar)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingAvion) {
        await updateAircraft(editingAvion.id, formData);
        setSuccess('Avión actualizado exitosamente');
      } else {
        await createAircraft(formData);
        setSuccess('Avión creado exitosamente');
      }
      
      setShowModal(false);
      setEditingAvion(null);
      loadAviones();
    } catch (error) {
      console.error('Error al guardar avión:', error);
      setError(error.message || 'Error al guardar el avión');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Determina la variante del badge según el estado del avión
   */
  const getEstadoVariant = (estado) => {
    const normalized = String(estado || '').trim().toUpperCase();
    const estados = {
      DISPONIBLE: 'success',
      MANTENIMIENTO: 'warning',
      FUERA_SERVICIO: 'danger',
    };
    return estados[normalized] || 'default';
  };

  const getEstadoLabel = (estado) => {
    const normalized = String(estado || '').trim().toUpperCase();
    const labels = {
      DISPONIBLE: 'Disponible',
      MANTENIMIENTO: 'Mantenimiento',
      FUERA_SERVICIO: 'Fuera de servicio',
    };
    return labels[normalized] || estado;
  };

  // Definición de columnas de la tabla
  const columns = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'modelo', label: 'Modelo' },
    {
      key: 'horasTotales',
      label: 'Horas Totales',
      render: (row) => `${row.horasTotales || 0} hrs`,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => (
        <Badge variant={getEstadoVariant(row.estado)}>
          {getEstadoLabel(row.estado)}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <button
          onClick={() => handleOpenModal(row)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Edit size={16} />
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-800 mb-2">
              Aviones
            </h1>
            <p className="text-gray-600">Gestión de aeronaves del aeroclub</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nuevo Avión
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
        )}
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />
        )}

        {/* Contenido */}
        {loading ? (
          <Loader text="Cargando aviones..." />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Listado de Aviones</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <Table columns={columns} data={aviones} />
            </CardBody>
          </Card>
        )}

        {/* Modal para crear/editar avión */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingAvion ? 'Editar Avión' : 'Nuevo Avión'}
        >
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Matrícula"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              placeholder="Ej: LV-ABC"
              required
            />

            <FormInput
              label="Modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Ej: Cessna 172"
              required
            />

            <Select
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              options={[
                { value: 'DISPONIBLE', label: 'Disponible' },
                { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
                { value: 'FUERA_SERVICIO', label: 'Fuera de Servicio' },
              ]}
              required
            />

            {editingAvion && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Horas totales:</strong> {editingAvion.horasTotales || 0} hrs
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Las horas totales se actualizan automáticamente al registrar vuelos.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={submitting}
              >
                {submitting ? 'Guardando...' : editingAvion ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Información del endpoint */}
        <div className="mt-6">
          <Card>
            <CardBody className="bg-blue-50">
              <p className="text-sm text-blue-800 mb-1">
                <strong>Endpoints conectados:</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• GET /api/avion - Obtener lista de aviones</li>
                <li>• POST /api/avion - Crear nuevo avión</li>
                <li>• PUT /api/avion/&#123;id&#125; - Actualizar avión</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
