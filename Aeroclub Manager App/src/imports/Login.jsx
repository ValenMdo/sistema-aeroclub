import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Login - Pantalla de inicio de sesión
 * 
 * Permite al usuario ingresar con su ID y contraseña.
 * 
 * CONECTADO CON BACKEND:
 * - Usa el servicio apiService para llamar a POST /api/auth/login
 * - Utiliza AuthContext para gestionar el estado de autenticación
 * - Guarda token y datos del usuario automáticamente
 */
export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Llamar al servicio de autenticación
      // Endpoint: POST /api/auth/login
      // Body: { userId, password }
      await login(formData.userId, formData.password);
      
      // Redirigir al dashboard (el contexto ya actualizó el estado)
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Mostrar mensaje de error según el tipo
      if (error.status === 401) {
        setError('Credenciales incorrectas. Verifica tu ID y contraseña.');
      } else if (error.status === 404) {
        setError('Usuario no encontrado.');
      } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
        setError('Error de conexión. Verifica que el backend esté ejecutándose.');
      } else {
        setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-gray-800 mb-2">
            Gestión de Tickets
          </h1>
          <p className="text-gray-600">Sistema de Tickets POO</p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input ID */}
          <div>
            <label
              htmlFor="userId"
              className="block text-sm text-gray-700 mb-2"
            >
              ID de Usuario
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese su ID"
              required
            />
          </div>

          {/* Input Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        {/* Información del endpoint */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Endpoint conectado:</strong> POST /api/auth/login
          </p>
          <p className="text-xs text-blue-700">
            Verifica que el backend Spring Boot esté ejecutándose en{' '}
            {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}
          </p>
        </div>
      </div>
    </div>
  );
}
