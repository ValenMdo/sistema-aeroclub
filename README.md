# Aeroclub Manager

Sistema de gestión integral para aeroclubes y escuelas de vuelo desarrollado con React, JavaScript y Tailwind CSS.

## 📋 Descripción

Aeroclub Manager es una aplicación web tipo SaaS que permite gestionar de manera eficiente todas las operaciones de un aeroclub o escuela de vuelo, incluyendo:

- ✈️ Registro y consulta de vuelos y clases
- 👨‍🎓 Gestión de alumnos
- 🛩️ Control de aviones
- 🔧 Seguimiento de mantenimientos
- 👥 Administración de usuarios (Solo administradores)

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 (JavaScript)
- **Estilos**: Tailwind CSS v4
- **Routing**: React Router v7
- **Iconos**: Lucide React
- **Backend**: API REST con Spring Boot (separado)
- **Autenticación**: JWT (JSON Web Tokens)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Componentes reutilizables
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── FormInput.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Alert.jsx
│   │   ├── Sidebar.jsx      # Menú lateral
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Contexto de autenticación
│   ├── pages/
│   │   ├── Login.jsx        # Inicio de sesión
│   │   ├── Dashboard.jsx    # Vista principal
│   │   ├── Vuelos.jsx       # Gestión de vuelos
│   │   ├── Alumnos.jsx      # Gestión de alumnos
│   │   ├── Aviones.jsx      # Gestión de aviones
│   │   ├── Mantenimientos.jsx
│   │   └── Usuarios.jsx     # Solo ADMIN
│   ├── services/
│   │   └── apiService.js    # Servicios de API
│   ├── routes.jsx           # Configuración de rutas
│   └── App.tsx              # Componente principal
```

## 🔌 Endpoints de la API

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
  - Body: `{ userId, password }`
  - Response: `{ token, user }`

- `POST /api/auth/logout` - Cerrar sesión

### Dashboard

- `GET /api/dashboard/stats` - Obtener estadísticas generales
  - Response: `{ vuelosHoy, horasVoladas, avionesDisponibles, mantenimientosPendientes }`

### Vuelos

- `GET /api/flights` - Obtener lista de vuelos
- `POST /api/flights` - Registrar nuevo vuelo
  - Body: `{ fecha, studentId, instructorId, aircraftId, horasVuelo, tipoVuelo, observaciones }`
  - **Importante**: Actualiza automáticamente las horas del avión y del alumno

### Alumnos

- `GET /api/students` - Obtener lista de alumnos
- `POST /api/students` - Crear nuevo alumno
  - Body: `{ nombre, apellido, email, telefono, estado }`
- `PUT /api/students/{id}` - Actualizar alumno

### Aviones

- `GET /api/aircraft` - Obtener lista de aviones
- `POST /api/aircraft` - Crear nuevo avión
  - Body: `{ matricula, modelo, estado }`
- `PUT /api/aircraft/{id}` - Actualizar avión

**Estados posibles**: `disponible`, `mantenimiento`, `fuera de servicio`

### Mantenimientos

- `GET /api/maintenance` - Obtener lista de mantenimientos
- `POST /api/maintenance` - Registrar mantenimiento
  - Body: `{ aircraftId, tipoMantenimiento, fecha, horasAvion, descripcion }`

### Usuarios (Solo ADMIN)

- `GET /api/users` - Obtener lista de usuarios
- `POST /api/users` - Crear nuevo usuario
  - Body: `{ nombre, email, password, rol }`

**Roles disponibles**: `ADMIN`, `INSTRUCTOR`

## 🚀 Instalación y Uso

### Requisitos Previos

- Node.js 18+
- Backend Spring Boot ejecutándose (por defecto en http://localhost:8080)

### Configuración

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo `.env` basado en `.env.example`:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Build para Producción

```bash
npm run build
```

## 🎨 Características de Diseño

- **Estilo moderno y minimalista**: Diseño limpio con cards, sombras suaves y bordes redondeados
- **Sidebar fijo**: Navegación lateral siempre visible
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Estados visuales**: Loading states, mensajes de error y éxito
- **Feedback visual**: Confirmaciones en acciones críticas
- **Badges de estado**: Indicadores visuales de estados (disponible, mantenimiento, etc.)

## 🔐 Autenticación y Autorización

- Sistema de autenticación basado en JWT
- Token almacenado en localStorage
- Rutas protegidas con ProtectedRoute
- Control de acceso basado en roles:
  - **ADMIN**: Acceso completo a todas las funcionalidades
  - **INSTRUCTOR**: Acceso a todas las funcionalidades excepto gestión de usuarios

## 📝 Funcionalidades Principales

### Dashboard
Muestra estadísticas clave del aeroclub en tiempo real.

### Vuelos/Clases
- Registro de vuelos con información completa
- Actualización automática de horas de vuelo
- Filtros y búsqueda de vuelos

### Alumnos
- Alta, baja y modificación de alumnos
- Seguimiento de horas totales
- Estados: Activo, Inactivo, Suspendido

### Aviones
- Gestión de flota de aeronaves
- Control de horas totales
- Estados: Disponible, Mantenimiento, Fuera de servicio

### Mantenimientos
- Registro de mantenimientos preventivos y correctivos
- Tipos: 25h, 50h, 100h, Anual, Correctivo, Preventivo
- Historial completo de mantenimientos

### Usuarios (Solo ADMIN)
- Creación de usuarios del sistema
- Asignación de roles

## 🤝 Contribución

Este es un MVP funcional enfocado en simplicidad y usabilidad. Las funcionalidades avanzadas como reportes complejos o gestión de pagos no están incluidas intencionalmente.


