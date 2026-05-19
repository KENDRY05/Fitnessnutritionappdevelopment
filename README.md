# 💪 FitMacros - Aplicación de Fitness y Nutrición

Aplicación web completa para el conteo de macros y seguimiento de objetivos de fitness. Diseñada para ayudarte a alcanzar tus metas de gimnasio (ganar masa muscular, perder grasa, recomposición o mantenimiento).

## 🚀 Características

- ✅ **Calculadora de Macros Científica**: Usa las fórmulas de Mifflin-St Jeor y Harris-Benedict
- ✅ **4 Objetivos de Fitness**: Volumen, Definición, Recomposición, Mantenimiento
- ✅ **Seguimiento Diario**: Registra tus comidas y visualiza tu progreso en tiempo real
- ✅ **Escáner de Alimentos con IA**: 📸 Identifica alimentos usando la cámara y reconocimiento de imágenes
- ✅ **Base de Datos de Alimentos**: 15 alimentos predefinidos + crea los tuyos personalizados
- ✅ **Visualización Intuitiva**: Gráficos circulares y barras de progreso para tus macros
- ✅ **Diseño Responsivo**: Funciona perfectamente en desktop, tablet y móvil
- ✅ **Persistencia Local**: Tus datos se guardan automáticamente en tu navegador

## 🎯 Cómo Funciona

### 1. Registro Inicial (Onboarding)

Al abrir la aplicación por primera vez, completa un proceso de 4 pasos:

**Paso 1 - Información Básica:**
- Email
- Nombre
- Género (Masculino/Femenino)

**Paso 2 - Datos Físicos:**
- Edad
- Peso (kg)
- Altura (cm)

**Paso 3 - Nivel de Actividad:**
- Sedentario (poco o ningún ejercicio)
- Ligero (1-3 días/semana)
- Moderado (3-5 días/semana)
- Activo (6-7 días/semana)
- Muy Activo (atleta o entrenamiento intenso)

**Paso 4 - Objetivo:**
- **Ganar Masa Muscular (Bulk)**: Superávit calórico +400 kcal
- **Perder Grasa (Cut)**: Déficit calórico -400 kcal
- **Recomposición**: Pequeño déficit -100 kcal para ganar músculo y perder grasa
- **Mantenimiento**: Mantener peso actual

### 2. Dashboard Principal

Una vez configurado tu perfil, verás:

- **Contador de Calorías**: Gráfico circular mostrando calorías consumidas vs restantes
- **Macros Detallados**: Barras de progreso para Proteínas, Carbohidratos y Grasas
- **Selector de Fecha**: Navega entre diferentes días para ver tu historial
- **Lista de Alimentos**: Todos los alimentos que has consumido en el día
- **Botón Añadir Alimento**: Acceso rápido para registrar comidas

### 3. Añadir Alimentos

Dos formas de añadir alimentos:

**Buscar en la Base de Datos:**
1. Usa el buscador para encontrar alimentos
2. Haz clic en el alimento que quieras añadir
3. Especifica el número de porciones
4. Selecciona el tipo de comida (Desayuno, Almuerzo, Cena, Snack)
5. Confirma para añadirlo a tu diario

**Crear Alimento Personalizado:**
1. Ve a la pestaña "Crear Personalizado"
2. Completa los campos nutricionales:
   - Nombre del alimento
   - Tamaño de porción y unidad
   - Calorías
   - Proteínas, Carbohidratos, Grasas (en gramos)
3. Guarda y estará disponible para uso futuro

**Escanear Alimento con Cámara:** 📸
1. Haz clic en "Escanear Alimento con Cámara"
2. Permite el acceso a la cámara cuando el navegador lo solicite
3. Apunta la cámara a tu comida
4. Captura la foto
5. La IA analizará la imagen y detectará el alimento automáticamente
6. Selecciona el alimento correcto de los resultados
7. Especifica las porciones y añade al diario

**Nota sobre el Escáner:**
- Por defecto funciona en **modo demo** (no requiere API keys)
- Para reconocimiento real, consulta `GUIA_ESCANER_ALIMENTOS.md`
- Soporta integración con Clarifai, Google Cloud Vision y Nutritionix
- Requiere HTTPS en producción y permisos de cámara

## 📊 Cálculo de Macros

La aplicación utiliza fórmulas científicas validadas:

### Tasa Metabólica Basal (BMR) - Mifflin-St Jeor:
- **Hombres**: BMR = (10 × peso) + (6.25 × altura) - (5 × edad) + 5
- **Mujeres**: BMR = (10 × peso) + (6.25 × altura) - (5 × edad) - 161

