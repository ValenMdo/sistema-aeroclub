import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Ticket, PlusCircle, User, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Sidebar - Menú lateral de navegación
 * 
 * Este componente muestra el menú lateral con las opciones principales
 * de navegación de la aplicación.
 * 
 * CONECTADO CON BACKEND:
 * - Usa useAuth() para obtener información del usuario y logout()
 * - El logout() llama automáticamente a POST /api/auth/logout
 * - Puede mostrar/ocultar opciones según el rol del usuario
 */
export default function Sidebar() {
  const { logout, user, isTrabajador } = useAuth();

  /**
   * Maneja el cierre de sesión
   * Endpoint: POST /api/auth/logout
   * El método logout() del contexto maneja todo automáticamente
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aunque falle, redirigir al login
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
        <h1 className="text-xl text-gray-800">Gestión de Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">Sistema POO</p>
        {user && (
          <p className="text-xs text-gray-400 mt-2">
            {user.nombre} - {user.rol}
          </p>
        )}
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* Inicio / Dashboard */}
          <li>
            <NavLink to="/dashboard" className={linkClasses}>
              <Home size={20} />
              <span>Inicio</span>
            </NavLink>
          </li>

          {/* Tickets (Listado) */}
          <li>
            <NavLink to="/tickets" className={linkClasses}>
              <Ticket size={20} />
              <span>Tickets</span>
            </NavLink>
          </li>

          {/* Crear Ticket - Solo visible para trabajadores */}
          {isTrabajador && (
            <li>
              <NavLink to="/create-ticket" className={linkClasses}>
                <PlusCircle size={20} />
                <span>Crear Ticket</span>
              </NavLink>
            </li>
          )}

          {/* Perfil */}
          <li>
            <NavLink to="/perfil" className={linkClasses}>
              <User size={20} />
              <span>Perfil</span>
            </NavLink>
          </li>

          {/* Soporte */}
          <li>
            <NavLink to="/soporte" className={linkClasses}>
              <HelpCircle size={20} />
              <span>Soporte</span>
            </NavLink>
          </li>
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
