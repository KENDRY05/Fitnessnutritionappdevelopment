/**
 * Componente de Escáner de Alimentos
 * Usa la cámara del dispositivo para identificar alimentos mediante IA
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Camera, X, RotateCcw, Check, Loader2, AlertCircle } from 'lucide-react';
import { recognizeFood } from '../services/foodRecognitionService';
import type { Food } from '../types';

interface FoodScannerProps {
  onFoodDetected: (food: Food) => void;
  onClose: () => void;
}

export function FoodScanner({ onFoodDetected, onClose }: FoodScannerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Limpiar al desmontar
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Usar cámara trasera en móviles
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Configurar tamaño del canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dibujar el frame actual del video
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir a base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const foods = await recognizeFood(capturedImage);

      if (foods.length === 0) {
        setError('No se detectaron alimentos en la imagen. Intenta con otra foto.');
      } else {
        setDetectedFoods(foods);
      }
    } catch (err) {
      console.error('Error al analizar imagen:', err);
      setError('Error al analizar la imagen. Intenta nuevamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setDetectedFoods([]);
    setError('');
    startCamera();
  };

  const handleSelectFood = (food: Food) => {
    onFoodDetected(food);
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
    onClose();
  };

  // Auto-analizar cuando se captura la imagen
  useEffect(() => {
    if (capturedImage && !isAnalyzing && detectedFoods.length === 0) {
      analyzeImage();
    }
  }, [capturedImage]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Escanear Alimento
          </DialogTitle>
          <DialogDescription>
            Apunta la cámara a tu comida para identificarla automáticamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Vista de Cámara o Imagen Capturada */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {isCameraActive && !capturedImage && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {capturedImage && (
              <img
                src={capturedImage}
                alt="Foto capturada"
                className="w-full h-full object-cover"
              />
            )}

            {!isCameraActive && !capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={startCamera} size="lg">
                  <Camera className="w-5 h-5 mr-2" />
                  Activar Cámara
                </Button>
              </div>
            )}

            {/* Canvas oculto para captura */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controles de Cámara */}
          {isCameraActive && !capturedImage && (
            <div className="flex justify-center gap-3">
              <Button onClick={capturePhoto} size="lg" className="rounded-full w-16 h-16">
                <Camera className="w-6 h-6" />
              </Button>
            </div>
          )}

          {/* Estado de Análisis */}
          {isAnalyzing && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-6 flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <p className="text-blue-900 font-medium">Analizando imagen con IA...</p>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="py-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-900">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Resultados de Detección */}
          {detectedFoods.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Alimentos Detectados:</h3>
              {detectedFoods.map((food, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow border-green-200 bg-green-50"
                  onClick={() => handleSelectFood(food)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-lg">{food.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Por {food.servingSize}{food.servingUnit}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="font-medium">{food.calories} kcal</span>
                          <span className="text-green-600">P: {food.protein}g</span>
                          <span className="text-orange-600">C: {food.carbs}g</span>
                          <span className="text-red-600">G: {food.fats}g</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Seleccionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {capturedImage && !isAnalyzing && (
            <Button onClick={retakePhoto} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Tomar Otra Foto
            </Button>
          )}
          <Button onClick={handleClose} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
