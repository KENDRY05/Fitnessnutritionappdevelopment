/**
 * Calculadora de macros usando las fórmulas de Mifflin-St Jeor y Harris-Benedict
 */

import type { User, MacroRequirements, ActivityLevel, GoalType } from '../types';

/**
 * Multiplicadores de nivel de actividad física
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,     // Poco o ningún ejercicio
  light: 1.375,       // Ejercicio ligero 1-3 días/semana
  moderate: 1.55,     // Ejercicio moderado 3-5 días/semana
  active: 1.725,      // Ejercicio intenso 6-7 días/semana
  very_active: 1.9,   // Ejercicio muy intenso, atleta
};

/**
 * Calcula BMR (Tasa Metabólica Basal) usando Mifflin-St Jeor
 * Esta es la fórmula más precisa y moderna
 */
export function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
  // Mifflin-St Jeor:
  // Hombres: BMR = (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad en años) + 5
  // Mujeres: BMR = (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad en años) - 161

  const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}

/**
 * Calcula TDEE (Total Daily Energy Expenditure)
 * TDEE = BMR × Factor de Actividad
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Ajusta calorías según el objetivo del usuario
 */
export function adjustCaloriesForGoal(tdee: number, goal: GoalType): number {
  switch (goal) {
    case 'bulk':
      // Superávit de 300-500 calorías para ganar masa muscular
      return Math.round(tdee + 400);

    case 'cut':
      // Déficit de 300-500 calorías para perder grasa
      return Math.round(tdee - 400);

    case 'recomp':
      // Pequeño déficit para recomposición corporal
      return Math.round(tdee - 100);

    case 'maintenance':
    default:
      // Mantener peso actual
      return Math.round(tdee);
  }
}

/**
 * Calcula la distribución de macronutrientes según el objetivo
 */
export function calculateMacros(calories: number, weight: number, goal: GoalType): MacroRequirements {
  let proteinGrams: number;
  let fatsGrams: number;
  let carbsGrams: number;

  switch (goal) {
    case 'bulk':
      // Volumen: Proteína alta, carbos altos, grasas moderadas
      proteinGrams = weight * 2.0;  // 2g por kg de peso
      fatsGrams = weight * 0.8;     // 0.8g por kg
      const caloriesFromProteinFat = (proteinGrams * 4) + (fatsGrams * 9);
      carbsGrams = (calories - caloriesFromProteinFat) / 4;
      break;

    case 'cut':
      // Definición: Proteína muy alta (preservar músculo), carbos moderados, grasas bajas
      proteinGrams = weight * 2.2;  // 2.2g por kg de peso
      fatsGrams = weight * 0.6;     // 0.6g por kg
      const caloriesFromPF = (proteinGrams * 4) + (fatsGrams * 9);
      carbsGrams = (calories - caloriesFromPF) / 4;
      break;

    case 'recomp':
      // Recomposición: Proteína alta, carbos moderados, grasas moderadas
      proteinGrams = weight * 2.0;
      fatsGrams = weight * 0.7;
      const caloriesRecomp = (proteinGrams * 4) + (fatsGrams * 9);
      carbsGrams = (calories - caloriesRecomp) / 4;
      break;

    case 'maintenance':
    default:
      // Mantenimiento: Balance equilibrado
      proteinGrams = weight * 1.8;
      fatsGrams = weight * 0.8;
      const caloriesMaint = (proteinGrams * 4) + (fatsGrams * 9);
      carbsGrams = (calories - caloriesMaint) / 4;
      break;
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbsGrams),
    fats: Math.round(fatsGrams),
  };
}

/**
 * Función principal que calcula todos los requerimientos de macros
 */
export function calculateUserMacros(user: User): MacroRequirements {
  // 1. Calcular BMR
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);

  // 2. Calcular TDEE
  const tdee = calculateTDEE(bmr, user.activityLevel);

  // 3. Ajustar calorías según objetivo
  const targetCalories = adjustCaloriesForGoal(tdee, user.goal);

  // 4. Calcular distribución de macros
  return calculateMacros(targetCalories, user.weight, user.goal);
}

/**
 * Calcula el porcentaje de progreso de un macro
 */
export function calculateMacroProgress(current: number, target: number): number {
  return Math.min((current / target) * 100, 100);
}

/**
 * Calcula macros totales de múltiples entradas de alimentos
 */
export function sumMacros(entries: Array<{ calories: number; protein: number; carbs: number; fats: number }>): {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
} {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fats: acc.fats + entry.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
}
