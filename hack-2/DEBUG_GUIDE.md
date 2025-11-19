# Guía de Debugging - Dashboard y API

## 🔍 Cómo Debuggear el Problema

### 1. Abre la Consola del Navegador
- Presiona **F12** o **Cmd+Option+I** (Mac)
- Ve a la pestaña **Console**

### 2. Secuencia de Logs Esperados

#### Al Iniciar Sesión:
```
Attempting login with: { email: "test@example.com" }
✅ Token added to request: POST /auth/login
Login successful: { user: {...}, hasToken: true }
```

#### Al Cargar el Dashboard:
```
Loading dashboard data...
✅ Token added to request: GET /tasks
Tasks response: { tasks: [...], totalPages: 1 }
Dashboard stats: { total: 0, completed: 0, pending: 0, overdue: 0 }
```

#### Al Crear un Proyecto:
```
Creating project with data: { name: "...", description: "...", status: "ACTIVE" }
✅ Token added to request: POST /projects
Project created: { id: "...", name: "...", ... }
```

#### Al Crear una Tarea:
```
Creating task with data: { title: "...", dueDate: "2025-11-20T00:00:00.000Z", ... }
✅ Token added to request: POST /tasks
Task created: { id: "...", title: "...", ... }
```

## ❌ Posibles Errores y Soluciones

### Error 1: "⚠️ No token found for request"
**Problema:** No estás autenticado
**Solución:**
1. Cierra sesión y vuelve a iniciar sesión
2. Verifica en DevTools > Application > Local Storage que existan:
   - `token`
   - `user`

### Error 2: API Error con status 401
**Problema:** Token inválido o expirado
**Solución:**
1. Borra el Local Storage:
   ```javascript
   localStorage.clear()
   ```
2. Recarga la página (F5)
3. Inicia sesión de nuevo

### Error 3: API Error con status 422
**Problema:** Datos inválidos enviados al backend
**Solución:**
1. Revisa en la consola el log "Creating task with data:" o "Creating project with data:"
2. Verifica que todos los campos requeridos estén presentes
3. Para tareas, verifica que `dueDate` sea formato ISO: `"2025-11-20T00:00:00.000Z"`

### Error 4: Dashboard muestra todo en 0
**Problema:** No hay tareas creadas o error al cargar
**Solución:**
1. Revisa en la consola si hay errores al cargar: "Error loading dashboard"
2. Verifica el log "Tasks response:" - ¿Tiene tareas?
3. Si está vacío es normal, primero crea proyectos y tareas

### Error 5: CORS o Network Error
**Problema:** No se puede conectar al backend
**Solución:**
1. Verifica que el backend esté en línea: 
   https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1
2. Verifica la URL en `src/utils/constants.ts`

## 🧪 Pasos de Prueba Completos

### Paso 1: Registro
1. Ir a http://localhost:5173/register
2. Completar el formulario
3. **Esperar en consola:**
   ```
   Attempting register with: { email: "...", name: "..." }
   Register successful: { message: "..." }
   ```

### Paso 2: Login
1. Ir a http://localhost:5173/login
2. Iniciar sesión con las credenciales
3. **Esperar en consola:**
   ```
   Attempting login with: { email: "..." }
   ✅ Token added to request: POST /auth/login
   Login successful: { user: {...}, hasToken: true }
   ```
4. Deberías ser redirigido a `/dashboard`

### Paso 3: Verificar Dashboard
1. En el dashboard, **esperar en consola:**
   ```
   Loading dashboard data...
   ✅ Token added to request: GET /tasks
   Tasks response: { tasks: [], totalPages: 1 }
   Dashboard stats: { total: 0, completed: 0, pending: 0, overdue: 0 }
   ```
2. Si ves `tasks: []` es normal, no hay tareas todavía

### Paso 4: Crear Proyecto
1. Ir a "Proyectos"
2. Click en "Nuevo Proyecto"
3. Llenar formulario
4. Click en "Crear"
5. **Esperar en consola:**
   ```
   Creating project with data: { name: "...", description: "...", status: "ACTIVE" }
   ✅ Token added to request: POST /projects
   Project created: { id: "...", ... }
   ```

### Paso 5: Crear Tarea
1. Ir a "Tareas"
2. Click en "Nueva Tarea"
3. Llenar formulario (incluir proyecto creado)
4. Click en "Crear"
5. **Esperar en consola:**
   ```
   Creating task with data: { title: "...", dueDate: "2025-11-20T00:00:00.000Z", ... }
   ✅ Token added to request: POST /tasks
   Task created: { id: "...", ... }
   ```

### Paso 6: Verificar Dashboard Nuevamente
1. Volver a "Dashboard"
2. Ahora deberías ver:
   - Total Tareas: 1
   - Pendientes: 1
   - La tarea en "Tareas Recientes"

## 🔧 Verificación Manual de la API

Puedes probar la API directamente con curl:

### 1. Registrar usuario:
```bash
curl -X POST https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 2. Login:
```bash
curl -X POST https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Guarda el token de la respuesta.

### 3. Obtener tareas (usa el token):
```bash
curl -X GET https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1/tasks \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 📊 Checklist de Verificación

- [ ] Servidor corriendo en http://localhost:5173
- [ ] Consola del navegador abierta (F12)
- [ ] No hay errores rojos en la consola
- [ ] Puedo registrarme (o ya tengo cuenta)
- [ ] Puedo iniciar sesión
- [ ] Veo el log "Login successful" con hasToken: true
- [ ] Token y user aparecen en Local Storage
- [ ] Dashboard carga sin errores
- [ ] Veo el log "Loading dashboard data..."
- [ ] Puedo crear proyectos
- [ ] Veo el log "Project created"
- [ ] Puedo crear tareas
- [ ] Veo el log "Task created"
- [ ] Dashboard muestra las estadísticas correctas

## 🚨 Si Nada Funciona

1. **Limpia todo y empieza de nuevo:**
   ```javascript
   // En la consola del navegador:
   localStorage.clear()
   location.reload()
   ```

2. **Verifica que el backend esté funcionando:**
   - Abre: https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1
   - Deberías ver una respuesta (aunque sea un error 404)

3. **Captura de pantalla de la consola:**
   - Toma screenshot de todos los mensajes en la consola
   - Especialmente los que dicen "API Error:"

4. **Copia el error completo:**
   - Click derecho en el error
   - "Copy" > "Copy message"
   - Envía ese mensaje completo
