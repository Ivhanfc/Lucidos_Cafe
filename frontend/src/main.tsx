// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx'; // Se importa el componente principal de rutas

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);