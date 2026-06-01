/**
 * Pantalla de Onboarding/Registro
 * Guía al usuario a través del proceso de configuración inicial
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { GoalType, ActivityLevel, Gender } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Target, Activity, User, TrendingUp, TrendingDown, Zap, Scale, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onSwitchToLogin: () => void;
}

export function Onboarding({ onSwitchToLogin }: OnboardingProps) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Datos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    gender: 'male' as Gender,
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate' as ActivityLevel,
    goal: 'maintenance' as GoalType,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError('');

      // Validación
      if (!formData.email || !formData.name || !formData.password) {
        setError('Por favor completa todos los campos');
        return;
      }

      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.email || !formData.name || !formData.password)) {
      setError('Por favor completa todos los campos');
      return;
    }
    if (step === 1 && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (step === 2 && (!formData.age || !formData.weight || !formData.height)) {
      setError('Por favor completa todos los campos');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-600 rounded-full p-3">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">FitMacros</CardTitle>
          <CardDescription>
            Tu asistente personal de nutrición y fitness
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Indicador de progreso */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-all ${
                  s <= step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Paso 1: Información básica */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Información Básica</h3>
                <p className="text-sm text-gray-600">Comencemos con lo esencial</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label>Género</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Femenino</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Paso 2: Datos físicos */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Datos Físicos</h3>
                <p className="text-sm text-gray-600">Para calcular tus requerimientos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Edad (años)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Nivel de actividad */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Nivel de Actividad</h3>
                <p className="text-sm text-gray-600">¿Qué tan activo eres?</p>
              </div>

              <RadioGroup
                value={formData.activityLevel}
                onValueChange={(value) => handleInputChange('activityLevel', value)}
                className="space-y-3"
              >
                {[
                  { value: 'sedentary', label: 'Sedentario', desc: 'Poco o ningún ejercicio' },
                  { value: 'light', label: 'Ligero', desc: '1-3 días/semana' },
                  { value: 'moderate', label: 'Moderado', desc: '3-5 días/semana' },
                  { value: 'active', label: 'Activo', desc: '6-7 días/semana' },
                  { value: 'very_active', label: 'Muy Activo', desc: 'Atleta o entrenamiento intenso' },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Paso 4: Objetivo */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Tu Objetivo</h3>
                <p className="text-sm text-gray-600">¿Qué quieres lograr?</p>
              </div>

              <RadioGroup
                value={formData.goal}
                onValueChange={(value) => handleInputChange('goal', value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  {
                    value: 'bulk',
                    label: 'Ganar Masa Muscular',
                    desc: 'Superávit calórico para volumen',
                    icon: TrendingUp,
                    color: 'bg-green-100 text-green-600',
                  },
                  {
                    value: 'cut',
                    label: 'Perder Grasa',
                    desc: 'Déficit calórico para definición',
                    icon: TrendingDown,
                    color: 'bg-red-100 text-red-600',
                  },
                  {
                    value: 'recomp',
                    label: 'Recomposición',
                    desc: 'Ganar músculo y perder grasa',
                    icon: Zap,
                    color: 'bg-purple-100 text-purple-600',
                  },
                  {
                    value: 'maintenance',
                    label: 'Mantenimiento',
                    desc: 'Mantener peso actual',
                    icon: Scale,
                    color: 'bg-blue-100 text-blue-600',
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`rounded-full p-2 ${option.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <p className="text-sm text-gray-500">{option.desc}</p>
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Enlace al Login */}
          {step === 1 && (
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
              </button>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Atrás
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={nextStep} className="flex-1">
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1">
                Comenzar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
