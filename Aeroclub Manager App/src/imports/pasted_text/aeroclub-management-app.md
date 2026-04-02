Diseñar una aplicación web tipo SaaS para la gestión de aeroclubes y escuelas de vuelo.

STACK:

* React (JavaScript)
* Tailwind CSS
* Arquitectura basada en componentes reutilizables
* Consumo de API REST (Spring Boot backend)

ESTILO VISUAL:

* Mantener estética moderna, minimalista y limpia similar a los componentes proporcionados (Login, Sidebar y Dashboard)
* Uso de cards, sombras suaves, bordes redondeados (rounded-lg)
* Colores principales: azul, gris, blanco (similar a Tailwind default)
* Sidebar fijo a la izquierda
* Layout responsive

---

# 🧩 COMPONENTES BASE (REUTILIZAR)

1. Login

* Reutilizar completamente el componente existente
* Mantener lógica de autenticación con:
  Endpoint: POST /api/auth/login
  Input: { userId, password }
  Output: JWT + datos usuario

---

2. Sidebar
   Modificar el sidebar existente para que tenga estas secciones:

* Dashboard
* Vuelos / Clases
* Alumnos
* Aviones
* Mantenimientos
* Usuarios (solo admin)

Debe:

* Mostrar nombre y rol del usuario
* Ocultar opciones según rol (admin / instructor)
* Incluir logout:
  Endpoint: POST /api/auth/logout

---

# 🖥️ VISTAS DEL SISTEMA

---

## 1. Dashboard

Mostrar cards con:

* vuelos del día
* horas voladas
* aviones disponibles
* mantenimientos próximos

Endpoint:
GET /api/dashboard/stats

Output:
{
vuelosHoy: number,
horasVoladas: number,
avionesDisponibles: number,
mantenimientosPendientes: number
}

Función:
fetchDashboardStats()

---

## 2. Vuelos / Clases

Vista tipo tabla + botón "Registrar vuelo"

Campos:

* fecha
* alumno
* instructor
* avión
* horas
* tipo de vuelo
* observaciones

Endpoints:

GET /api/flights
POST /api/flights

Input POST:
{
fecha,
studentId,
instructorId,
aircraftId,
horasVuelo,
tipoVuelo,
observaciones
}

Función:
createFlight(data)

IMPORTANTE:
Al crear vuelo:

* sumar horas al avión
* sumar horas al alumno

---

## 3. Alumnos

Tabla + formulario modal

Campos:

* nombre
* apellido
* email
* teléfono
* horas_totales
* estado

Endpoints:

GET /api/students
POST /api/students
PUT /api/students/{id}

Función:
createStudent(data)
updateStudent(id, data)

---

## 4. Aviones

Tabla con estado visual (badge)

Campos:

* matrícula
* modelo
* horas totales
* estado

Estados:

* disponible
* mantenimiento
* fuera de servicio

Endpoints:

GET /api/aircraft
POST /api/aircraft
PUT /api/aircraft/{id}

Función:
createAircraft(data)

---

## 5. Mantenimientos

Lista + formulario

Campos:

* avión
* tipo mantenimiento
* fecha
* horas del avión
* descripción

Endpoints:

GET /api/maintenance
POST /api/maintenance

Función:
createMaintenance(data)

---

## 6. Usuarios (solo admin)

Tabla básica:

* nombre
* email
* rol

Roles:

* ADMIN
* INSTRUCTOR

Endpoints:

GET /api/users
POST /api/users

---

# 🔧 COMPONENTES REUTILIZABLES

Crear componentes reutilizables:

* Card
* Table
* Modal
* FormInput
* Select
* Badge (para estados)
* Loader
* Alert/Error

---

# 🧠 FUNCIONES Y DOCUMENTACIÓN

IMPORTANTE:

Cada componente debe incluir comentarios explicando:

1. Qué hace la función
2. Endpoint que consume
3. Input esperado
4. Output esperado

Ejemplo:

/**

* Obtiene lista de vuelos
* Endpoint: GET /api/flights
* Output: Array<Flight>
  */

---

# 🔐 AUTENTICACIÓN

* Manejar JWT
* Guardar usuario en contexto global
* Redirigir si no está autenticado

---

# 📊 UX IMPORTANTE

* Loading states (spinners)
* Manejo de errores
* Confirmaciones en acciones críticas
* Feedback visual (éxito/error)

---

# 🎯 OBJETIVO FINAL

Construir un MVP funcional que permita:

* gestionar alumnos
* gestionar aviones
* registrar vuelos
* controlar mantenimiento
* visualizar estadísticas básicas

---

# ⚠️ NOTAS

* No agregar funcionalidades avanzadas (como pagos o reportes complejos)
* Priorizar simplicidad y usabilidad
* Mantener código claro y bien documentado

---

Generar todas las vistas con navegación funcional usando React Router.
