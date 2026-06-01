# 🚀 Guía de Inicio Rápido - FitMacros

## ✅ Pasos para ver el Escáner de Alimentos:

### 1️⃣ Login o Registro

**Si es tu primera vez:**
1. Verás la pantalla de **Login**
2. Haz clic en **"Crear Cuenta Nueva"**
3. Completa el proceso de registro de 4 pasos (ver abajo)

**Si ya tienes cuenta:**
1. Ingresa tu email y contraseña
2. Haz clic en **"Iniciar Sesión"**
3. Irás directo al Dashboard

### Proceso de Registro (4 pasos):

**Paso 1 - Información Básica:**
- Email: Escribe cualquier email (ej: `test@test.com`)
- Nombre: Tu nombre
- Contraseña: Mínimo 6 caracteres (ej: `123456`)
- Género: Masculino o Femenino

**Paso 2 - Datos Físicos:**
- Edad: Ejemplo `25`
- Peso: Ejemplo `70` kg
- Altura: Ejemplo `175` cm

**Paso 3 - Nivel de Actividad:**
- Selecciona cualquier opción (ej: "Moderado")

**Paso 4 - Objetivo:**
- Selecciona tu objetivo (ej: "Ganar Masa Muscular")

Haz clic en **"Comenzar"**

---

### 2️⃣ Dashboard Principal

Después del registro, verás el **Dashboard** con:
- Gráfico circular de calorías
- Barras de progreso de macros
- Botón **"Añadir Alimento"** (arriba a la derecha)

---

### 3️⃣ Acceder al Escáner 📸

1. Haz clic en el botón **"Añadir Alimento"**
2. Verás la pantalla "Añadir Alimento" con dos pestañas
3. En la pestaña **"Buscar Alimento"** (la primera)
4. Justo debajo del campo de búsqueda, verás un botón **morado/índigo** que dice:

   ```
   📷 Escanear Alimento con Cámara
   ```

5. Haz clic en ese botón
6. Se abrirá el modal del escáner
7. Haz clic en **"Activar Cámara"**
8. Permite los permisos cuando el navegador lo solicite
9. Captura una foto
10. El sistema analizará la imagen (en modo demo toma 2 segundos)
11. Verás el alimento detectado con sus macros
12. Haz clic para seleccionarlo y añadirlo a tu diario

---

## 🔍 Si NO ves el botón del escáner:

### Verifica que estés en la pantalla correcta:

```
Onboarding → Dashboard → Añadir Alimento → [AQUÍ ESTÁ EL BOTÓN]
```

### El botón se ve así:

- Color de fondo: Índigo claro (`bg-indigo-50`)
- Borde: Índigo (`border-indigo-200`)
- Texto: Índigo oscuro
- Icono: 📷 Cámara
- Texto: "Escanear Alimento con Cámara"
- Ocupa todo el ancho

---

## 🐛 Solución de Problemas

### Problema: "No veo ninguna pantalla"

**Solución:** Asegúrate de que la aplicación esté corriendo. En Figma Make, la vista previa debería mostrarse automáticamente.

### Problema: "Estoy atascado en el Onboarding"

**Solución:** Completa todos los campos de cada paso. Los botones solo se habilitan cuando todos los campos están llenos.

### Problema: "El botón del escáner no aparece"

**Solución:** 
1. Verifica que estés en "Añadir Alimento" (no en Dashboard)
2. Asegúrate de estar en la pestaña "Buscar Alimento" (no en "Crear Personalizado")
3. El botón está justo debajo del campo de búsqueda

### Problema: "El navegador no permite el acceso a la cámara"

**Solución:**
- En Chrome/Edge: Verifica los permisos en la barra de direcciones
- En Firefox: Haz clic en el icono de cámara tachada y permite el acceso
- En Safari: Ve a Preferencias → Sitios Web → Cámara
- **Importante:** En producción necesitas HTTPS (localhost está bien para desarrollo)

### Problema: "El escáner dice que no detectó ningún alimento"

**Solución:** 
- Estás en **modo DEMO** por defecto
- El modo demo retorna alimentos aleatorios
- Si sale error, espera 2 segundos y debería mostrar un alimento de la base de datos
- Para usar reconocimiento REAL, consulta `GUIA_ESCANER_ALIMENTOS.md`

---

## 📱 Navegación de la App

```
┌─────────────────────────────────────────┐
│          ONBOARDING (primera vez)       │
│  4 pasos para configurar tu perfil      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│            DASHBOARD                    │
│  - Gráfico de calorías                  │
│  - Barras de macros                     │
│  - Lista de alimentos del día           │
│  - Botón: [+ Añadir Alimento]           │
└──────────────────┬──────────────────────┘
                   │ (clic en botón)
                   ▼
┌─────────────────────────────────────────┐
│         AÑADIR ALIMENTO                 │
│  ┌─────────────────────────────────┐    │
│  │ Tab: Buscar Alimento            │    │
│  ├─────────────────────────────────┤    │
│  │ 🔍 [Campo de búsqueda]          │    │
│  │                                 │    │
│  │ 📷 [Escanear Alimento] ← AQUÍ  │    │
│  │                                 │    │
│  │ [Lista de alimentos]            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Tab: Crear Personalizado              │
└─────────────────────────────────────────┘
```

---

## ✨ Flujo del Escáner

```
[Clic: Escanear Alimento]
         ↓
[Modal: Activar Cámara]
         ↓
[Permite permisos]
         ↓
[Vista de cámara en vivo]
         ↓
[Clic: Botón de captura 📷]
         ↓
[Analizando... ⏳ 2 seg]
         ↓
[Resultado: "Pechuga de Pollo"]
[165 kcal | P: 31g | C: 0g | G: 3.6g]
         ↓
[Clic: Seleccionar]
         ↓
[Dialog: Porciones + Tipo de comida]
         ↓
[Añadir al Diario] ✅
         ↓
[Regresa al Dashboard]
```

---

## 💡 Consejos

1. **Primera Vez:** Usa datos de ejemplo en el Onboarding, puedes cambiarlos después
2. **Prueba el Escáner:** En modo demo, siempre retorna un alimento aleatorio
3. **Añade Varios Alimentos:** Prueba añadir desayuno, almuerzo, cena para ver el progreso
4. **Selector de Fecha:** Puedes ver registros de otros días
5. **Modo Desarrollo:** El escáner está en modo MOCK (sin API real)

---

## 🎯 Próximos Pasos

Después de probar la app:

1. **Para APIs Reales:** Lee `GUIA_ESCANER_ALIMENTOS.md`
2. **Para Backend:** Lee `ARQUITECTURA_BACKEND.md`
3. **Para Personalizar:** Revisa el código en `src/app/`

---

**¿Sigue sin funcionar?** Verifica la consola del navegador (F12) para ver errores.
