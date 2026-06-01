/**
 * Componente de Prueba Simple
 * Para verificar que el escáner funciona
 */

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera } from 'lucide-react';
import { FoodScanner } from './FoodScanner';
import type { Food } from '../types';

export function TestScanner() {
  const [showScanner, setShowScanner] = useState(false);
  const [detectedFood, setDetectedFood] = useState<Food | null>(null);

  const handleFoodDetected = (food: Food) => {
    setDetectedFood(food);
    setShowScanner(false);
    alert(`¡Alimento detectado! ${food.name} - ${food.calories} kcal`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Prueba del Escáner 📸</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Haz clic en el botón para probar el escáner de alimentos
          </p>

          <Button
            onClick={() => setShowScanner(true)}
            className="w-full"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            Abrir Escáner
          </Button>

          {detectedFood && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900">Último alimento detectado:</h3>
              <p className="text-green-700">{detectedFood.name}</p>
              <p className="text-sm text-green-600">
                {detectedFood.calories} kcal | P: {detectedFood.protein}g | C: {detectedFood.carbs}g | G: {detectedFood.fats}g
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-semibold mb-2">ℹ️ Modo Demo Activo</p>
            <p>El escáner retornará un alimento aleatorio después de 2 segundos.</p>
            <p className="mt-2">Para usar APIs reales, consulta GUIA_ESCANER_ALIMENTOS.md</p>
          </div>
        </CardContent>
      </Card>

      {showScanner && (
        <FoodScanner
          onFoodDetected={handleFoodDetected}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
