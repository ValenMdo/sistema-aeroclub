# 📡 Documentación de Endpoints - Aeroclub Manager

Este documento detalla todos los endpoints que la aplicación frontend espera del backend Spring Boot.

---

## 🔐 Autenticación

### POST /api/auth/login
**Descripción**: Iniciar sesión en el sistema

**Request Body**:
```json
{
  "userId": "admin123",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@aeroclub.com",
    "rol": "ADMIN"
  }
}
```

**Response Error (401)**:
```json
{
  "message": "Credenciales incorrectas"
}
```

---

### POST /api/auth/logout
**Descripción**: Cerrar sesión

**Headers**: 
```
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

## 📊 Dashboard

### GET /api/dashboard/stats
**Descripción**: Obtener estadísticas generales del aeroclub

**Headers**: 
```
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "vuelosHoy": 5,
  "horasVoladas": 234.5,
  "avionesDisponibles": 8,
  "mantenimientosPendientes": 2
}
```

---

## ✈️ Vuelos

### GET /api/flights
**Descripción**: Obtener lista de todos los vuelos

**Headers**: 
```
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
[
  {
    "id": 1,
    "fecha": "2026-03-18",
    "studentId": 5,
    "studentNombre": "María González",
    "instructorId": 2,
    "instructorNombre": "Carlos López",
    "aircraftId": 3,
    "aircraftMatricula": "LV-ABC",
    "horasVuelo": 1.5,
    "tipoVuelo": "Instrucción",
    "observaciones": "Primer vuelo solo exitoso"
  }
]
```

---

### POST /api/flights
**Descripción**: Registrar un nuevo vuelo

**Headers**: 
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "fecha": "2026-03-18",
  "studentId": 5,
  "instructorId": 2,
  "aircraftId": 3,
  "horasVuelo": 1.5,
  "tipoVuelo": "Instrucción",
  "observaciones": "Vuelo de práctica"
}
```

**Response Success (201)**:
```json
{
  "id": 1,
  "fecha": "2026-03-18",
  "studentId": 5,
  "studentNombre": "María González",
  "instructorId": 2,
  "instructorNombre": "Carlos López",
  "aircraftId": 3,
  "aircraftMatricula": "LV-ABC",
  "horasVuelo": 1.5,
  "tipoVuelo": "Instrucción",
  "observaciones": "Vuelo de práctica"
}
```

**Nota**: Este endpoint debe actualizar automáticamente:
- Las horas totales del avión (aircraftId)
- Las horas totales del alumno (studentId)

---

## 👨‍🎓 Alumnos

### GET /api/students
**Descripción**: Obtener lista de todos los alumnos

**Headers**: 
```
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
[
  {
    "id": 1,
    "nombre": "María",
    "apellido": "González",
    "email": "maria@example.com",
    "telefono": "+54 11 1234-5678",
    "horasTotales": 25.5,
    "estado": "Activo"
  }
]
```

---

### POST /api/students
**Descripción**: Crear un nuevo alumno

**Headers**: 
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "nombre": "María",
  "apellido": "González",
  "email": "maria@example.com",
  "telefono": "+54 11 1234-5678",
  "estado": "Activo"
}
```

**Response Success (201)**:
```json
{
  "id": 1,
  "nombre": "María",
  "apellido": "González",
  "email": "maria@example.com",
  "telefono": "+54 11 1234-5678",
  "horasTotales": 0,
  "estado": "Activo"
}
```

---

### PUT /api/students/{id}
**Descripción**: Actualizar un alumno existente

**Headers**: 
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "nombre": "María",
  "apellido": "González",
  "email": "maria.nueva@example.com",
  "telefono": "+54 11 9999-9999",
  "estado": "Activo"
}
```

**Response Success (200)**:
```json
{
  "id": 1,
  "nombre": "María",
  "apellido": "González",
  "email": "maria.nueva@example.com",
  "telefono": "+54 11 9999-9999",
  "horasTotales": 25.5,
  "estado": "Activo"
}
```

---

## 🛩️ Aviones

### GET /api/aircraft
**Descripción**: Obtener lista de todos los aviones

**Headers**: 
```
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
[
  {
    "id": 1,
    "matricula": "LV-ABC",
    "modelo": "Cessna 172",
    "horasTotales": 1250.5,
    "estado": "disponible"
  }
]
```

**Estados posibles**: `disponible`, `mantenimiento`, `fuera de servicio`

---

### POST /api/aircraft
**Descripción**: Crear un nuevo avión

