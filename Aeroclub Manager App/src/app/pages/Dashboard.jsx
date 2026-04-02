import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card, { CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import { fetchDashboardStats } from '../services/apiService';
import { PlaneTakeoff, Clock, Plane, Wrench } from 'lucide-react';

/**
 * Componente Dashboard - Vista principal
 * 
 * Muestra estadísticas generales del aeroclub:
 * - Vuelos del día
 * - Horas voladas totales
 * - Aviones disponibles
 * - Mantenimientos pendientes
 * 
 * CONECTADO CON BACKEND:
 * - Endpoint: GET /api/dashboard/stats
 * - Output: {
 *     vuelosHoy: number,
 *     horasVoladas: number,
 *     avionesDisponibles: number,
 *     mantenimientosPendientes: number
 *   }
 */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  /**
   * Carga las estadísticas del dashboard
   * Endpoint: GET /api/dashboard/stats
   */
  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError('Error al cargar las estadísticas. Intenta nuevamente.');
      
      // Datos de ejemplo para desarrollo
      setStats({
        vuelosHoy: 0,
        horasVoladas: 0,
        avionesDisponibles: 0,
        mantenimientosPendientes: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Resumen general del aeroclub</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
        )}

        {/* Contenido */}
        {loading ? (
          <Loader text="Cargando estadísticas..." />
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card: Vuelos del día */}
            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PlaneTakeoff className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vuelos del Día</p>
                  <p className="text-2xl text-gray-800">{stats.vuelosHoy}</p>
                </div>
              </CardBody>
            </Card>

            {/* Card: Horas voladas */}
            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Horas Voladas</p>
                  <p className="text-2xl text-gray-800">{stats.horasVoladas}</p>
                </div>
              </CardBody>
            </Card>

            {/* Card: Aviones disponibles */}
            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Plane className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aviones Disponibles</p>
                  <p className="text-2xl text-gray-800">{stats.avionesDisponibles}</p>
                </div>
              </CardBody>
            </Card>

            {/* Card: Mantenimientos pendientes */}
            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Wrench className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mantenimientos Pendientes</p>
                  <p className="text-2xl text-gray-800">{stats.mantenimientosPendientes}</p>
                </div>
              </CardBody>
            </Card>
          </div>
        ) : null}

        {/* Información de ayuda */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido a Aeroclub Manager</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 mb-4">
                Este sistema te permite gestionar de manera eficiente todas las
                operaciones de tu aeroclub:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Registrar y consultar vuelos y clases</li>
                <li>Gestionar información de alumnos</li>
                <li>Controlar el estado de los aviones</li>
                <li>Programar y dar seguimiento a mantenimientos</li>
                <li>Administrar usuarios del sistema (solo administradores)</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Endpoint conectado:</strong> GET /api/dashboard/stats
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
