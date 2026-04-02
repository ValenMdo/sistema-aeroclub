import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card, { CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Select from '../components/ui/Select';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import { fetchFlights, createFlight, fetchStudents, fetchAircraft } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

/**
 * Componente Vuelos - Gestión de vuelos y clases
 * 
 * Permite registrar y consultar vuelos/clases realizadas.
 * 
 * CONECTADO CON BACKEND:
 * - GET /api/vuelos - Obtener lista de vuelos
 * - POST /api/vuelos - Registrar nuevo vuelo
 * - GET /api/estudiantes - Obtener alumnos para el selector
 * - GET /api/avion - Obtener aviones para el selector
 * 
 * IMPORTANTE: Al crear un vuelo se actualizan automáticamente:
 * - Horas totales del avión
 * - Horas totales del alumno
 */
export default function Vuelos() {
  const { user } = useAuth();
  
  const [vuelos, setVuelos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [aviones, setAviones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    studentId: '',
    instructorId: user?.id || '',
    aircraftId: '',
    horasVuelo: '',
    tipoVuelo: '',
    observaciones: '',
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
      
      const [vuelosData, alumnosData, avionesData] = await Promise.all([
        fetchFlights(),
        fetchStudents(),
        fetchAircraft(),
      ]);
      
      setVuelos(vuelosData);
      setAlumnos(alumnosData);
      setAviones(avionesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos. Intenta nuevamente.');
      
      // Datos de ejemplo para desarrollo
      setVuelos([]);
      setAlumnos([]);
      setAviones([]);
    } finally {
      setLoading(false);
    }
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
   * Registra un nuevo vuelo
   * Endpoint: POST /api/vuelos
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // VueloDTO del backend no acepta `fecha`, así que no lo incluimos en el payload.
      const data = {
        studentId: parseInt(formData.studentId),
        instructorId: parseInt(formData.instructorId),
        aircraftId: parseInt(formData.aircraftId),
        horasVuelo: parseFloat(formData.horasVuelo),
        // El backend espera el enum TiposDeVuelo: DUAL | SOLO | NAVEGACION | PRACTICA
        tipoVuelo: formData.tipoVuelo,
        observaciones: formData.observaciones,
      };
      
      await createFlight(data);
      
      setSuccess('Vuelo registrado exitosamente');
      setShowModal(false);
      
      // Resetear formulario
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        studentId: '',
        instructorId: user?.id || '',
        aircraftId: '',
        horasVuelo: '',
        tipoVuelo: '',
        observaciones: '',
      });
      
      // Recargar datos
      loadData();
    } catch (error) {
      console.error('Error al registrar vuelo:', error);
      setError(error.message || 'Error al registrar el vuelo');
    } finally {
      setSubmitting(false);
    }
  };

  // Definición de columnas de la tabla
  const getTipoVueloLabel = (tipoVuelo) => {
    const map = {
      DUAL: 'Instrucción',
      SOLO: 'Solo',
      NAVEGACION: 'Navegación',
      PRACTICA: 'Práctica',
    };
    return map[tipoVuelo] || tipoVuelo;
  };

  const columns = [
    { key: 'fecha', label: 'Fecha', render: (row) => row.fecha },
    {
      key: 'studentNombre',
      label: 'Alumno',
      render: (row) => `${row.student?.nombre || ''} ${row.student?.apellido || ''}`.trim(),
    },
    {
      key: 'instructorNombre',
      label: 'Instructor',
      render: (row) => row.instructor?.nombre || '',
    },
    {
      key: 'aircraftMatricula',
      label: 'Avión',
      render: (row) => row.avion?.matricula || '',
    },
    { key: 'horasVuelo', label: 'Horas', render: (row) => `${row.horasVuelo} hrs` },
    {
      key: 'tipoVuelo',
      label: 'Tipo de Vuelo',
      render: (row) => getTipoVueloLabel(row.tipoVuelo),
    },
    { key: 'observaciones', label: 'Observaciones' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-800 mb-2">
              Vuelos / Clases
            </h1>
            <p className="text-gray-600">Registro de vuelos y clases realizadas</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Registrar Vuelo
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
          <Loader text="Cargando vuelos..." />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Listado de Vuelos</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <Table columns={columns} data={vuelos} />
            </CardBody>
          </Card>
        )}

        {/* Modal para registrar vuelo */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Registrar Nuevo Vuelo"
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Fecha"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />

              <Select
                label="Alumno"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                options={alumnos.map(a => ({ value: a.id, label: `${a.nombre} ${a.apellido}` }))}
                required
              />

              <Select
                label="Avión"
                name="aircraftId"
                value={formData.aircraftId}
                onChange={handleChange}
                options={aviones.filter(a => a.estado === 'DISPONIBLE').map(a => ({
                  value: a.id,
                  label: `${a.matricula} - ${a.modelo}`
                }))}
                required
              />

              <FormInput
                label="Horas de Vuelo"
                type="number"
                step="0.1"
                name="horasVuelo"
                value={formData.horasVuelo}
                onChange={handleChange}
                placeholder="Ej: 1.5"
                required
              />

              <Select
                label="Tipo de Vuelo"
                name="tipoVuelo"
                value={formData.tipoVuelo}
                onChange={handleChange}
                options={[
                  { value: 'DUAL', label: 'Instrucción' },
                  { value: 'SOLO', label: 'Solo' },
                  { value: 'NAVEGACION', label: 'Navegación' },
                  { value: 'PRACTICA', label: 'Práctica' },
                ]}
                required
              />
            </div>

            <FormInput
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Observaciones adicionales..."
            />

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Al registrar el vuelo se actualizarán automáticamente
                las horas del avión y del alumno.
              </p>
            </div>

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
                {submitting ? 'Registrando...' : 'Registrar Vuelo'}
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
                <li>• GET /api/vuelos - Obtener lista de vuelos</li>
                <li>• POST /api/vuelos - Registrar nuevo vuelo</li>
                <li>• GET /api/estudiantes - Obtener alumnos</li>
                <li>• GET /api/avion - Obtener aviones</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
