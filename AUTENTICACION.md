# 🔐 Sistema de Autenticación - FitMacros

## Descripción General

FitMacros incluye un sistema completo de autenticación con **Login** y **Registro**, que permite a los usuarios crear cuentas y acceder de forma segura a sus datos.

---

## 🎯 Flujo de Autenticación

```
┌──────────────────────────────────────────┐
│         Usuario Abre la App              │
└─────────────────┬────────────────────────┘
                  │
                  ▼
         ¿Tiene sesión activa?
                  │
        ┌─────────┴─────────┐
        │                   │
       SÍ                  NO
        │                   │
        ▼                   ▼
   DASHBOARD          PANTALLA LOGIN
                            │
                  ┌─────────┴─────────┐
                  │                   │
          Login Existente     Crear Cuenta Nueva
                  │                   │
                  ▼                   ▼
          [Email + Password]    ONBOARDING (4 pasos)
                  │                   │
                  └─────────┬─────────┘
                            │
                            ▼
                    ✅ AUTENTICADO
                            │
                            ▼
                       DASHBOARD
```

---

## 📝 Pantallas de Autenticación

### 1. **Pantalla de Login** (`Login.tsx`)

**Campos:**
- Email
- Contraseña

**Acciones:**
- **Iniciar Sesión**: Valida credenciales y autentica al usuario
- **Crear Cuenta Nueva**: Navega al proceso de registro

**Validaciones:**
- Email y contraseña son requeridos
- Verifica que el usuario exista
- Verifica que la contraseña sea correcta

**Mensajes de Error:**
- "Por favor completa todos los campos"
- "Email o contraseña incorrectos"

---

### 2. **Pantalla de Registro** (`Onboarding.tsx`)

**Proceso de 4 Pasos:**

**Paso 1 - Información Básica:**
- Email (único, no puede estar registrado)
- Nombre
- Contraseña (mínimo 6 caracteres)
- Género

**Paso 2 - Datos Físicos:**
- Edad
- Peso (kg)
- Altura (cm)

**Paso 3 - Nivel de Actividad:**
- Sedentario
- Ligero
- Moderado
- Activo
- Muy Activo

**Paso 4 - Objetivo:**
- Ganar Masa Muscular (Bulk)
- Perder Grasa (Cut)
- Recomposición
- Mantenimiento

**Acciones:**
- **¿Ya tienes cuenta? Inicia sesión aquí**: Vuelve a la pantalla de Login
- **Siguiente**: Avanza al siguiente paso
- **Atrás**: Retrocede al paso anterior
- **Comenzar**: Completa el registro y autentica al usuario

---

## 🔒 Almacenamiento de Datos

### LocalStorage (Implementación Actual)

Los datos se almacenan en el navegador usando `localStorage`:

**Claves de Almacenamiento:**
```typescript
{
  fitness_app_users: User[],           // Perfiles de usuario
  fitness_app_passwords: Credentials[], // Passwords hasheadas
  fitness_app_current_user: User,      // Usuario actual
  fitness_app_token: string,           // Token de sesión
  fitness_app_foods: Food[],           // Base de datos de alimentos
  fitness_app_daily_logs: DailyLog[]   // Registros diarios
}
```

**Estructura de Credenciales:**
```typescript
interface UserCredentials {
  email: string;
  passwordHash: string;
}
```

### Hashing de Contraseñas

**Implementación Actual (DEMO):**
```typescript
private hashPassword(password: string): string {
  return btoa(password + 'salt_fitmacros');
}
```

⚠️ **IMPORTANTE:** Esta es una implementación de **demostración**. 

**Para Producción, usa:**
- **bcrypt** en el backend
- **Nunca** almacenes passwords en el frontend
- Usa un salt aleatorio por usuario
- Mínimo 10 rounds de hashing

---

## 🔐 Tokens de Sesión

### Token Actual (Mock)

```typescript
const token = btoa(`${user.id}:${Date.now()}`);
```

Este es un token **simulado** para desarrollo.

### Para Producción: JWT (JSON Web Tokens)

**Backend (Node.js + Express):**
```javascript
const jwt = require('jsonwebtoken');

// Crear token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Verificar token
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) return res.status(401).json({ error: 'Token inválido' });
  req.userId = decoded.userId;
  next();
});
```

---

## 🔄 Context de Autenticación

**Archivo:** `src/app/context/AuthContext.tsx`

**Estado Global:**
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

