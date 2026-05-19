# 📸 Guía de Escaneo de Alimentos con IA

## Descripción General

FitMacros ahora incluye una funcionalidad de **escaneo de alimentos** que utiliza la cámara del dispositivo y reconocimiento de imágenes con IA para identificar automáticamente los alimentos y obtener su información nutricional.

## 🎯 Cómo Funciona

1. **Activar Cámara**: Usuario hace clic en "Escanear Alimento con Cámara"
2. **Permisos**: El navegador solicita permiso para acceder a la cámara
3. **Captura**: Usuario apunta la cámara al alimento y toma una foto
4. **Análisis IA**: La imagen se envía a un servicio de reconocimiento
5. **Resultados**: Se muestran los alimentos detectados con información nutricional
6. **Selección**: Usuario selecciona el alimento correcto y lo añade al diario

## 🔧 Implementación Actual

### Modo Mock (Desarrollo)

Por defecto, la aplicación usa un **modo de demostración** que:
- Simula el análisis de la imagen con un delay de 2 segundos
- Retorna un alimento aleatorio de la base de datos predefinida
- **No requiere API keys** ni conexión a internet
- Perfecto para desarrollo y pruebas

### Cambiar a API Real

Para usar reconocimiento real, edita el archivo:
```typescript
// src/app/services/foodRecognitionService.ts

// Cambia esta línea:
const ACTIVE_SERVICE: RecognitionService = 'mock';

// Por una de estas:
const ACTIVE_SERVICE: RecognitionService = 'clarifai';  // Clarifai
const ACTIVE_SERVICE: RecognitionService = 'google';    // Google Cloud Vision
const ACTIVE_SERVICE: RecognitionService = 'nutritionix'; // Nutritionix
```

---

## 🚀 Integración con APIs Reales

### Opción 1: Clarifai Food Recognition API

**Ventajas:**
- ✅ Especializada en reconocimiento de alimentos
- ✅ Modelo pre-entrenado específico para comida
- ✅ Alta precisión
- ✅ Plan gratuito disponible (5,000 operaciones/mes)

**Configuración:**

1. **Crear cuenta en Clarifai:**
   - Visita https://clarifai.com/
   - Crea una cuenta gratuita
   - Ve a Settings > Security > Create Personal Access Token

2. **Añadir API Key:**
   ```typescript
   // src/app/services/foodRecognitionService.ts
   const CLARIFAI_API_KEY = 'tu_api_key_aquí';
   const ACTIVE_SERVICE: RecognitionService = 'clarifai';
   ```

3. **Código ya implementado:**
   ```typescript
   // La función recognizeFoodClarifai() ya está lista
   // Automáticamente:
   // - Envía la imagen a Clarifai
   // - Obtiene conceptos detectados (alimentos)
   // - Mapea a información nutricional
   // - Retorna los alimentos encontrados
   ```

**Documentación oficial:**
https://docs.clarifai.com/api-guide/predict/images

**Ejemplo de Respuesta:**
```json
{
  "outputs": [{
    "data": {
      "concepts": [
        { "name": "chicken", "value": 0.98 },
        { "name": "rice", "value": 0.95 },
        { "name": "broccoli", "value": 0.89 }
      ]
    }
  }]
}
```

---

### Opción 2: Google Cloud Vision API

**Ventajas:**
- ✅ Muy precisa
- ✅ Detecta múltiples objetos en una imagen
- ✅ Incluye web detection (búsquedas relacionadas)
- ✅ $300 de crédito gratis al registrarse

**Configuración:**

1. **Crear proyecto en Google Cloud:**
   - Visita https://console.cloud.google.com/
   - Crea un nuevo proyecto
   - Habilita "Cloud Vision API"
   - Ve a Credentials > Create API Key

2. **Añadir API Key:**
   ```typescript
   const GOOGLE_CLOUD_API_KEY = 'tu_api_key_aquí';
   const ACTIVE_SERVICE: RecognitionService = 'google';
   ```

3. **La función recognizeFoodGoogle() incluye:**
   - Label Detection (etiquetas de objetos)
   - Web Detection (búsquedas relacionadas)
   - Mapeo automático a base de datos nutricional

**Documentación oficial:**
https://cloud.google.com/vision/docs

**Precios:**
- Primeras 1,000 unidades/mes: Gratis
- Después: $1.50 por 1,000 imágenes

---

### Opción 3: Nutritionix API (Recomendada para Nutrición)

**Ventajas:**
- ✅ **Base de datos nutricional masiva** (800,000+ alimentos)
- ✅ Retorna información nutricional **completa y precisa**
- ✅ No solo identifica, también da calorías, macros, vitaminas, etc.
- ✅ Plan gratuito: 200 requests/día

**Configuración:**

1. **Crear cuenta en Nutritionix:**
   - Visita https://www.nutritionix.com/business/api
   - Crea una cuenta de desarrollador
   - Obtén tu App ID y API Key

2. **Añadir credenciales:**
   ```typescript
   const NUTRITIONIX_APP_ID = 'tu_app_id';
   const NUTRITIONIX_API_KEY = 'tu_api_key';
   const ACTIVE_SERVICE: RecognitionService = 'nutritionix';
   ```

3. **Respuesta incluye:**
   - Nombre del alimento
   - Calorías exactas
   - Proteínas, carbohidratos, grasas
   - Tamaño de porción
   - Vitaminas y minerales
   - ¡Y mucho más!

**Documentación oficial:**
https://docs.nutritionix.com/

