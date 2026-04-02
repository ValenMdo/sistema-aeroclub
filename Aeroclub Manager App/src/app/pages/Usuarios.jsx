import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from '../components/Sidebar';
import Card, { CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import FormInput from '../components/ui/FormInput';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import { fetchUsers, createUser } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

/**
 * Componente Usuarios - Gestión de usuarios (Solo ADMIN)
 * 
 * Permite gestionar los usuarios del sistema (administradores e instructores).
 * 
 * IMPORTANTE: Solo accesible para usuarios con rol ADMIN.
 * 
 * CONECTADO CON BACKEND:
 * - GET /api/usuarios - Obtener lista de usuarios
 * - POST /api/usuarios - Crear nuevo usuario
 */
export default function Usuarios() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'INSTRUCTOR',
  });

  // Verificar permisos
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin()) {
      loadUsuarios();
    }
  }, [isAdmin]);

  /**
   * Carga la lista de usuarios
   * Endpoint: GET /api/usuarios (Solo ADMIN)
   */
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUsers();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios. Intenta nuevamente.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre el modal para crear un usuario
   */
  const handleOpenModal = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: 'INSTRUCTOR',
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
  };

  /**
   * Crea un nuevo usuario
   * Endpoint: POST /api/usuarios (Solo ADMIN)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSubmitting(false);
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setSubmitting(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await createUser(userData);
      
      setSuccess('Usuario creado exitosamente');
      setShowModal(false);
      loadUsuarios();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setError(error.message || 'Error al crear el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  // Definición de columnas de la tabla
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    {
      key: 'rol',
      label: 'Rol',
      render: (row) => (
        <Badge variant={row.rol === 'ADMIN' ? 'info' : 'default'}>
          {row.rol}
        </Badge>
      ),
    },
  ];

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-800 mb-2">
              Usuarios
            </h1>
            <p className="text-gray-600">Gestión de usuarios del sistema (Solo Administradores)</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nuevo Usuario
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
          <Loader text="Cargando usuarios..." />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Listado de Usuarios</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <Table columns={columns} data={usuarios} />
            </CardBody>
          </Card>
        )}

        {/* Modal para crear usuario */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Nuevo Usuario"
        >
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre completo del usuario"
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

            <Select
              label="Rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              options={[
                { value: 'INSTRUCTOR', label: 'Instructor' },
                { value: 'ADMIN', label: 'Administrador' },
              ]}
              required
            />

            <FormInput
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />

            <FormInput
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repetir contraseña"
              required
            />

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Asegúrate de compartir las credenciales de acceso
                con el nuevo usuario de forma segura.
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
                {submitting ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Información del endpoint */}
        <div className="mt-6">
          <Card>
            <CardBody className="bg-blue-50">
              <p className="text-sm text-blue-800 mb-1">
                <strong>Endpoints conectados (Solo ADMIN):</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• GET /api/usuarios - Obtener lista de usuarios</li>
                <li>• POST /api/usuarios - Crear nuevo usuario</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
