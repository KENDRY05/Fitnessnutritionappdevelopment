/**
 * Tipos de datos para la aplicación de Fitness & Nutrición
 */

export type GoalType = 'bulk' | 'cut' | 'recomp' | 'maintenance';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Gender = 'male' | 'female';

export interface User {
  id: string;
  email: string;
  name: string;
  gender: Gender;
  age: number;
  weight: number; // kg
  height: number; // cm
  activityLevel: ActivityLevel;
  goal: GoalType;
  createdAt: string;
}

export interface MacroRequirements {
  calories: number;
  protein: number; // gramos
  carbs: number; // gramos
  fats: number; // gramos
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: number; // gramos
  servingUnit: string; // ej: "g", "ml", "unidad"
}

export interface FoodEntry {
  id: string;
  foodId: string;
  food: Food;
  servings: number;
  date: string; // ISO date string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyLog {
  date: string; // ISO date string
  userId: string;
  entries: FoodEntry[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
