# Guía de Pruebas - TechFlow Frontend

## Estado Actual
✅ Servidor corriendo en http://localhost:5173
✅ Tailwind CSS configurado correctamente
✅ Todos los componentes creados
✅ Validación y manejo de errores implementado

## Pasos para Probar

### 1. Registro de Usuario
1. Ir a http://localhost:5173
2. Click en "Registrarse"
3. Llenar el formulario:
   - Nombre: Tu Nombre
   - Email: test@example.com
   - Password: password123
4. Click en "Registrarse"
5. **Esperado:** Deberías ser redirigido a /login

### 2. Login
1. En la página de login
2. Usar las credenciales del paso anterior
3. Click en "Iniciar Sesión"
4. **Esperado:** Deberías ser redirigido al Dashboard

### 3. Dashboard
- Verás estadísticas de tareas (al inicio todos en 0)
- Navegación en el header

### 4. Crear Proyecto
1. Click en "Proyectos" en el menú
2. Click en "Nuevo Proyecto"
3. Llenar el formulario:
   - Nombre: Mi Primer Proyecto
   - Descripción: Este es un proyecto de prueba
   - Estado: Activo
4. Click en "Crear"
5. **Esperado:** 
   - Mensaje de éxito
   - Modal se cierra
   - Proyecto aparece en la lista

### 5. Crear Tarea
1. Click en "Tareas" en el menú
2. Click en "Nueva Tarea"
3. Llenar el formulario:
   - Título: Mi Primera Tarea
   - Descripción: Descripción de la tarea
   - Proyecto: Seleccionar el proyecto creado
   - Prioridad: Alta
   - Fecha Límite: Cualquier fecha futura
   - Asignar a: (Opcional)
4. Click en "Crear"
5. **Esperado:** 
   - Mensaje de éxito
   - Modal se cierra
   - Tarea aparece en la lista

## Errores Comunes y Soluciones

### Error: "El nombre del proyecto es requerido"
- **Causa:** Campos vacíos
- **Solución:** Llenar todos los campos requeridos

### Error: "Debes seleccionar un proyecto"
- **Causa:** No hay proyectos creados o no se seleccionó uno
- **Solución:** Primero crear un proyecto, luego crear la tarea

### Error: "Token faltante o inválido"
- **Causa:** Sesión expirada
- **Solución:** Cerrar sesión y volver a iniciar sesión

### Error de Red
- **Causa:** Backend no responde
- **Solución:** Verificar que la URL del backend esté correcta en constants.ts

## Verificar en la Consola del Navegador

1. Abrir DevTools (F12)
2. Ir a la pestaña Console
3. Buscar mensajes como:
   - "API Error:" (si hay errores)
   - Requests a la API
4. Ir a la pestaña Network
5. Filtrar por XHR
6. Ver las peticiones HTTP y sus respuestas

## Debug de Errores

Si algo no funciona:

1. **Revisar la consola del navegador** - Los errores aparecerán allí con detalles:
   - URL del endpoint
   - Método HTTP
   - Status code
   - Mensaje de error del backend

2. **Revisar Network tab** - Ver la petición exacta que se envió

3. **Verificar el token** - En DevTools > Application > Local Storage
   - Debe haber una entrada "token"
   - Debe haber una entrada "user"

## Funcionalidades Implementadas

✅ Autenticación (Login/Register)
✅ Dashboard con estadísticas
✅ CRUD de Proyectos
✅ CRUD de Tareas
✅ Filtros de tareas (estado, prioridad, proyecto)
✅ Asignación de tareas a miembros
✅ Paginación de proyectos
✅ Búsqueda de proyectos
✅ Vista de equipo
✅ Manejo de errores con mensajes
✅ Validación de formularios
✅ Estados de carga (Loading...)
✅ Diseño responsive

## Nota Importante

Los errores ahora se muestran en:
1. **Alertas del navegador** - Para crear/actualizar exitoso
2. **Mensajes rojos en modales** - Para errores de validación o API
3. **Consola del navegador** - Para debugging detallado
