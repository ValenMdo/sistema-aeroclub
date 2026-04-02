import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loader';

/**
 * Componente ProtectedRoute - Protege rutas que requieren autenticación
 * 
 * Si el usuario no está autenticado, lo redirige al login.
 * Mientras carga el estado de autenticación, muestra un loader.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader text="Cargando..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
