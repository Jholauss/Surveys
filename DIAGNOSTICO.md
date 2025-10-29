# 🔍 Diagnóstico: No se muestran docentes en la encuesta

## Problema
El estudiante puede ingresar con su código pero no se muestran docentes para seleccionar.

## Causa más probable
**La encuesta fue creada sin asociar docentes.**

---

## ✅ Pasos para Diagnosticar

### 1. Verifica en los logs del servidor

Reinicia el servidor y vuelve a ingresar el código de estudiante. Busca en la consola:

```
[Session API POST] Sesión creada exitosamente
[Session API POST] Docentes en la encuesta: 0    👈 SI ESTO ES 0, NO HAY DOCENTES
[Session API POST] Docentes: []
```

**Si "Docentes en la encuesta" es 0**, entonces la encuesta no tiene docentes asociados.

### 2. Verifica en los logs del navegador

Abre DevTools (F12) > Console. Busca:

```
[Frontend] Sesión creada: {...}
[Frontend] Docentes recibidos: []    👈 SI ESTO ESTÁ VACÍO, NO HAY DOCENTES
[Frontend] Cantidad de docentes: 0
```

**Si "Cantidad de docentes" es 0**, confirma que no hay docentes.

---

## 🔧 Solución

### Opción 1: Verificar en Prisma Studio

```bash
npm run db:studio
```

1. Ve a la tabla `Survey` y encuentra tu encuesta
2. Copia el `id` de la encuesta (ejemplo: `cmhceatrx0000bpksfrgzqla9`)
3. Ve a la tabla `SurveyTeacher`
4. Busca registros donde `surveyId` sea el ID de tu encuesta

**Si no encuentras ningún registro**, significa que la encuesta no tiene docentes asociados.

---

### Opción 2: Crear una nueva encuesta correctamente

1. **Ve a Gestión de Docentes** (http://localhost:3000/admin/teachers)
2. **Crea al menos 1 docente** usando el botón "Nuevo Docente"
   - Nombre: Dr. Juan Pérez
   - Materia: Matemáticas
   - (Opcional) Sube una foto
3. **Ve a Crear Nueva Encuesta** (http://localhost:3000/admin/surveys/create)
4. **IMPORTANTE:** En la sección "Docentes a Evaluar":
   - **Digita el número de docentes** (ejemplo: 1, 2, 3, etc.)
   - **Selecciona visualmente los docentes** haciendo clic en sus cards
   - Verás el contador: "1 de 1 docentes seleccionados"
5. Crea la encuesta con Estado: **Activa**

---

### Opción 3: Asociar docentes manualmente en Prisma Studio

Si ya creaste la encuesta y no quieres volver a crearla:

```bash
npm run db:studio
```

1. Ve a la tabla `SurveyTeacher`
2. Clic en "Add record"
3. Llena los campos:
   - `surveyId`: ID de tu encuesta
   - `teacherId`: ID del docente (busca en la tabla `Teacher`)
   - `order`: 0 (para el primer docente, 1 para el segundo, etc.)
4. Guarda el registro
5. Repite para cada docente que quieras asociar

---

## 📝 Checklist para crear una encuesta válida

- [ ] Hay al menos 1 docente creado en "Gestión de Docentes"
- [ ] Al crear la encuesta, el campo "¿Cuántos docentes desea evaluar?" tiene un número mayor a 0
- [ ] Has seleccionado visualmente los docentes (las cards deben estar en azul con checkmark)
- [ ] El contador muestra "X de X docentes seleccionados" (ambos números iguales)
- [ ] El estado de la encuesta es "Activa" (no "Borrador")
- [ ] Al hacer clic en "Crear Encuesta", no aparecen errores

---

## 🧪 Prueba rápida

Para verificar que todo funciona:

1. **Crea un docente de prueba:**
   - Nombre: "Dr. Test"
   - Materia: "Matemáticas"

2. **Crea una encuesta de prueba:**
   - Título: "Encuesta de Prueba"
   - Tipo: "Evaluación de Docentes"
   - Estado: "Activa"
   - **¿Cuántos docentes?** 1
   - **Selecciona "Dr. Test"** (la card debe ponerse azul)
   - Agrega al menos 1 pregunta
   - Crea la encuesta

3. **Copia el link público** que aparece al final

4. **Abre el link en otra pestaña**

5. **Ingresa un código de estudiante válido** (debe existir en la BD)
   - Si no tienes estudiantes, créalos o usa el seed:
     ```bash
     npm run db:seed
     ```

6. **Deberías ver el docente "Dr. Test"** en la pantalla de selección

---

## 🐛 Si aún no funciona

Verifica en los logs:

### Logs del servidor que deberías ver:

```
[Session API POST] Sesión creada exitosamente
[Session API POST] Docentes en la encuesta: 1
[Session API POST] Docentes: [ 'Dr. Test' ]
```

### Logs del navegador (F12 > Console):

```
[Frontend] Sesión creada: {id: '...', token: '...', ...}
[Frontend] Docentes recibidos: [{id: '...', name: 'Dr. Test', ...}]
[Frontend] Cantidad de docentes: 1
```

---

## 📞 Información para reportar errores

Si después de seguir estos pasos aún no funciona, proporciona:

1. **Logs del servidor** (la consola donde corre `npm run dev`)
2. **Logs del navegador** (F12 > Console)
3. **Screenshot de Prisma Studio** mostrando:
   - La tabla `Survey` con tu encuesta
   - La tabla `SurveyTeacher` filtrada por tu `surveyId`
   - La tabla `Teacher` mostrando los docentes disponibles