**Ejemplo de Respuesta:**
```json
{
  "foods": [{
    "food_name": "grilled chicken breast",
    "serving_weight_grams": 100,
    "nf_calories": 165,
    "nf_total_fat": 3.6,
    "nf_saturated_fat": 1,
    "nf_cholesterol": 85,
    "nf_sodium": 74,
    "nf_total_carbohydrate": 0,
    "nf_dietary_fiber": 0,
    "nf_sugars": 0,
    "nf_protein": 31,
    "nf_potassium": 256
  }]
}
```

---

## 🔐 Seguridad: Manejo de API Keys

### ⚠️ IMPORTANTE: Nunca expongas tus API keys en el frontend

Las API keys en el código del frontend pueden ser vistas por cualquiera. Para producción:

### Solución 1: Backend Proxy (Recomendada)

Crea un endpoint en tu backend que haga la llamada a la API:

```javascript
// Backend (Node.js/Express)
app.post('/api/recognize-food', async (req, res) => {
  const { imageBase64 } = req.body;
  
  // Llamar a la API desde el servidor (las keys están seguras aquí)
  const response = await fetch('https://api.clarifai.com/v2/models/food-item-recognition/outputs', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.CLARIFAI_API_KEY}`, // Variable de entorno
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: [{ data: { image: { base64: imageBase64 } } }]
    })
  });
  
  const data = await response.json();
  res.json(data);
});
```

```typescript
// Frontend
async function recognizeFood(imageBase64: string): Promise<Food[]> {
  // Llamar a tu propio backend
  const response = await fetch('/api/recognize-food', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 })
  });
  
  return response.json();
}
```

### Solución 2: Variables de Entorno (Solo para desarrollo local)

```bash
# .env.local
VITE_CLARIFAI_API_KEY=tu_api_key
```

```typescript
// En el código
const CLARIFAI_API_KEY = import.meta.env.VITE_CLARIFAI_API_KEY;
```

---

## 📊 Base de Datos de Alimentos

El archivo `foodRecognitionService.ts` incluye una base de datos de mapeo con 20+ alimentos comunes:

```typescript
const FOOD_DATABASE = {
  'chicken': { name: 'Pechuga de Pollo', calories: 165, protein: 31, ... },
  'rice': { name: 'Arroz Blanco', calories: 130, protein: 2.7, ... },
  // ... más alimentos
}
```

### Expandir la Base de Datos

Para añadir más alimentos:

```typescript
const FOOD_DATABASE: Record<string, Omit<Food, 'id'>> = {
  // Añade nuevos alimentos aquí
  'yogurt': {
    name: 'Yogurt Griego',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fats: 0.4,
    servingSize: 100,
    servingUnit: 'g'
  },
  // ... más
};
```

---

## 🎨 Personalización del Escáner

### Cambiar Cámara (Frontal/Trasera)

```typescript
// En FoodScanner.tsx
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment',  // 'user' para cámara frontal
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
});
```

### Ajustar Calidad de Imagen

```typescript
// En FoodScanner.tsx - función capturePhoto()
const imageData = canvas.toDataURL('image/jpeg', 0.8); // 0.8 = 80% calidad
// Valores más bajos = menor tamaño de archivo pero menor calidad
```

### Umbral de Confianza

```typescript
// En foodRecognitionService.ts
.filter((concept: any) => concept.value > 0.7) // Solo >70% confianza
// Aumenta para mayor precisión, disminuye para más resultados
```

---

## 📱 Compatibilidad

### Navegadores Soportados:

✅ Chrome (Android/Desktop)  
✅ Safari (iOS/macOS) - Requiere HTTPS  
✅ Firefox (Android/Desktop)  
✅ Edge (Desktop)  
✅ Samsung Internet  
❌ IE11 (no soporta getUserMedia)

### Requisitos:

- **HTTPS obligatorio** en producción (getUserMedia solo funciona en conexiones seguras)
- Permiso de cámara del navegador
- Conexión a internet (para APIs de reconocimiento)

---

## 🐛 Solución de Problemas

### "No se pudo acceder a la cámara"

**Causas:**
1. Permiso denegado por el usuario
2. Navegador no soporta getUserMedia
3. Conexión HTTP en lugar de HTTPS
4. Otra app está usando la cámara

**Solución:**
```typescript
// Verificar soporte antes de intentar
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  alert('Tu navegador no soporta acceso a cámara');
  return;
}
```

### "Error al analizar la imagen"

**Causas:**
1. API key inválida o expirada
2. Límite de uso excedido
3. Imagen demasiado grande
4. Sin conexión a internet

**Solución:**
```typescript
// Comprimir imagen antes de enviar
const imageData = canvas.toDataURL('image/jpeg', 0.5); // 50% calidad
```

### No detecta ningún alimento

**Causas:**
1. Imagen muy borrosa o mal iluminada
2. Alimento no está en la base de datos de la API
3. Umbral de confianza muy alto

**Solución:**
- Mejora la iluminación
- Toma la foto más cerca
- Reduce el umbral de confianza a 0.5

---

## 💡 Mejoras Futuras

1. **Detección Múltiple**: Identificar varios alimentos en una sola imagen
2. **Estimación de Porciones**: Usar referencia de tamaño para calcular cantidad
3. **Historial de Escaneos**: Guardar fotos escaneadas para referencia
4. **OCR de Etiquetas**: Leer información nutricional de empaques
5. **Modo Offline**: Modelo de ML local usando TensorFlow.js
6. **Reconocimiento de Recetas**: Identificar platos completos

---

## 📚 Recursos Adicionales

- [MDN: getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Clarifai Documentation](https://docs.clarifai.com/)
- [Google Cloud Vision](https://cloud.google.com/vision/docs)
- [Nutritionix API](https://docs.nutritionix.com/)
- [TensorFlow.js Food Recognition](https://www.tensorflow.org/js)

---

**¡Tu aplicación ahora puede reconocer alimentos con solo apuntar la cámara! 📸🍎**
