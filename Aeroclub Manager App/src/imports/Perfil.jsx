import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser, changePassword } from '../services/apiService';

/**
 * Componente Perfil - Información del usuario
 * 
 * Muestra la información del usuario autenticado:
 * - Nombre
 * - Rol (Administrador, Técnico, Trabajador)
 * - Email
 * 
 * Si el rol es Administrador, muestra opciones adicionales
 * como "Gestionar usuarios".
 * 
 * CONECTADO CON BACKEND:
 * - Usa useAuth() para obtener datos del usuario autenticado
 * - Usa getCurrentUser() para refrescar datos desde GET /api/users/me
 * - Usa changePassword() para cambiar contraseña con PUT /api/users/change-password
 */
export default function Perfil() {
  const { user: authUser, refreshUser } = useAuth();
  
  // Estado para la información del usuario
  const [userInfo, setUserInfo] = useState(null);

  // Estado de carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para cambio de contraseña
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // useEffect para cargar información del usuario
  useEffect(() => {
    loadUserInfo();
  }, [authUser]);

  /**
   * Carga la información del usuario desde el backend
   * Endpoint: GET /api/users/me
   */
  const loadUserInfo = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Intentar obtener del contexto primero, si no existe, hacer petición
      if (authUser) {
        setUserInfo(authUser);
      } else {
        const userData = await getCurrentUser();
        setUserInfo(userData);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setError('Error al cargar la información del usuario.');
      
      // Si hay datos en el contexto, usarlos como fallback
      if (authUser) {
        setUserInfo(authUser);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el cambio de contraseña
   * Endpoint: PUT /api/users/change-password
   * Body: { currentPassword, newPassword }
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    // Validar longitud mínima
    if (passwordData.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setChangingPassword(true);
      
      // Llamar al servicio API
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      alert('Contraseña actualizada exitosamente.');
      
      // Limpiar el formulario y ocultarlo
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      let errorMessage = 'Error al cambiar la contraseña.';
      if (error.status === 401) {
        errorMessage = 'La contraseña actual es incorrecta.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setPasswordError(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  // Función para gestionar usuarios (solo admin)
  const handleManageUsers = () => {
    // TODO: Implementar pantalla de gestión de usuarios
    alert('Funcionalidad de gestión de usuarios.\n\nEndpoint: GET /api/users (solo administradores)\n\nEsta funcionalidad puede implementarse en una futura actualización.');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-800 mb-2">
            Mi Perfil
          </h1>
          <p className="text-gray-600">Información de tu cuenta</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={loadUserInfo}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Contenido del perfil */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        ) : userInfo ? (
          <div className="max-w-2xl">
            {/* Card de información del usuario */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              {/* Avatar y nombre */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                  {userInfo.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl text-gray-800">
                    {userInfo.nombre}
                  </h2>
                  <p className="text-gray-600">{userInfo.rol}</p>
                </div>
              </div>

              {/* Información detallada */}
              <div className="space-y-6">
                {/* ID de Usuario */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    ID de Usuario
                  </label>
                  <p className="text-gray-800">{userInfo.id}</p>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Nombre Completo
                  </label>
                  <p className="text-gray-800">{userInfo.nombre}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Correo Electrónico
                  </label>
                  <p className="text-gray-800">{userInfo.email}</p>
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Rol en el Sistema
                  </label>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {userInfo.rol}
                  </span>
                </div>
              </div>

              {/* Botón cambiar contraseña */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cambiar Contraseña
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Cambiar Contraseña
                    </h3>
                    
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {/* Contraseña actual */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={changingPassword}
                        />
                      </div>

                      {/* Nueva contraseña */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          minLength={6}
                          disabled={changingPassword}
                        />
                      </div>

                      {/* Confirmar contraseña */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={changingPassword}
                        />
                      </div>

                      {/* Mensaje de error */}
                      {passwordError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">{passwordError}</p>
                        </div>
                      )}

                      {/* Botones */}
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: '',
                            });
                            setPasswordError('');
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          disabled={changingPassword}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                          disabled={changingPassword}
                        >
                          {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Opciones de administrador */}
            {userInfo.rol === 'Administrador' && (
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-8">
                <h2 className="text-lg text-purple-800 mb-4">
                  Opciones de Administrador
                </h2>
                <p className="text-sm text-purple-700 mb-4">
                  Como administrador, tienes acceso a funcionalidades adicionales
                  del sistema.
                </p>
                <button
                  onClick={handleManageUsers}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Gestionar Usuarios
                </button>
              </div>
            )}

            {/* Información sobre el endpoint */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg text-blue-800 mb-2">
                Endpoint de API
              </h2>
              <div className="space-y-2 text-sm text-blue-700">
                <p>
                  <strong>Obtener perfil:</strong> GET /api/users/me (conectado)
                </p>
                <p>
                  <strong>Cambiar contraseña:</strong> PUT /api/users/change-password (conectado)
                </p>
                {(userInfo.rol === 'Administrador' || userInfo.rol === 'ADMINISTRADOR') && (
                  <p>
                    <strong>Gestionar usuarios:</strong> GET /api/users (disponible para implementar)
                  </p>
                )}
                <p className="mt-4">
                  La información del usuario se obtiene del token de autenticación JWT.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No se pudo cargar la información del usuario.</p>
            <button
              onClick={loadUserInfo}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