### Gasto Energético Total Diario (TDEE):
TDEE = BMR × Factor de Actividad

### Distribución de Macros por Objetivo:

**Volumen:**
- Proteína: 2.0g/kg de peso corporal
- Grasas: 0.8g/kg
- Carbohidratos: Resto de calorías

**Definición:**
- Proteína: 2.2g/kg (alta para preservar músculo)
- Grasas: 0.6g/kg
- Carbohidratos: Resto de calorías

**Recomposición:**
- Proteína: 2.0g/kg
- Grasas: 0.7g/kg
- Carbohidratos: Resto de calorías

**Mantenimiento:**
- Proteína: 1.8g/kg
- Grasas: 0.8g/kg
- Carbohidratos: Resto de calorías

## 🗂️ Estructura del Proyecto

```
src/
├── app/
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript
│   ├── utils/
│   │   └── macroCalculator.ts    # Lógica de cálculo de macros
│   ├── services/
│   │   └── storageService.ts     # Servicio de almacenamiento local
│   ├── context/
│   │   └── AuthContext.tsx       # Context de autenticación
│   ├── components/
│   │   ├── Onboarding.tsx        # Pantalla de registro
│   │   ├── Dashboard.tsx         # Dashboard principal
│   │   ├── AddFood.tsx           # Añadir alimentos
│   │   └── ui/                   # Componentes UI
│   └── App.tsx                   # Componente raíz
```

## 🔧 Tecnologías Utilizadas

- **React 18** - Framework frontend
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes accesibles
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos
- **LocalStorage** - Persistencia de datos

## 💾 Almacenamiento de Datos

Todos los datos se guardan en el **LocalStorage** de tu navegador:
- Perfil de usuario
- Alimentos personalizados
- Registros diarios de comidas

**Nota**: Los datos permanecen en tu navegador y no se sincronizan entre dispositivos. Para migrar a un backend real, consulta el archivo `ARQUITECTURA_BACKEND.md`.

## 📱 Uso en Móvil

La aplicación es completamente responsiva y funciona perfectamente en dispositivos móviles. Para instalarla como una app:

1. Abre la aplicación en tu navegador móvil
2. En Chrome/Safari, selecciona "Agregar a pantalla de inicio"
3. Úsala como una app nativa

## 🔐 Seguridad

**Versión actual (LocalStorage):**
- Los datos se almacenan localmente en tu navegador
- No hay transmisión de datos a servidores externos
- El "token JWT" es solo para simulación

**Para producción:**
- Implementa backend con Node.js + Express
- Usa bcrypt para hashear contraseñas
- Implementa JWT real con secret keys seguras
- Añade validación de entrada en servidor

## 🚀 Mejoras Futuras

1. **Backend Real**: Migrar a Node.js + Express + MySQL (ver `ARQUITECTURA_BACKEND.md`)
2. **Reconocimiento Real con IA**: Integrar APIs como Clarifai o Nutritionix (ver `GUIA_ESCANER_ALIMENTOS.md`)
3. **Más Alimentos**: Integrar API de alimentos (USDA, Open Food Facts)
4. **Gráficos de Progreso**: Historial de peso y macros semanales/mensuales
5. **Recetas**: Crear y guardar recetas con cálculo automático de macros
6. **Planes de Comida**: Generar planes semanales según objetivos
7. **Exportar Datos**: PDF o CSV de reportes
8. **Notificaciones**: Recordatorios para registrar comidas
9. **Modo Offline**: PWA con Service Workers
10. **App Móvil**: Migrar a React Native usando esta base

## 📖 Documentación Adicional

- `ARQUITECTURA_BACKEND.md` - Arquitectura completa y guía de migración a backend real
- `GUIA_ESCANER_ALIMENTOS.md` - Guía completa de integración de escáner con APIs de IA (Clarifai, Google Vision, Nutritionix)

## 🎓 Fundamentos Científicos

Las fórmulas y distribuciones de macros están basadas en investigaciones científicas validadas:
- [Mifflin-St Jeor Equation](https://en.wikipedia.org/wiki/Basal_metabolic_rate)
- [TDEE Calculator](https://tdeecalculator.net/)
- [Protein Intake Guidelines](https://examine.com/guides/protein-intake/)

---

**¡Comienza a trackear tus macros y alcanza tus objetivos de fitness! 💪**
