import React from 'react';
import { NavLink } from 'react-router';
import { Home, Plane, Users, PlaneTakeoff, Wrench, UserCog, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Sidebar - Menú lateral de navegación
 * 
 * Menú principal de la aplicación con las siguientes secciones:
 * - Dashboard (todos)
 * - Vuelos/Clases (todos)
 * - Alumnos (todos)
 * - Aviones (todos)
 * - Mantenimientos (todos)
 * - Usuarios (solo ADMIN)
 * 
 * CONECTADO CON BACKEND:
 * - Usa useAuth() para obtener información del usuario y logout()
 * - El logout() llama automáticamente a POST /api/auth/logout
 * - Muestra/oculta opciones según el rol del usuario
 */
export default function Sidebar() {
  const { logout, user, isAdmin } = useAuth();

  /**
   * Maneja el cierre de sesión
   * Endpoint: POST /api/auth/logout
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Estilos para los enlaces activos e inactivos
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 bg-white h-screen shadow-md flex flex-col fixed left-0 top-0">
      {/* Header del sidebar */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl text-gray-800">Aeroclub Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Gestión de Aeroclubes</p>
        {user && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-800">{user.nombre}</p>
            <p className="text-xs text-gray-500">{user.rol}</p>
          </div>
        )}
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <NavLink to="/dashboard" className={linkClasses}>
              <Home size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Vuelos / Clases */}
          <li>
            <NavLink to="/vuelos" className={linkClasses}>
              <PlaneTakeoff size={20} />
              <span>Vuelos / Clases</span>
            </NavLink>
          </li>

          {/* Alumnos */}
          <li>
            <NavLink to="/alumnos" className={linkClasses}>
              <Users size={20} />
              <span>Alumnos</span>
            </NavLink>
          </li>

          {/* Aviones */}
          <li>
            <NavLink to="/aviones" className={linkClasses}>
              <Plane size={20} />
              <span>Aviones</span>
            </NavLink>
          </li>

          {/* Mantenimientos */}
          <li>
            <NavLink to="/mantenimientos" className={linkClasses}>
              <Wrench size={20} />
              <span>Mantenimientos</span>
            </NavLink>
          </li>

          {/* Usuarios - Solo visible para ADMIN */}
          {isAdmin() && (
            <li>
              <NavLink to="/usuarios" className={linkClasses}>
                <UserCog size={20} />
                <span>Usuarios</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
