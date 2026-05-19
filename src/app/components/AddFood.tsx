/**
 * Pantalla para Añadir Alimentos
 * Permite buscar alimentos y registrarlos en el diario
 */

import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import type { Food } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Search, ArrowLeft, Plus, Utensils, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FoodScanner } from './FoodScanner';

interface AddFoodProps {
  onBack: () => void;
  onFoodAdded: () => void;
}

export function AddFood({ onBack, onFoodAdded }: AddFoodProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState('1');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [allFoods, setAllFoods] = useState<Food[]>([]);

  // Formulario para crear alimento personalizado
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    servingSize: '',
    servingUnit: 'g',
  });

  useEffect(() => {
    // Cargar todos los alimentos al inicio
    const foods = storageService.getAllFoods();
    setAllFoods(foods);
    setSearchResults(foods);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults(allFoods);
    } else {
      const results = storageService.searchFoods(query);
      setSearchResults(results);
    }
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setServings('1');
    setShowAddDialog(true);
  };

  const handleAddToLog = () => {
    if (!selectedFood) return;

    storageService.addFoodEntry({
      foodId: selectedFood.id,
      food: selectedFood,
      servings: parseFloat(servings),
      date: new Date().toISOString(),
      mealType,
    });

    setShowAddDialog(false);
    setSelectedFood(null);
    onFoodAdded();
  };

  const handleCreateCustomFood = () => {
    if (!customFood.name || !customFood.calories || !customFood.protein || !customFood.carbs || !customFood.fats) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newFood = storageService.addFood({
      name: customFood.name,
      calories: parseFloat(customFood.calories),
      protein: parseFloat(customFood.protein),
      carbs: parseFloat(customFood.carbs),
      fats: parseFloat(customFood.fats),
      servingSize: parseFloat(customFood.servingSize) || 100,
      servingUnit: customFood.servingUnit,
    });

    // Actualizar lista
    const updatedFoods = storageService.getAllFoods();
    setAllFoods(updatedFoods);
    setSearchResults(updatedFoods);

    // Limpiar formulario
    setCustomFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      servingSize: '',
      servingUnit: 'g',
    });

    alert('Alimento añadido a la base de datos');
  };

  const handleFoodDetected = (food: Food) => {
    // Cuando el escáner detecta un alimento, lo guardamos en la base de datos si no existe
    const existingFood = allFoods.find(f => f.name === food.name);

    if (!existingFood) {
      // Guardar el alimento detectado en la base de datos
      storageService.addFood({
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        servingSize: food.servingSize,
        servingUnit: food.servingUnit,
      });

      // Actualizar lista
      const updatedFoods = storageService.getAllFoods();
      setAllFoods(updatedFoods);
      setSearchResults(updatedFoods);
    }

    // Abrir el diálogo para añadir al diario
    setSelectedFood(existingFood || food);
    setShowScanner(false);
    setShowAddDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-xl font-bold">Añadir Alimento</h1>
            <p className="text-sm text-gray-600">Busca o crea un nuevo alimento</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Buscar Alimento</TabsTrigger>
            <TabsTrigger value="create">Crear Personalizado</TabsTrigger>
          </TabsList>

          {/* Tab: Buscar Alimento */}
          <TabsContent value="search" className="space-y-6">
            {/* Buscador y Escáner */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar alimento (ej: pollo, arroz, huevo...)"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Botón de Escáner */}
                <Button
                  onClick={() => setShowScanner(true)}
                  variant="outline"
                  className="w-full border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Escanear Alimento con Cámara
                </Button>
              </CardContent>
            </Card>

            {/* Resultados de búsqueda */}
            <div className="space-y-3">
              {searchResults.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No se encontraron alimentos</p>
                    <p className="text-sm mt-2">Intenta con otro término o crea uno personalizado</p>
                  </CardContent>
                </Card>
              ) : (
                searchResults.map((food) => (
                  <Card
                    key={food.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleSelectFood(food)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{food.name}</h3>
                          <p className="text-sm text-gray-600">
                            Por {food.servingSize}{food.servingUnit}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="font-medium">{food.calories} kcal</span>
                            <span className="text-green-600">P: {food.protein}g</span>
                            <span className="text-orange-600">C: {food.carbs}g</span>
                            <span className="text-red-600">G: {food.fats}g</span>
                          </div>
                        </div>
                        <Button size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab: Crear Alimento Personalizado */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crear Alimento Personalizado</CardTitle>
                <CardDescription>
                  Añade un nuevo alimento a tu base de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foodName">Nombre del Alimento</Label>
                  <Input
                    id="foodName"
                    placeholder="Ej: Mi receta especial"
                    value={customFood.name}
                    onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="servingSize">Tamaño de Porción</Label>
                    <Input
                      id="servingSize"
                      type="number"
                      placeholder="100"
                      value={customFood.servingSize}
                      onChange={(e) => setCustomFood({ ...customFood, servingSize: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servingUnit">Unidad</Label>
                    <Input
                      id="servingUnit"
                      placeholder="g, ml, unidad"
                      value={customFood.servingUnit}
                      onChange={(e) => setCustomFood({ ...customFood, servingUnit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calorías</Label>
                  <Input
                    id="calories"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={customFood.calories}
                    onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="protein">Proteínas (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={customFood.protein}
                      onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbohidratos (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={customFood.carbs}
                      onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fats">Grasas (g)</Label>
                    <Input
                      id="fats"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={customFood.fats}
                      onChange={(e) => setCustomFood({ ...customFood, fats: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleCreateCustomFood} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Guardar Alimento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para añadir al log */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir {selectedFood?.name}</DialogTitle>
            <DialogDescription>
              Especifica la cantidad y el tipo de comida
            </DialogDescription>
          </DialogHeader>

          {selectedFood && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="servings">Porciones</Label>
                <Input
                  id="servings"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
                <p className="text-sm text-gray-600">
                  1 porción = {selectedFood.servingSize}{selectedFood.servingUnit}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Comida</Label>
                <RadioGroup value={mealType} onValueChange={(v) => setMealType(v as any)}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'breakfast', label: 'Desayuno' },
                      { value: 'lunch', label: 'Almuerzo' },
                      { value: 'dinner', label: 'Cena' },
                      { value: 'snack', label: 'Snack' },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Preview de valores totales */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Totales:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Calorías:</span>
                    <span className="ml-2 font-medium">
                      {(selectedFood.calories * parseFloat(servings || '0')).toFixed(0)} kcal
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Proteínas:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {(selectedFood.protein * parseFloat(servings || '0')).toFixed(1)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbohidratos:</span>
                    <span className="ml-2 font-medium text-orange-600">
                      {(selectedFood.carbs * parseFloat(servings || '0')).toFixed(1)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Grasas:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {(selectedFood.fats * parseFloat(servings || '0')).toFixed(1)}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddToLog}>Añadir al Diario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Escáner de Alimentos */}
      {showScanner && (
        <FoodScanner
          onFoodDetected={handleFoodDetected}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
