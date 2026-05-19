/**
 * Dashboard Principal
 * Muestra el progreso de macros del día con visualizaciones
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { calculateUserMacros } from '../utils/macroCalculator';
import type { DailyLog, MacroRequirements, FoodEntry } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Plus, Trash2, LogOut, User as UserIcon, Calendar } from 'lucide-react';

interface DashboardProps {
  onAddFood: () => void;
}

export function Dashboard({ onAddFood }: DashboardProps) {
  const { user, logout, updateProfile } = useAuth();
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [macroGoals, setMacroGoals] = useState<MacroRequirements | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());

  useEffect(() => {
    if (user) {
      // Calcular metas de macros
      const goals = calculateUserMacros(user);
      setMacroGoals(goals);

      // Cargar registro del día
      loadDailyLog(selectedDate);
    }
  }, [user, selectedDate]);

  const loadDailyLog = (date: string) => {
    const log = storageService.getDailyLog(date);
    if (!log && user) {
      // Crear registro vacío si no existe
      setDailyLog({
        date: date.split('T')[0],
        userId: user.id,
        entries: [],
        totalMacros: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      });
    } else {
      setDailyLog(log);
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    storageService.deleteFoodEntry(entryId, selectedDate);
    loadDailyLog(selectedDate);
  };

  if (!user || !macroGoals || !dailyLog) {
    return <div>Cargando...</div>;
  }

  const consumed = dailyLog.totalMacros;
  const remaining = {
    calories: Math.max(0, macroGoals.calories - consumed.calories),
    protein: Math.max(0, macroGoals.protein - consumed.protein),
    carbs: Math.max(0, macroGoals.carbs - consumed.carbs),
    fats: Math.max(0, macroGoals.fats - consumed.fats),
  };

  // Datos para el gráfico de pastel de calorías
  const calorieData = [
    { name: 'Consumidas', value: consumed.calories, color: '#6366f1' },
    { name: 'Restantes', value: remaining.calories, color: '#e5e7eb' },
  ];

  // Datos para macros individuales
  const macroData = [
    {
      name: 'Proteínas',
      consumed: consumed.protein,
      goal: macroGoals.protein,
      color: '#10b981',
      percentage: Math.min((consumed.protein / macroGoals.protein) * 100, 100),
    },
    {
      name: 'Carbohidratos',
      consumed: consumed.carbs,
      goal: macroGoals.carbs,
      color: '#f59e0b',
      percentage: Math.min((consumed.carbs / macroGoals.carbs) * 100, 100),
    },
    {
      name: 'Grasas',
      consumed: consumed.fats,
      goal: macroGoals.fats,
      color: '#ef4444',
      percentage: Math.min((consumed.fats / macroGoals.fats) * 100, 100),
    },
  ];

  const goalLabels: Record<string, string> = {
    bulk: 'Ganar Masa Muscular',
    cut: 'Perder Grasa',
    recomp: 'Recomposición',
    maintenance: 'Mantenimiento',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">FitMacros</h1>
            <p className="text-sm text-gray-600">Hola, {user.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Información del usuario y objetivo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tu Objetivo: {goalLabels[user.goal]}</CardTitle>
                <CardDescription>
                  {user.weight} kg • {user.height} cm • {user.age} años
                </CardDescription>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <UserIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Selector de fecha */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <input
                  type="date"
                  value={selectedDate.split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value).toISOString())}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <Button onClick={onAddFood}>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Alimento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Calorías */}
        <Card>
          <CardHeader>
            <CardTitle>Calorías del Día</CardTitle>
            <CardDescription>
              {consumed.calories.toFixed(0)} / {macroGoals.calories} kcal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calorieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {calorieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 w-full">
                <div className="text-center md:text-left mb-4">
                  <div className="text-4xl font-bold text-indigo-600">
                    {remaining.calories.toFixed(0)}
                  </div>
                  <div className="text-gray-600">calorías restantes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Macronutrientes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {macroData.map((macro) => (
            <Card key={macro.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{macro.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{macro.consumed.toFixed(1)}g</span>
                    <span className="text-gray-500">{macro.goal}g</span>
                  </div>
                  <Progress
                    value={macro.percentage}
                    className="h-3"
                    style={{
                      '--progress-background': macro.color,
                    } as React.CSSProperties}
                  />
                  <div className="text-xs text-gray-600 text-center">
                    {(macro.goal - macro.consumed).toFixed(1)}g restantes
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lista de alimentos consumidos */}
        <Card>
          <CardHeader>
            <CardTitle>Alimentos Consumidos Hoy</CardTitle>
            <CardDescription>
              {dailyLog.entries.length} {dailyLog.entries.length === 1 ? 'alimento' : 'alimentos'} registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dailyLog.entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No has registrado ningún alimento hoy.</p>
                <Button onClick={onAddFood} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir tu primer alimento
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyLog.entries.map((entry) => {
                  const totalCals = entry.food.calories * entry.servings;
                  const totalProtein = entry.food.protein * entry.servings;
                  const totalCarbs = entry.food.carbs * entry.servings;
                  const totalFats = entry.food.fats * entry.servings;

                  return (
                    <div
                      key={entry.id}
                      className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{entry.food.name}</div>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {entry.mealType}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {entry.servings} × {entry.food.servingSize}{entry.food.servingUnit}
                        </div>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="font-medium">{totalCals.toFixed(0)} kcal</span>
                          <span className="text-green-600">P: {totalProtein.toFixed(1)}g</span>
                          <span className="text-orange-600">C: {totalCarbs.toFixed(1)}g</span>
                          <span className="text-red-600">G: {totalFats.toFixed(1)}g</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
