/**
 * Servicio de almacenamiento local
 * Simula un backend usando localStorage
 */

import type { User, Food, FoodEntry, DailyLog } from '../types';

const STORAGE_KEYS = {
  USERS: 'fitness_app_users',
  CURRENT_USER: 'fitness_app_current_user',
  FOODS: 'fitness_app_foods',
  DAILY_LOGS: 'fitness_app_daily_logs',
  TOKEN: 'fitness_app_token',
} as const;

/**
 * Base de datos inicial de alimentos comunes
 */
const INITIAL_FOODS: Food[] = [
  // Proteínas
  { id: 'food_1', name: 'Pechuga de Pollo', calories: 165, protein: 31, carbs: 0, fats: 3.6, servingSize: 100, servingUnit: 'g' },
  { id: 'food_2', name: 'Huevo Entero', calories: 155, protein: 13, carbs: 1.1, fats: 11, servingSize: 100, servingUnit: 'g' },
  { id: 'food_3', name: 'Atún en Agua', calories: 116, protein: 26, carbs: 0, fats: 0.8, servingSize: 100, servingUnit: 'g' },
  { id: 'food_4', name: 'Proteína Whey', calories: 120, protein: 24, carbs: 3, fats: 1.5, servingSize: 30, servingUnit: 'g' },

  // Carbohidratos
  { id: 'food_5', name: 'Arroz Blanco Cocido', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, servingSize: 100, servingUnit: 'g' },
  { id: 'food_6', name: 'Avena', calories: 389, protein: 16.9, carbs: 66, fats: 6.9, servingSize: 100, servingUnit: 'g' },
  { id: 'food_7', name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, servingSize: 100, servingUnit: 'g' },
  { id: 'food_8', name: 'Pan Integral', calories: 247, protein: 13, carbs: 41, fats: 3.4, servingSize: 100, servingUnit: 'g' },
  { id: 'food_9', name: 'Pasta Cocida', calories: 131, protein: 5, carbs: 25, fats: 1.1, servingSize: 100, servingUnit: 'g' },

  // Grasas saludables
  { id: 'food_10', name: 'Aguacate', calories: 160, protein: 2, carbs: 9, fats: 15, servingSize: 100, servingUnit: 'g' },
  { id: 'food_11', name: 'Almendras', calories: 579, protein: 21, carbs: 22, fats: 50, servingSize: 100, servingUnit: 'g' },
  { id: 'food_12', name: 'Aceite de Oliva', calories: 884, protein: 0, carbs: 0, fats: 100, servingSize: 100, servingUnit: 'ml' },

  // Vegetales
  { id: 'food_13', name: 'Brócoli', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, servingSize: 100, servingUnit: 'g' },
  { id: 'food_14', name: 'Espinaca', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, servingSize: 100, servingUnit: 'g' },
  { id: 'food_15', name: 'Tomate', calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, servingSize: 100, servingUnit: 'g' },
];

class StorageService {
  /**
   * Inicializa la base de datos con alimentos predeterminados
   */
  initializeFoods(): void {
    if (!localStorage.getItem(STORAGE_KEYS.FOODS)) {
      localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(INITIAL_FOODS));
    }
  }

  /**
   * Obtiene todos los alimentos
   */
  getAllFoods(): Food[] {
    this.initializeFoods();
    const foods = localStorage.getItem(STORAGE_KEYS.FOODS);
    return foods ? JSON.parse(foods) : [];
  }

  /**
   * Busca alimentos por nombre
   */
  searchFoods(query: string): Food[] {
    const allFoods = this.getAllFoods();
    const lowerQuery = query.toLowerCase();
    return allFoods.filter(food =>
      food.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Agrega un nuevo alimento
   */
  addFood(food: Omit<Food, 'id'>): Food {
    const foods = this.getAllFoods();
    const newFood: Food = {
      ...food,
      id: `food_${Date.now()}`,
    };
    foods.push(newFood);
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(foods));
    return newFood;
  }

  /**
   * Registra un usuario nuevo
   */
  registerUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getAllUsers();

    // Verificar si el email ya existe
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email ya registrado');
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    return newUser;
  }

  /**
   * Login de usuario
   */
  loginUser(email: string, password: string): { user: User; token: string } {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Generar token mock (en producción usarías JWT real)
    const token = btoa(`${user.id}:${Date.now()}`);

    return { user, token };
  }

  /**
   * Obtiene todos los usuarios (privado)
   */
  private getAllUsers(): User[] {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  /**
   * Guarda el usuario actual
   */
  setCurrentUser(user: User, token: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Agrega una entrada de comida al registro diario
   */
  addFoodEntry(entry: Omit<FoodEntry, 'id'>): FoodEntry {
    const newEntry: FoodEntry = {
      ...entry,
      id: `entry_${Date.now()}`,
    };

    const logs = this.getDailyLogs();
    const dateKey = entry.date.split('T')[0]; // YYYY-MM-DD

    let log = logs.find(l => l.date === dateKey && l.userId === this.getCurrentUser()?.id);

    if (!log) {
      log = {
        date: dateKey,
        userId: this.getCurrentUser()!.id,
        entries: [],
        totalMacros: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      };
      logs.push(log);
    }

    log.entries.push(newEntry);
    this.updateLogTotals(log);

    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));

    return newEntry;
  }

  /**
   * Obtiene el registro diario para una fecha específica
   */
  getDailyLog(date: string): DailyLog | null {
    const logs = this.getDailyLogs();
    const dateKey = date.split('T')[0];
    const currentUserId = this.getCurrentUser()?.id;

    return logs.find(l => l.date === dateKey && l.userId === currentUserId) || null;
  }

  /**
   * Elimina una entrada de comida
   */
  deleteFoodEntry(entryId: string, date: string): void {
    const logs = this.getDailyLogs();
    const dateKey = date.split('T')[0];
    const currentUserId = this.getCurrentUser()?.id;

    const log = logs.find(l => l.date === dateKey && l.userId === currentUserId);

    if (log) {
      log.entries = log.entries.filter(e => e.id !== entryId);
      this.updateLogTotals(log);
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    }
  }

  /**
   * Obtiene todos los registros diarios
   */
  private getDailyLogs(): DailyLog[] {
    const logs = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return logs ? JSON.parse(logs) : [];
  }

  /**
   * Actualiza los totales de un registro diario
   */
  private updateLogTotals(log: DailyLog): void {
    log.totalMacros = log.entries.reduce(
      (acc, entry) => {
        const multiplier = entry.servings;
        return {
          calories: acc.calories + (entry.food.calories * multiplier),
          protein: acc.protein + (entry.food.protein * multiplier),
          carbs: acc.carbs + (entry.food.carbs * multiplier),
          fats: acc.fats + (entry.food.fats * multiplier),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }

  /**
   * Actualiza el perfil del usuario
   */
  updateUserProfile(updates: Partial<User>): User {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    const updatedUser = { ...currentUser, ...updates };

    // Actualizar en la lista de usuarios
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Actualizar usuario actual
    this.setCurrentUser(updatedUser, this.getToken()!);

    return updatedUser;
  }
}

export const storageService = new StorageService();
