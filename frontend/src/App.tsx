// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './LoginPage';
import ShoppingPage from './shopping/ShoppingPage';

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f0ebd7]">Cargando...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicOnlyRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f0ebd7]">Cargando...</div>;
  return !user ? <Outlet /> : <Navigate to="/shopping" replace />;
};

export default function App() {
  return (
    <BrowserRouter> {/* 1. BrowserRouter primero */}
      <AuthProvider> {/* 2. AuthProvider dentro */}
        <Routes>
          <Route element={<PublicOnlyRoutes />}>
            <Route path="/login" element={<AuthPage />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/dashboard" element={<ShoppingPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/shopping" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}