# Arquitectura Backend - FitMacros

## Stack Tecnológico Implementado

### Frontend
- ✅ **React 18** con TypeScript
- ✅ **Tailwind CSS** para estilos
- ✅ **Radix UI** para componentes base
- ✅ **Recharts** para visualización de datos
- ✅ **date-fns** para manejo de fechas

### Backend Simulado
- ✅ **LocalStorage** como base de datos (simula MySQL)
- ✅ **Servicio de Storage** que emula una API REST
- ✅ **JWT Mock** para autenticación

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── types/
│   │   └── index.ts                   # Tipos TypeScript (User, Food, MacroRequirements, etc.)
│   │
│   ├── utils/
│   │   └── macroCalculator.ts         # Calculadora de macros (Mifflin-St Jeor)
│   │
│   ├── services/
│   │   ├── storageService.ts          # Servicio de almacenamiento (simula backend)
│   │   └── foodRecognitionService.ts  # Servicio de reconocimiento de alimentos con IA
│   │
│   ├── context/
│   │   └── AuthContext.tsx            # Context API para autenticación
│   │
│   ├── components/
│   │   ├── Onboarding.tsx             # Pantalla de registro/configuración inicial
│   │   ├── Dashboard.tsx              # Dashboard principal con gráficos
│   │   ├── AddFood.tsx                # Pantalla para añadir alimentos
│   │   ├── FoodScanner.tsx            # Escáner de alimentos con cámara e IA
│   │   └── ui/                        # Componentes UI reutilizables
│   │
│   └── App.tsx                        # Componente raíz
```

---

## Módulos Implementados

### 1. Sistema de Tipos (types/index.ts)
Define todas las interfaces TypeScript:
- `User`: Perfil del usuario con datos físicos y objetivos
- `MacroRequirements`: Requerimientos calóricos y de macros
- `Food`: Información nutricional de alimentos
- `FoodEntry`: Entrada de alimento en el diario
- `DailyLog`: Registro completo de un día

### 2. Calculadora de Macros (utils/macroCalculator.ts)

#### Fórmulas Implementadas:
- **Mifflin-St Jeor** para calcular BMR (Tasa Metabólica Basal)
  - Hombres: `BMR = (10 × peso) + (6.25 × altura) - (5 × edad) + 5`
  - Mujeres: `BMR = (10 × peso) + (6.25 × altura) - (5 × edad) - 161`

- **TDEE** (Total Daily Energy Expenditure)
  - `TDEE = BMR × Factor de Actividad`

#### Factores de Actividad:
| Nivel | Multiplicador | Descripción |
|-------|--------------|-------------|
| Sedentario | 1.2 | Poco o ningún ejercicio |
| Ligero | 1.375 | Ejercicio 1-3 días/semana |
| Moderado | 1.55 | Ejercicio 3-5 días/semana |
| Activo | 1.725 | Ejercicio 6-7 días/semana |
| Muy Activo | 1.9 | Atleta o entrenamiento intenso |

#### Ajuste por Objetivo:
- **Volumen (Bulk)**: +400 kcal sobre TDEE
- **Definición (Cut)**: -400 kcal bajo TDEE
- **Recomposición**: -100 kcal bajo TDEE
- **Mantenimiento**: TDEE exacto

#### Distribución de Macros por Objetivo:

**Volumen:**
- Proteína: 2.0g/kg
- Grasas: 0.8g/kg
- Carbos: Resto de calorías

**Definición:**
- Proteína: 2.2g/kg (alta para preservar músculo)
- Grasas: 0.6g/kg
- Carbos: Resto de calorías

**Recomposición:**
- Proteína: 2.0g/kg
- Grasas: 0.7g/kg
- Carbos: Resto de calorías

**Mantenimiento:**
- Proteína: 1.8g/kg
- Grasas: 0.8g/kg
- Carbos: Resto de calorías

### 3. Servicio de Almacenamiento (services/storageService.ts)

Simula un backend completo usando LocalStorage:

#### Base de Datos de Alimentos
15 alimentos predefinidos organizados por categorías:
- **Proteínas**: Pollo, huevo, atún, whey
- **Carbohidratos**: Arroz, avena, plátano, pan, pasta
- **Grasas**: Aguacate, almendras, aceite de oliva
- **Vegetales**: Brócoli, espinaca, tomate

#### Endpoints Simulados:

**Autenticación:**
- `registerUser()`: Registra nuevo usuario
- `loginUser()`: Login con email/password
- `logout()`: Cierra sesión
- `getCurrentUser()`: Obtiene usuario actual

**Alimentos:**
- `getAllFoods()`: Lista todos los alimentos
- `searchFoods(query)`: Busca por nombre
- `addFood()`: Crea alimento personalizado

**Diario:**
- `addFoodEntry()`: Registra alimento consumido
- `getDailyLog(date)`: Obtiene registro de un día
- `deleteFoodEntry()`: Elimina entrada

**Perfil:**
- `updateUserProfile()`: Actualiza datos del usuario

### 4. Contexto de Autenticación (context/AuthContext.tsx)

Maneja el estado global del usuario con React Context API:
- Estado de autenticación persistente
- Login/Register/Logout
- Actualización de perfil
- Token JWT mock

### 5. Servicio de Reconocimiento de Alimentos (services/foodRecognitionService.ts)

Sistema de reconocimiento de alimentos usando IA que integra con múltiples APIs:

#### Modos de Operación:
- **Mock** (por defecto): Simulación para desarrollo sin API keys
- **Clarifai**: Reconocimiento especializado en alimentos
- **Google Cloud Vision**: Detección de objetos y etiquetas
- **Nutritionix**: Base de datos nutricional completa

#### Base de Datos de Mapeo:
20+ alimentos comunes mapeados con información nutricional completa.

#### Funciones Principales:
- `recognizeFood(imageBase64)`: Función principal que analiza imagen
- `findFoodByName(name)`: Busca alimento por nombre
- APIs pre-integradas listas para usar con solo añadir API keys

**Ver `GUIA_ESCANER_ALIMENTOS.md` para documentación completa de integración.**

### 6. Componente Escáner (components/FoodScanner.tsx)

Interfaz completa para escaneo de alimentos:
- Acceso a cámara del dispositivo (frontal/trasera)
- Captura de imagen en alta calidad
- Análisis automático con IA
- Visualización de resultados
- Selección y adición directa al diario

---

## Pantallas de la Aplicación

### 1. Onboarding (Registro)
Proceso de 4 pasos:
1. **Información básica**: Email, nombre, género
2. **Datos físicos**: Edad, peso, altura
3. **Nivel de actividad**: 5 opciones de sedentario a muy activo
4. **Objetivo**: Volumen, Definición, Recomposición, Mantenimiento

### 2. Dashboard
- **Header**: Nombre de usuario, botón de logout
- **Perfil**: Resumen de objetivo y datos físicos
- **Selector de fecha**: Ver registros de cualquier día
- **Gráfico circular**: Calorías consumidas vs restantes
- **Barras de progreso**: Proteínas, Carbos, Grasas
- **Lista de alimentos**: Todos los alimentos del día con macros detallados
- **Botón de añadir**: Acceso rápido a añadir alimento

### 3. Añadir Alimento
Dos pestañas:

**Buscar Alimento:**
- Buscador en tiempo real
- Lista de todos los alimentos disponibles
- Tarjetas con información nutricional completa
- Diálogo para seleccionar porciones y tipo de comida

**Crear Personalizado:**
- Formulario completo para crear alimento nuevo
- Campos: nombre, porción, calorías, proteínas, carbos, grasas
- Se guarda en la base de datos para uso futuro

---

## Cómo Migrar a Backend Real

### Paso 1: Configurar Base de Datos MySQL

```sql
-- Tabla de Usuarios
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  gender ENUM('male', 'female') NOT NULL,
  age INT NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') NOT NULL,
  goal ENUM('bulk', 'cut', 'recomp', 'maintenance') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Alimentos
