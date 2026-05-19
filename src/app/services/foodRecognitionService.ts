/**
 * Servicio de Reconocimiento de Alimentos usando IA
 *
 * Este servicio puede integrarse con diferentes APIs de reconocimiento de imágenes:
 * - Clarifai Food Model
 * - Google Cloud Vision API
 * - Nutritionix API
 * - Edamam Food Database API
 * - Custom Machine Learning Model
 */

import type { Food } from '../types';
import { storageService } from './storageService';

// ============================================================================
// CONFIGURACIÓN DE API
// ============================================================================

// Para usar en producción, añade tu API key aquí
const CLARIFAI_API_KEY = 'YOUR_CLARIFAI_API_KEY';
const GOOGLE_CLOUD_API_KEY = 'YOUR_GOOGLE_CLOUD_API_KEY';
const NUTRITIONIX_APP_ID = 'YOUR_NUTRITIONIX_APP_ID';
const NUTRITIONIX_API_KEY = 'YOUR_NUTRITIONIX_API_KEY';

// Configuración del servicio a usar
type RecognitionService = 'mock' | 'clarifai' | 'google' | 'nutritionix';
const ACTIVE_SERVICE: RecognitionService = 'mock'; // Cambiar en producción

// ============================================================================
// BASE DE DATOS DE MAPEO DE ALIMENTOS
// ============================================================================

/**
 * Mapeo de alimentos detectados a información nutricional
 * Expande esto con más alimentos según necesites
 */
const FOOD_DATABASE: Record<string, Omit<Food, 'id'>> = {
  // Frutas
  'apple': { name: 'Manzana', calories: 52, protein: 0.3, carbs: 14, fats: 0.2, servingSize: 100, servingUnit: 'g' },
  'banana': { name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, servingSize: 100, servingUnit: 'g' },
  'orange': { name: 'Naranja', calories: 47, protein: 0.9, carbs: 12, fats: 0.1, servingSize: 100, servingUnit: 'g' },
  'strawberry': { name: 'Fresa', calories: 32, protein: 0.7, carbs: 8, fats: 0.3, servingSize: 100, servingUnit: 'g' },

  // Proteínas
  'chicken': { name: 'Pechuga de Pollo', calories: 165, protein: 31, carbs: 0, fats: 3.6, servingSize: 100, servingUnit: 'g' },
  'egg': { name: 'Huevo', calories: 155, protein: 13, carbs: 1.1, fats: 11, servingSize: 100, servingUnit: 'g' },
  'fish': { name: 'Pescado', calories: 206, protein: 22, carbs: 0, fats: 12, servingSize: 100, servingUnit: 'g' },
  'beef': { name: 'Carne de Res', calories: 250, protein: 26, carbs: 0, fats: 15, servingSize: 100, servingUnit: 'g' },
  'tuna': { name: 'Atún', calories: 116, protein: 26, carbs: 0, fats: 0.8, servingSize: 100, servingUnit: 'g' },

  // Carbohidratos
  'rice': { name: 'Arroz Blanco', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, servingSize: 100, servingUnit: 'g' },
  'pasta': { name: 'Pasta', calories: 131, protein: 5, carbs: 25, fats: 1.1, servingSize: 100, servingUnit: 'g' },
  'bread': { name: 'Pan', calories: 265, protein: 9, carbs: 49, fats: 3.2, servingSize: 100, servingUnit: 'g' },
  'potato': { name: 'Papa', calories: 77, protein: 2, carbs: 17, fats: 0.1, servingSize: 100, servingUnit: 'g' },
  'oatmeal': { name: 'Avena', calories: 389, protein: 16.9, carbs: 66, fats: 6.9, servingSize: 100, servingUnit: 'g' },

  // Vegetales
  'broccoli': { name: 'Brócoli', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, servingSize: 100, servingUnit: 'g' },
  'spinach': { name: 'Espinaca', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, servingSize: 100, servingUnit: 'g' },
  'tomato': { name: 'Tomate', calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, servingSize: 100, servingUnit: 'g' },
  'carrot': { name: 'Zanahoria', calories: 41, protein: 0.9, carbs: 10, fats: 0.2, servingSize: 100, servingUnit: 'g' },
  'lettuce': { name: 'Lechuga', calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2, servingSize: 100, servingUnit: 'g' },

  // Grasas saludables
  'avocado': { name: 'Aguacate', calories: 160, protein: 2, carbs: 9, fats: 15, servingSize: 100, servingUnit: 'g' },
  'nuts': { name: 'Almendras', calories: 579, protein: 21, carbs: 22, fats: 50, servingSize: 100, servingUnit: 'g' },
  'salmon': { name: 'Salmón', calories: 208, protein: 20, carbs: 0, fats: 13, servingSize: 100, servingUnit: 'g' },
};

// ============================================================================
// FUNCIÓN PRINCIPAL DE RECONOCIMIENTO
// ============================================================================

export async function recognizeFood(imageBase64: string): Promise<Food[]> {
  switch (ACTIVE_SERVICE) {
    case 'clarifai':
      return recognizeFoodClarifai(imageBase64);
    case 'google':
      return recognizeFoodGoogle(imageBase64);
    case 'nutritionix':
      return recognizeFoodNutritionix(imageBase64);
    case 'mock':
    default:
      return recognizeFoodMock(imageBase64);
  }
}