**Headers**: 
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "matricula": "LV-XYZ",
  "modelo": "Piper PA-28",
  "estado": "disponible"
}
```

**Response Success (201)**:
```json
{
  "id": 2,
  "matricula": "LV-XYZ",
  "modelo": "Piper PA-28",
  "horasTotales": 0,
  "estado": "disponible"
}
```

---

### PUT /api/aircraft/{id}
**Descripción**: Actualizar un avión existente

**Headers**: 
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "matricula": "LV-ABC",
  "modelo": "Cessna 172",
  "estado": "mantenimiento"
}
```

**Response Success (200)**:
```json
{
  "id": 1,
  "matricula": "LV-ABC",
  "modelo": "Cessna 172",
  "horasTotales": 1250.5,
  "estado": "mantenimiento"
}
```

---

## 🔧 Mantenimientos

### GET /api/maintenance
**Descripción**: Obtener lista de todos los mantenimientos

**Headers**: 
```
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
[
  {
    "id": 1,
    "aircraftId": 1,
    "aircraftMatricula": "LV-ABC",
    "tipoMantenimiento": "100 horas",
    "fecha": "2026-03-15",
    "horasAvion": 1250.5,
    "descripcion": "Mantenimiento programado de 100 horas"
  }
]
```

---

### POST /api/maintenance
**Descripción**: Registrar un nuevo mantenimiento

**Headers**: 
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "aircraftId": 1,
  "tipoMantenimiento": "100 horas",
  "fecha": "2026-03-15",
  "horasAvion": 1250.5,
  "descripcion": "Mantenimiento programado de 100 horas"
}
```

**Tipos de mantenimiento**: `25 horas`, `50 horas`, `100 horas`, `Anual`, `Correctivo`, `Preventivo`

**Response Success (201)**:
```json
{
  "id": 1,
  "aircraftId": 1,
  "aircraftMatricula": "LV-ABC",
  "tipoMantenimiento": "100 horas",
  "fecha": "2026-03-15",
  "horasAvion": 1250.5,
  "descripcion": "Mantenimiento programado de 100 horas"
}
```

---

## 👥 Usuarios (Solo ADMIN)

### GET /api/users
**Descripción**: Obtener lista de todos los usuarios (Solo ADMIN)

**Headers**: 
```
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@aeroclub.com",
    "rol": "ADMIN"
  },
  {
    "id": 2,
    "nombre": "Carlos López",
    "email": "carlos@aeroclub.com",
    "rol": "INSTRUCTOR"
  }
]
```

**Response Error (403)** - Si no es ADMIN:
```json
{
  "message": "Acceso denegado. Solo administradores."
}
```

---

### POST /api/users
**Descripción**: Crear un nuevo usuario (Solo ADMIN)

**Headers**: 
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "nombre": "Pedro Martínez",
  "email": "pedro@aeroclub.com",
  "password": "password123",
  "rol": "INSTRUCTOR"
}
```

**Roles posibles**: `ADMIN`, `INSTRUCTOR`

**Response Success (201)**:
```json
{
  "id": 3,
  "nombre": "Pedro Martínez",
  "email": "pedro@aeroclub.com",
  "rol": "INSTRUCTOR"
}
```

---

## 🔑 Autenticación con JWT

Todos los endpoints protegidos requieren el header de autorización:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Respuestas de Error Comunes

**401 Unauthorized** - Token inválido o expirado:
```json
{
  "message": "Token inválido o expirado"
}
```

**403 Forbidden** - Sin permisos suficientes:
```json
{
  "message": "No tienes permisos para realizar esta acción"
}
```

**404 Not Found** - Recurso no encontrado:
```json
{
  "message": "Recurso no encontrado"
}
```

**500 Internal Server Error** - Error del servidor:
```json
{
  "message": "Error interno del servidor"
}
```

---

## 📝 Notas Importantes

1. **Actualización automática de horas**: Al crear un vuelo con POST /api/flights, el backend debe:
   - Sumar las horas al campo `horasTotales` del avión
   - Sumar las horas al campo `horasTotales` del alumno

2. **Validación de roles**: El endpoint GET /api/users y POST /api/users deben validar que el usuario autenticado tenga rol ADMIN.

3. **Fechas**: Todas las fechas se envían en formato ISO 8601 (YYYY-MM-DD).

4. **Números decimales**: Las horas de vuelo se manejan con decimales (ejemplo: 1.5 horas = 1 hora 30 minutos).

---

**Base URL por defecto**: `http://localhost:8080`

Esta URL puede configurarse en el archivo `.env` con la variable `VITE_API_BASE_URL`.