CREATE TABLE foods (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  calories DECIMAL(6,2) NOT NULL,
  protein DECIMAL(6,2) NOT NULL,
  carbs DECIMAL(6,2) NOT NULL,
  fats DECIMAL(6,2) NOT NULL,
  serving_size DECIMAL(6,2) NOT NULL,
  serving_unit VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Entradas de Diario
CREATE TABLE food_entries (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  food_id VARCHAR(36) NOT NULL,
  servings DECIMAL(6,2) NOT NULL,
  date DATE NOT NULL,
  meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (food_id) REFERENCES foods(id)
);
```

### Paso 2: Crear API REST con Node.js + Express

```javascript
// server/index.js
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Conexión a MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'fitmacros'
});

// Endpoint: Registrar usuario
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, gender, age, weight, height, activityLevel, goal } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = generateUUID();
  
  await pool.execute(
    'INSERT INTO users (id, email, password_hash, name, gender, age, weight, height, activity_level, goal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, email, hashedPassword, name, gender, age, weight, height, activityLevel, goal]
  );
  
  const token = jwt.sign({ userId }, 'SECRET_KEY', { expiresIn: '7d' });
  res.json({ token, user: { id: userId, email, name, gender, age, weight, height, activityLevel, goal } });
});

// Endpoint: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  const user = users[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);
  
  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  const token = jwt.sign({ userId: user.id }, 'SECRET_KEY', { expiresIn: '7d' });
  res.json({ token, user });
});

