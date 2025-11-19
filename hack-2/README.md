# TechFlow - Task Management Frontend

Aplicación web de gestión de tareas y proyectos construida con React, TypeScript, Tailwind CSS y Radix UI.

## 🚀 Tecnologías Utilizadas

- **React 18+** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Radix UI** - Componentes UI accesibles y ligeros
- **React Router** - Navegación
- **Axios** - Cliente HTTP

## 📋 Funcionalidades Implementadas

### ✅ Autenticación
- Login y Registro de usuarios
- Gestión de JWT en localStorage
- Rutas protegidas
- Cierre de sesión

### ✅ Dashboard
- Estadísticas de tareas (total, completadas, pendientes, vencidas)
- Vista de tareas recientes
- Acciones rápidas

### ✅ Gestión de Proyectos
- Listar proyectos con paginación
- Crear nuevo proyecto
- Editar proyecto
- Eliminar proyecto
- Búsqueda por nombre
- Estados: Activo, Completado, En Espera

### ✅ Gestión de Tareas
- Listar todas las tareas
- Crear nueva tarea
- Editar tarea
- Eliminar tarea
- Cambiar estado de tarea (Por Hacer → En Progreso → Completado)
- Filtros avanzados:
  - Por estado (TODO, IN_PROGRESS, COMPLETED)
  - Por prioridad (LOW, MEDIUM, HIGH, URGENT)
  - Por proyecto
- Asignar tareas a miembros del equipo
- Fecha límite

### ✅ Equipo
- Ver miembros del equipo
- Ver tareas asignadas a cada miembro

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js 18+ instalado
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd techflow-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Preview de la build de producción
- `npm run lint` - Ejecuta el linter

## 🔑 Credenciales de Prueba

Para probar la aplicación, primero debes registrarte en `/register` con:
- Nombre completo
- Email válido
- Contraseña (mínimo 6 caracteres)

Luego inicia sesión en `/login` con las credenciales que creaste.

## 🌐 API Backend

La aplicación consume la API REST de TechFlow:

**URL Base:** `https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1`

Todos los endpoints autenticados requieren el header:
```
Authorization: Bearer <jwt_token>
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── common/          # Componentes reutilizables (Button, Input, Modal, Card)
│   └── auth/            # Componentes de autenticación (ProtectedRoute)
├── pages/               # Páginas de la aplicación
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProjectsPage.tsx
│   ├── TasksPage.tsx
│   └── TeamPage.tsx
├── services/            # Servicios de API
│   ├── api.ts
│   ├── authService.ts
│   ├── projectService.ts
│   ├── taskService.ts
│   └── teamService.ts
├── context/             # React Context
│   └── AuthContext.tsx
├── types/               # Definiciones de TypeScript
│   └── index.ts
├── utils/               # Utilidades y constantes
│   └── constants.ts
├── App.tsx              # Componente principal con routing
└── main.tsx             # Entry point
```

## 🎨 Características de UI/UX

- **Design System**: Colores primarios en azul, estados visuales claros
- **Responsive**: Funciona en mobile, tablet y desktop
- **Componentes Radix UI**: Accesibles, ligeros y personalizables
- **Feedback Visual**: Loading states, confirmaciones, mensajes de error
- **Navegación Intuitiva**: Header con menú persistente
- **Modales**: Para creación y edición de recursos
- **Badges**: Para estados y prioridades con códigos de color

## 🚀 Deploy

### Opción 1: Vercel

1. Push tu código a GitHub
2. Conecta tu repositorio en [Vercel](https://vercel.com)
3. Deploy automático

### Opción 2: Netlify

1. Push tu código a GitHub
2. Conecta tu repositorio en [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

## 📝 Notas Adicionales

- La aplicación usa Radix UI en lugar de librerías completas como Material-UI para mantener el bundle pequeño
- Los tokens JWT se almacenan en localStorage
- Los interceptores de Axios manejan automáticamente la autenticación y redirección en caso de token expirado
- Todos los formularios incluyen validación básica

## 👥 Equipo de Desarrollo

Desarrollado como parte del Hackathon #2 de Desarrollo Basado en Plataformas (CS2031)

---

**Con ❤️ por el equipo de TechFlow**
