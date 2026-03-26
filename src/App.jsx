import React from 'react';
import Auth from './components/Auth';
import Shop from './components/Shop';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { isAuthLoading, isAuthenticated } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? <Shop /> : <Auth />}
    </div>
  );
}

export default App;