// Endpoint: Obtener alimentos
app.get('/api/foods', async (req, res) => {
  const [foods] = await pool.execute('SELECT * FROM foods');
  res.json(foods);
});

// Endpoint: Buscar alimentos
app.get('/api/foods/search', async (req, res) => {
  const { q } = req.query;
  const [foods] = await pool.execute(
    'SELECT * FROM foods WHERE name LIKE ?',
    [`%${q}%`]
  );
  res.json(foods);
});

// Endpoint: Añadir alimento al diario
app.post('/api/entries', authMiddleware, async (req, res) => {
  const { foodId, servings, date, mealType } = req.body;
  const userId = req.userId;
  const entryId = generateUUID();
  
  await pool.execute(
    'INSERT INTO food_entries (id, user_id, food_id, servings, date, meal_type) VALUES (?, ?, ?, ?, ?, ?)',
    [entryId, userId, foodId, servings, date, mealType]
  );
  
  res.json({ id: entryId });
});

// Endpoint: Obtener diario de un día
app.get('/api/entries/:date', authMiddleware, async (req, res) => {
  const { date } = req.params;
  const userId = req.userId;
  
  const [entries] = await pool.execute(
    `SELECT e.*, f.* FROM food_entries e
     JOIN foods f ON e.food_id = f.id
     WHERE e.user_id = ? AND e.date = ?`,
    [userId, date]
  );
  
  res.json(entries);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Paso 3: Actualizar Frontend para usar API

```typescript
// services/apiService.ts
const API_URL = 'http://localhost:3000/api';

export class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async register(userData: RegisterData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  async getFoods() {
    const response = await fetch(`${API_URL}/foods`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }

  async addFoodEntry(entry: FoodEntryData) {
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(entry)
    });
    return response.json();
  }
}
```

---

## Características Destacadas

✅ **Cálculos precisos**: Usa fórmulas científicas validadas (Mifflin-St Jeor)  
✅ **Escáner de alimentos con IA**: Reconocimiento automático usando cámara (Clarifai, Google, Nutritionix)  
✅ **Diseño responsivo**: Funciona en desktop, tablet y móvil  
✅ **Persistencia local**: Los datos se guardan automáticamente  
✅ **Base de datos de alimentos**: 15 alimentos predefinidos + crear personalizados + reconocimiento IA  
✅ **Visualización intuitiva**: Gráficos circulares y barras de progreso  
✅ **Objetivos personalizados**: 4 objetivos diferentes con macros optimizados  
✅ **Seguimiento diario**: Historial completo con selector de fechas  
✅ **TypeScript**: Código type-safe y mantenible  
✅ **Componentes reutilizables**: Arquitectura modular y escalable  
✅ **APIs integradas**: Listas para conectar con servicios de reconocimiento de imágenes  

---

## Próximos Pasos

1. **Backend Real**: Migrar a Node.js + Express + MySQL
2. **Autenticación Segura**: Implementar bcrypt + JWT real
3. **Más Alimentos**: Integrar API de alimentos (USDA, Open Food Facts)
4. **Gráficos de Progreso**: Historial de peso y macros semanales/mensuales
5. **Recetas**: Crear y guardar recetas con cálculo automático de macros
6. **Planes de Comida**: Generar planes semanales según objetivos
7. **Exportar Datos**: PDF o CSV de reportes
8. **Notificaciones**: Recordatorios para registrar comidas
9. **Modo Offline**: PWA con Service Workers
10. **App Móvil**: Migrar a React Native usando esta base

---

## Documentación de Referencia

- [Fórmula Mifflin-St Jeor](https://en.wikipedia.org/wiki/Basal_metabolic_rate)
- [TDEE Calculator](https://tdeecalculator.net/)
- [Macronutrientes por Objetivo](https://examine.com/guides/protein-intake/)
