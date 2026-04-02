import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card, { CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Select from '../components/ui/Select';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import { fetchMaintenance, createMaintenance, fetchAircraft } from '../services/apiService';
import { Plus } from 'lucide-react';

/**
 * Componente Mantenimientos - Gestión de mantenimientos
 * 
 * Permite registrar y consultar mantenimientos realizados a los aviones.
 * 
 * CONECTADO CON BACKEND:
 * - GET /api/mantenimiento - Obtener lista de mantenimientos
 * - POST /api/mantenimiento - Crear nuevo mantenimiento
 * - GET /api/avion - Obtener aviones para el selector
 */
export default function Mantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [aviones, setAviones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    aircraftId: '',
    tipoMantenimiento: '',
    fecha: new Date().toISOString().split('T')[0],
    horasAvion: '',
    descripcion: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Carga todos los datos necesarios
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [mantenimientosData, avionesData] = await Promise.all([
        fetchMaintenance(),
        fetchAircraft(),
      ]);
      
      setMantenimientos(mantenimientosData);
      setAviones(avionesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos. Intenta nuevamente.');
      
      setMantenimientos([]);
      setAviones([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre el modal para crear un mantenimiento
   */
  const handleOpenModal = () => {
    setFormData({
      aircraftId: '',
      tipoMantenimiento: '',
      fecha: new Date().toISOString().split('T')[0],
      horasAvion: '',
      descripcion: '',
    });
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
    
    // Si cambia el avión, auto-completar las horas
    if (e.target.name === 'aircraftId' && e.target.value) {
      const avion = aviones.find(a => a.id === parseInt(e.target.value));
      if (avion) {
        setFormData(prev => ({
          ...prev,
          horasAvion: avion.horasTotales || 0,
        }));
      }
    }
  };

  /**
   * Registra un nuevo mantenimiento
   * Endpoint: POST /api/mantenimiento
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // MantenimientoDTO del backend espera:
      // - aircraftId
      // - tipo (no `tipoMantenimiento`)
      // - fecha, horasAvion, descripcion
      const data = {
        aircraftId: parseInt(formData.aircraftId),
        tipo: formData.tipoMantenimiento,
        fecha: formData.fecha,
        horasAvion: parseFloat(formData.horasAvion),
        descripcion: formData.descripcion,
      };
      
      await createMaintenance(data);
      
      setSuccess('Mantenimiento registrado exitosamente');
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error al registrar mantenimiento:', error);
      setError(error.message || 'Error al registrar el mantenimiento');
    } finally {
      setSubmitting(false);
    }
  };

  // Definición de columnas de la tabla
  const columns = [
    { key: 'fecha', label: 'Fecha', render: (row) => row.fecha },
    {
      key: 'aircraftMatricula',
      label: 'Avión',
      render: (row) => row.avion?.matricula || '',
    },
    {
      key: 'tipoMantenimiento',
      label: 'Tipo de Mantenimiento',
      render: (row) => row.tipo || '',
    },
    {
      key: 'horasAvion',
      label: 'Horas del Avión',
      render: (row) => `${row.horasAvion || 0} hrs`,
    },
    { key: 'descripcion', label: 'Descripción' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-800 mb-2">
              Mantenimientos
            </h1>
            <p className="text-gray-600">Registro de mantenimientos de aviones</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Registrar Mantenimiento
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
          <Loader text="Cargando mantenimientos..." />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Listado de Mantenimientos</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <Table columns={columns} data={mantenimientos} />
            </CardBody>
          </Card>
        )}

        {/* Modal para registrar mantenimiento */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Registrar Nuevo Mantenimiento"
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Avión"
                name="aircraftId"
                value={formData.aircraftId}
                onChange={handleChange}
                options={aviones.map(a => ({
                  value: a.id,
                  label: `${a.matricula} - ${a.modelo}`,
                }))}
                required
              />

              <Select
                label="Tipo de Mantenimiento"
                name="tipoMantenimiento"
                value={formData.tipoMantenimiento}
                onChange={handleChange}
                options={[
                  { value: '25 horas', label: '25 horas' },
                  { value: '50 horas', label: '50 horas' },
                  { value: '100 horas', label: '100 horas' },
                  { value: 'Anual', label: 'Anual' },
                  { value: 'Correctivo', label: 'Correctivo' },
                  { value: 'Preventivo', label: 'Preventivo' },
                ]}
                required
              />

              <FormInput
                label="Fecha"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Horas del Avión"
                type="number"
                step="0.1"
                name="horasAvion"
                value={formData.horasAvion}
                onChange={handleChange}
                placeholder="Ej: 150.5"
                required
              />
            </div>

            <FormInput
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción del mantenimiento realizado..."
              required
            />

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
                {submitting ? 'Registrando...' : 'Registrar Mantenimiento'}
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
                <li>• GET /api/mantenimiento - Obtener lista de mantenimientos</li>
                <li>• POST /api/mantenimiento - Registrar nuevo mantenimiento</li>
                <li>• GET /api/avion - Obtener aviones</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
