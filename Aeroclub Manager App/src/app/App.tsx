import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';

/**
 * Componente principal de la aplicación
 * 
 * Aeroclub Manager - Sistema de Gestión de Aeroclubes
 * 
 * Stack:
 * - React con JavaScript
 * - Tailwind CSS
 * - React Router para navegación
 * - Context API para autenticación
 * 
 * Funcionalidades:
 * - Gestión de vuelos y clases
 * - Gestión de alumnos
 * - Gestión de aviones
 * - Control de mantenimientos
 * - Administración de usuarios (Solo ADMIN)
 * 
 * Backend:
 * - API REST con Spring Boot
 * - Autenticación con JWT
 */
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
