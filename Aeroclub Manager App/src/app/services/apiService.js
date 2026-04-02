/**
 * Servicio de API para el sistema de gestión de aeroclubes
 * 
 * Este archivo contiene todas las funciones para consumir
 * la API REST del backend Spring Boot.
 * 
 * Todas las funciones incluyen documentación sobre:
 * - Endpoint utilizado
 * - Método HTTP
 * - Input esperado
 * - Output esperado
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Helper para obtener el token
const getToken = () => {
  const token = localStorage.getItem('token');
  // Evitamos enviar "Bearer undefined" si quedó basura en localStorage.
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
};

// Helper para headers con autenticación
const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    // Si el backend rechaza la sesión, limpiamos para que el usuario vuelva a loguearse.
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Notificamos a la capa de auth para que invalide el estado en memoria.
      window.dispatchEvent(new Event('auth:expired'));
    }
    throw { status: response.status, message: error.message || 'Error' };
  }
  return response.json();
};

// ==========================================
// DASHBOARD
// ==========================================

/**
 * Obtiene las estadísticas del dashboard
 * 
 * Endpoint: GET /api/dashboard/stats
 * Output: {
 *   vuelosHoy: number,
 *   horasVoladas: number,
 *   avionesDisponibles: number,
 *   mantenimientosPendientes: number
 * }
 */
export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ==========================================
// VUELOS / CLASES
// ==========================================

/**
 * Obtiene la lista de todos los vuelos
 * 
 * Endpoint: GET /api/vuelos
 * Output: Array<{
 *   id: number,
 *   fecha: string,
 *   horasVuelo: number,
 *   tipoVuelo: string,
 *   observaciones: string,
 *   student: { nombre: string, apellido: string, ... },
 *   instructor: { nombre: string, ... },
 *   avion: { matricula: string, ... }
 * }>
 */
export const fetchFlights = async () => {
  const response = await fetch(`${API_BASE_URL}/api/vuelos`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Crea un nuevo vuelo/clase
 * 
 * Endpoint: POST /api/vuelos
 * Input: {
 *   studentId: number,
 *   instructorId: number,
 *   aircraftId: number,
 *   horasVuelo: number,
 *   tipoVuelo: string,
 *   observaciones: string
 * }
 * Output: { id: number, ...flightData }
 * 
 * IMPORTANTE: Al crear un vuelo:
 * - Se suman las horas al avión
 * - Se suman las horas al alumno
 */
export const createFlight = async (data) => {
  // El backend `VueloDTO` NO tiene `fecha`, así que la removemos si el frontend la envía.
  const { fecha, ...payload } = data || {};

  const response = await fetch(`${API_BASE_URL}/api/vuelos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

// ==========================================
// ALUMNOS
// ==========================================

/**
 * Obtiene la lista de todos los alumnos
 * 
 * Endpoint: GET /api/estudiantes
 * Output: Array<{
 *   id: number,
 *   nombre: string,
 *   apellido: string,
 *   email: string,
 *   telefono: string,
 *   horasTotales: number,
 *   estado: string
 * }>
 */
export const fetchStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/api/estudiantes`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Crea un nuevo alumno
 * 
 * Endpoint: POST /api/estudiantes
 * Input: {
 *   nombre: string,
 *   apellido: string,
 *   email: string,
 *   telefono: string,
 *   estado: string
 * }
 * Output: { id: number, ...studentData }
 */
export const createStudent = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/estudiantes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * Actualiza un alumno existente
 * 
 * Endpoint: PUT /api/estudiantes/{id}
 * Input: {
 *   nombre: string,
 *   apellido: string,
 *   email: string,
 *   telefono: string,
 *   estado: string
 * }
 * Output: { id: number, ...updatedData }
 */
export const updateStudent = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/estudiantes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// ==========================================
// AVIONES
// ==========================================

/**
 * Obtiene la lista de todos los aviones
 * 
 * Endpoint: GET /api/avion
 * Output: Array<{
 *   id: number,
 *   matricula: string,
 *   modelo: string,
 *   horasTotales: number,
 *   estado: string ('DISPONIBLE' | 'MANTENIMIENTO' | 'FUERA_SERVICIO')
 * }>
 */
export const fetchAircraft = async () => {
  const response = await fetch(`${API_BASE_URL}/api/avion`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Crea un nuevo avión
 * 
 * Endpoint: POST /api/avion
 * Input: {
 *   matricula: string,
 *   modelo: string,
 *   estado: string
 * }
 * Output: { id: number, ...aircraftData }
 */
export const createAircraft = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/avion`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * Actualiza un avión existente
 * 
 * Endpoint: PUT /api/avion/{id}
 * Input: {
 *   matricula: string,
 *   modelo: string,
 *   estado: string
 * }
 * Output: { id: number, ...updatedData }
 */
export const updateAircraft = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/avion/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// ==========================================
// MANTENIMIENTOS
// ==========================================

/**
 * Obtiene la lista de todos los mantenimientos
 * 
 * Endpoint: GET /api/mantenimiento
 * Output: Array<{
 *   id: number,
 *   horasAvion: number,
 *   tipo: string,
 *   fecha: string,
 *   horasAvion: number,
 *   descripcion: string
 * }>
 */
export const fetchMaintenance = async () => {
  const response = await fetch(`${API_BASE_URL}/api/mantenimiento`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Crea un nuevo mantenimiento
 * 
 * Endpoint: POST /api/mantenimiento
 * Input: {
 *   aircraftId: number,
 *   tipo: string,
 *   fecha: string (YYYY-MM-DD),
 *   horasAvion: number,
 *   descripcion: string
 * }
 * Output: { id: number, ...maintenanceData }
 */
export const createMaintenance = async (data) => {
  // Mantenimientos del frontend usan `tipoMantenimiento`, pero el backend espera `tipo`.
  const { tipoMantenimiento, tipo, ...rest } = data || {};
  const payload = { ...rest, tipo: tipo ?? tipoMantenimiento };

  const response = await fetch(`${API_BASE_URL}/api/mantenimiento`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

// ==========================================
// USUARIOS (Solo ADMIN)
// ==========================================

/**
 * Obtiene la lista de todos los usuarios (Solo ADMIN)
 * 
 * Endpoint: GET /api/usuarios
 * Output: Array<{
 *   id: number,
 *   nombre: string,
 *   email: string,
 *   rol: string ('ADMIN' | 'INSTRUCTOR')
 * }>
 */
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Crea un nuevo usuario (Solo ADMIN)
 * 
 * Endpoint: POST /api/usuarios
 * Input: {
 *   nombre: string,
 *   email: string,
 *   password: string,
 * }
 * Output: { id: number, ...userData }
 */
export const createUser = async (data) => {
  // El backend `UsuarioCreateDTO` NO tiene `rol`, así que si el frontend lo envía lo ignoramos.
  const { rol, ...payload } = data || {};

  const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};
