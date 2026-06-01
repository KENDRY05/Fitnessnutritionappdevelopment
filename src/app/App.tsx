/**
 * FitMacros - Aplicación de Fitness y Nutrición
 * Conteo de macros y seguimiento de objetivos
 */

import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { AddFood } from './components/AddFood';

type Screen = 'dashboard' | 'addFood';
type AuthScreen = 'login' | 'register';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  if (!isAuthenticated) {
    return authScreen === 'login' ? (
      <Login onSwitchToRegister={() => setAuthScreen('register')} />
    ) : (
      <Onboarding onSwitchToLogin={() => setAuthScreen('login')} />
    );
  }

  return (
    <>
      {currentScreen === 'dashboard' && (
        <Dashboard onAddFood={() => setCurrentScreen('addFood')} />
      )}
      {currentScreen === 'addFood' && (
        <AddFood
          onBack={() => setCurrentScreen('dashboard')}
          onFoodAdded={() => setCurrentScreen('dashboard')}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}