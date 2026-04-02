import { createBrowserRouter, Navigate } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vuelos from './pages/Vuelos';
import Alumnos from './pages/Alumnos';
import Aviones from './pages/Aviones';
import Mantenimientos from './pages/Mantenimientos';
import Usuarios from './pages/Usuarios';

/**
 * Configuración de rutas de la aplicación
 * 
 * Rutas públicas:
 * - /login - Pantalla de inicio de sesión
 * 
 * Rutas protegidas (requieren autenticación):
 * - /dashboard - Vista principal con estadísticas
 * - /vuelos - Gestión de vuelos y clases
 * - /alumnos - Gestión de alumnos
 * - /aviones - Gestión de aviones
 * - /mantenimientos - Gestión de mantenimientos
 * - /usuarios - Gestión de usuarios (Solo ADMIN)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vuelos',
    element: (
      <ProtectedRoute>
        <Vuelos />
      </ProtectedRoute>
    ),
  },
  {
    path: '/alumnos',
    element: (
      <ProtectedRoute>
        <Alumnos />
      </ProtectedRoute>
    ),
  },
  {
    path: '/aviones',
    element: (
      <ProtectedRoute>
        <Aviones />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mantenimientos',
    element: (
      <ProtectedRoute>
        <Mantenimientos />
      </ProtectedRoute>
    ),
  },
  {
    path: '/usuarios',
    element: (
      <ProtectedRoute>
        <Usuarios />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
