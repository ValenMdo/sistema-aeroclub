import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexto de Autenticación
 * 
 * Maneja el estado de autenticación del usuario en toda la aplicación.
 * 
 * Endpoints relacionados:
 * - POST /api/auth/login - Iniciar sesión
 * - POST /api/auth/logout - Cerrar sesión
 * 
 * Almacena el token JWT en localStorage y proporciona funciones
 * para login, logout y verificación de autenticación.
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al cargar la aplicación, verificar si hay un token guardado
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    // Evitamos aceptar valores basura (ej: "undefined") si quedaron de intentos anteriores.
    const tokenValid = storedToken && storedToken !== 'undefined' && storedToken !== 'null';
    if (tokenValid && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Si una llamada a la API devuelve 401, invalidamos el estado en memoria.
  useEffect(() => {
    const onExpired = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    };

    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  /**
   * Función de login
   * Endpoint: POST /api/auth/login
   * Body: { email, password }
   * Response: { token, usuario: { id, nombre, email, rol } }
   */
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Algunos 401 vienen con body vacío (o no-JSON). Evitamos romper con SyntaxError.
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al iniciar sesión (${response.status})`);
      }

      const data = await response.json();
      
      // Guardar token y usuario
      if (!data || !data.token || !data.usuario) {
        throw new Error('Respuesta de login inválida: faltan `token` y/o `usuario`');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      
      setToken(data.token);
      setUser(data.usuario);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  /**
   * Función de logout
   * Endpoint: POST /api/auth/logout
   */
  const logout = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        // Intentar hacer logout en el backend
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local siempre
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Verificar si el usuario es administrador
   */
  const isAdmin = () => {
    if (!user || !user.rol) return false;
    const rol = String(user.rol).trim().toUpperCase();
    return rol === 'ADMIN' || user.rol === 'Administrador';
  };

  /**
   * Verificar si el usuario es instructor
   */
  const isInstructor = () => {
    if (!user || !user.rol) return false;
    const rol = String(user.rol).trim().toUpperCase();
    return rol === 'INSTRUCTOR' || user.rol === 'Instructor';
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin,
    isInstructor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