// ============================================================================
// IMPLEMENTACIÓN MOCK (Para desarrollo/pruebas)
// ============================================================================

async function recognizeFoodMock(imageBase64: string): Promise<Food[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 2000));

  // En un entorno real, aquí iría la llamada a la API
  // Por ahora, retornamos resultados aleatorios para demostración

  const allFoodKeys = Object.keys(FOOD_DATABASE);
  const randomIndex = Math.floor(Math.random() * allFoodKeys.length);
  const detectedFoodKey = allFoodKeys[randomIndex];
  const foodData = FOOD_DATABASE[detectedFoodKey];

  // Crear alimento con ID único
  const detectedFood: Food = {
    ...foodData,
    id: `detected_${Date.now()}`,
  };

  return [detectedFood];
}

// ============================================================================
// IMPLEMENTACIÓN CON CLARIFAI API
// ============================================================================

async function recognizeFoodClarifai(imageBase64: string): Promise<Food[]> {
  try {
    // Remover el prefijo "data:image/jpeg;base64," si existe
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const response = await fetch('https://api.clarifai.com/v2/models/food-item-recognition/outputs', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${CLARIFAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              image: {
                base64: base64Data,
              },
            },
          },
        ],
      }),
    });

    const data = await response.json();

    // Extraer conceptos detectados
    const concepts = data.outputs[0]?.data?.concepts || [];

    // Mapear los conceptos a alimentos con información nutricional
    const detectedFoods: Food[] = concepts
      .filter((concept: any) => concept.value > 0.7) // Solo conceptos con >70% confianza
      .slice(0, 3) // Máximo 3 resultados
      .map((concept: any) => {
        const foodKey = concept.name.toLowerCase();
        const foodData = FOOD_DATABASE[foodKey];

        if (foodData) {
          return {
            ...foodData,
            id: `detected_${Date.now()}_${foodKey}`,
          };
        }

        // Si no está en nuestra DB, buscar en la base de datos local
        const localFoods = storageService.searchFoods(concept.name);
        if (localFoods.length > 0) {
          return localFoods[0];
        }

        return null;
      })
      .filter((food): food is Food => food !== null);

    return detectedFoods;
  } catch (error) {
    console.error('Error con Clarifai API:', error);
    throw new Error('Error al reconocer el alimento');
  }
}

// ============================================================================
// IMPLEMENTACIÓN CON GOOGLE CLOUD VISION API
// ============================================================================

async function recognizeFoodGoogle(imageBase64: string): Promise<Food[]> {
  try {
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Data,
              },
              features: [
                {
                  type: 'LABEL_DETECTION',
                  maxResults: 10,
                },
                {
                  type: 'WEB_DETECTION',
                  maxResults: 5,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extraer etiquetas detectadas
    const labels = data.responses[0]?.labelAnnotations || [];

    // Mapear etiquetas a alimentos
    const detectedFoods: Food[] = [];

    for (const label of labels) {
      const foodKey = label.description.toLowerCase();
      const foodData = FOOD_DATABASE[foodKey];

      if (foodData) {
        detectedFoods.push({
          ...foodData,
          id: `detected_${Date.now()}_${foodKey}`,
        });

        if (detectedFoods.length >= 3) break;
      }
    }

    return detectedFoods;
  } catch (error) {
    console.error('Error con Google Cloud Vision API:', error);
    throw new Error('Error al reconocer el alimento');
  }
}

// ============================================================================
// IMPLEMENTACIÓN CON NUTRITIONIX API
// ============================================================================

async function recognizeFoodNutritionix(imageBase64: string): Promise<Food[]> {
  try {
    // Convertir base64 a Blob
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Crear FormData
    const formData = new FormData();
    formData.append('image', blob, 'food.jpg');

    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
      },
      body: formData,
    });

    const data = await response.json();

    // Mapear respuesta de Nutritionix a nuestro formato
    const detectedFoods: Food[] = (data.foods || []).map((item: any) => ({
      id: `nutritionix_${Date.now()}_${item.food_name}`,
      name: item.food_name,
      calories: item.nf_calories,
      protein: item.nf_protein,
      carbs: item.nf_total_carbohydrate,
      fats: item.nf_total_fat,
      servingSize: item.serving_weight_grams,
      servingUnit: 'g',
    }));

    return detectedFoods;
  } catch (error) {
    console.error('Error con Nutritionix API:', error);
    throw new Error('Error al reconocer el alimento');
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Convierte un nombre de alimento en inglés a español
 */
function translateFoodName(englishName: string): string {
  const translations: Record<string, string> = {
    'apple': 'Manzana',
    'banana': 'Plátano',
    'chicken': 'Pollo',
    'rice': 'Arroz',
    'egg': 'Huevo',
    // Añade más traducciones según necesites
  };

  return translations[englishName.toLowerCase()] || englishName;
}

/**
 * Busca información nutricional de un alimento por nombre
 */
export function findFoodByName(name: string): Food | null {
  const foodKey = name.toLowerCase();
  const foodData = FOOD_DATABASE[foodKey];

  if (foodData) {
    return {
      ...foodData,
      id: `food_${Date.now()}`,
    };
  }

  // Buscar en la base de datos local
  const localFoods = storageService.searchFoods(name);
  return localFoods.length > 0 ? localFoods[0] : null;
}