**Funciones Disponibles:**
```typescript
const {
  user,              // Usuario actual o null
  token,             // Token de sesión o null
  isAuthenticated,   // Boolean
  login,             // (email, password) => Promise<void>
  register,          // (userData) => Promise<void>
  logout,            // () => void
  updateProfile      // (updates) => void
} = useAuth();
```

---

## 📱 Uso en Componentes

### Login
```typescript
import { useAuth } from '../context/AuthContext';

function LoginComponent() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login(email, password);
      // Usuario autenticado automáticamente
    } catch (error) {
      // Manejar error
    }
  };
}
```

### Registro
```typescript
import { useAuth } from '../context/AuthContext';

function RegisterComponent() {
  const { register } = useAuth();
  
  const handleRegister = async () => {
    try {
      await register({
        email,
        password,
        name,
        gender,
        age,
        weight,
        height,
        activityLevel,
        goal
      });
      // Usuario registrado y autenticado automáticamente
    } catch (error) {
      // Manejar error (ej: email ya registrado)
    }
  };
}
```

### Logout
```typescript
const { logout } = useAuth();

<button onClick={logout}>Cerrar Sesión</button>
```

### Verificar Autenticación
```typescript
const { isAuthenticated, user } = useAuth();

if (!isAuthenticated) {
  return <Login />;
}

return <Dashboard user={user} />;
```

---

## 🚀 Migración a Backend Real

### 1. Backend con Node.js + Express

**Instalar Dependencias:**
```bash
npm install express bcrypt jsonwebtoken dotenv
```

**Endpoint de Registro:**
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, gender, age, weight, height, activityLevel, goal } = req.body;

  try {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      email,
      passwordHash,
      name,
      gender,
      age,
      weight,
      height,
      activityLevel,
      goal
    });

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});
```

**Endpoint de Login:**
```javascript
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});
```

**Middleware de Autenticación:**
```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Usar en rutas protegidas
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});
```

---

## 🔒 Mejores Prácticas de Seguridad

### ✅ En Desarrollo (LocalStorage)

1. **Nunca uses datos reales** en LocalStorage
2. Solo para **prototipos y demos**
3. Los datos son **visibles** para cualquier persona con acceso al navegador

### ✅ En Producción (Backend)

1. **HTTPS Obligatorio**: Nunca transmitas credenciales sin HTTPS
2. **bcrypt para passwords**: Mínimo 10 rounds de hashing
3. **JWT con secret seguro**: Genera un secret aleatorio de al menos 256 bits
4. **Expiración de tokens**: No más de 7 días
5. **Refresh tokens**: Para renovar sesiones sin re-login
6. **Rate limiting**: Máximo 5 intentos de login por IP/email
7. **Validación de entrada**: Sanitizar todos los inputs
8. **CORS**: Configurar correctamente los orígenes permitidos
9. **Headers de seguridad**: helmet.js para Express
10. **Variables de entorno**: Nunca hardcodear secrets

### ⚠️ Vulnerabilidades Comunes a Evitar

- ❌ Passwords en texto plano
- ❌ Secrets en el código
- ❌ Tokens que no expiran
- ❌ Sin rate limiting (fuerza bruta)
- ❌ Sin validación de email
- ❌ SQL injection
- ❌ XSS (Cross-Site Scripting)

---

## 📊 Diagrama de Flujo Técnico

```
[Frontend]                    [Backend]                [Base de Datos]
    │                             │                          │
    │  POST /api/auth/register    │                          │
    ├────────────────────────────>│                          │
    │  { email, password, ... }   │                          │
    │                             │  Verificar email único   │
    │                             ├─────────────────────────>│
    │                             │<─────────────────────────│
    │                             │  Hash password (bcrypt)  │
    │                             │  Crear usuario           │
    │                             ├─────────────────────────>│
    │                             │<─────────────────────────│
    │                             │  Generar JWT             │
    │<────────────────────────────│                          │
    │  { user, token }            │                          │
    │                             │                          │
    │  Guardar token en estado    │                          │
    │                             │                          │
    │  GET /api/user/profile      │                          │
    │  Header: Bearer TOKEN       │                          │
    ├────────────────────────────>│                          │
    │                             │  Verificar JWT           │
    │                             │  Buscar usuario          │
    │                             ├─────────────────────────>│
    │                             │<─────────────────────────│
    │<────────────────────────────│                          │
    │  { user data }              │                          │
```

---

## 🎓 Recursos Adicionales

- [JWT.io](https://jwt.io/) - Debugger y documentación de JWT
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Biblioteca de hashing
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**¡Tu aplicación FitMacros ahora tiene un sistema completo de autenticación! 🔐**
