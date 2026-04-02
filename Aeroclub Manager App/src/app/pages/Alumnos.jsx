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
import { fetchStudents, createStudent, updateStudent } from '../services/apiService';
import { Plus, Edit } from 'lucide-react';

/**
 * Componente Alumnos - Gestión de alumnos
 * 
 * Permite gestionar la información de los alumnos de la escuela de vuelo.
 * 
 * CONECTADO CON BACKEND:
 * - GET /api/estudiantes - Obtener lista de alumnos
 * - POST /api/estudiantes - Crear nuevo alumno
 * - PUT /api/estudiantes/{id} - Actualizar alumno existente
 */
export default function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    // El backend usa un enum: ACTIVO | INACTIVO | GRADUADO
    estado: 'ACTIVO',
  });

  useEffect(() => {
    loadAlumnos();
  }, []);

  /**
   * Carga la lista de alumnos
   * Endpoint: GET /api/estudiantes
   */
  const loadAlumnos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchStudents();
      setAlumnos(data);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      setError('Error al cargar los alumnos. Intenta nuevamente.');
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre el modal para crear o editar un alumno
   */
  const handleOpenModal = (alumno = null) => {
    if (alumno) {
      setEditingAlumno(alumno);
      setFormData({
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        email: alumno.email,
        telefono: alumno.telefono,
        estado: alumno.estado,
      });
    } else {
      setEditingAlumno(null);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        estado: 'ACTIVO',
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
   * Guarda un alumno (crear o actualizar)
   * Endpoints:
   * - POST /api/estudiantes (crear)
   * - PUT /api/estudiantes/{id} (actualizar)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingAlumno) {
        await updateStudent(editingAlumno.id, formData);
        setSuccess('Alumno actualizado exitosamente');
      } else {
        await createStudent(formData);
        setSuccess('Alumno creado exitosamente');
      }
      
      setShowModal(false);
      setEditingAlumno(null);
      loadAlumnos();
    } catch (error) {
      console.error('Error al guardar alumno:', error);
      setError(error.message || 'Error al guardar el alumno');
    } finally {
      setSubmitting(false);
    }
  };

  // Definición de columnas de la tabla
  const getEstadoVariant = (estado) => {
    // Equivalencia visual para el enum del backend
    const map = {
      ACTIVO: 'success',
      INACTIVO: 'warning',
      GRADUADO: 'default',
    };
    return map[estado] || 'default';
  };

  const getEstadoLabel = (estado) => {
    const map = {
      ACTIVO: 'Activo',
      INACTIVO: 'Inactivo',
      GRADUADO: 'Graduado',
    };
    return map[estado] || estado;
  };

  const columns = [
    { key: 'nombre', label: 'Nombre', render: (row) => `${row.nombre} ${row.apellido}` },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
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
              Alumnos
            </h1>
            <p className="text-gray-600">Gestión de alumnos de la escuela de vuelo</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nuevo Alumno
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
          <Loader text="Cargando alumnos..." />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Listado de Alumnos</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <Table columns={columns} data={alumnos} />
            </CardBody>
          </Card>
        )}

        {/* Modal para crear/editar alumno */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingAlumno ? 'Editar Alumno' : 'Nuevo Alumno'}
        >
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del alumno"
              required
            />

            <FormInput
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido del alumno"
              required
            />

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />

            <FormInput
              label="Teléfono"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+54 11 1234-5678"
              required
            />

            <Select
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              options={[
                { value: 'ACTIVO', label: 'Activo' },
                { value: 'INACTIVO', label: 'Inactivo' },
                { value: 'GRADUADO', label: 'Graduado' },
              ]}
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
                {submitting ? 'Guardando...' : editingAlumno ? 'Actualizar' : 'Crear'}
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
                <li>• GET /api/estudiantes - Obtener lista de alumnos</li>
                <li>• POST /api/estudiantes - Crear nuevo alumno</li>
                <li>• PUT /api/estudiantes/&#123;id&#125; - Actualizar alumno</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
