import React, { useState } from 'react';
import { Coffee, Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// URLs apuntando al grupo /auth del backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const GOOGLE_AUTH_URL = `${BASE_URL}/auth/google`;
const LOGIN_API_URL = `${BASE_URL}/auth/login`;

export default function App() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(
        LOGIN_API_URL,
        { email, username, password },
        { withCredentials: true }
      );

      console.log('Respuesta del servidor:', response.data);

      // Si el backend te devuelve un token
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      // Redirigir al Dashboard tras login exitoso
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      // Ajuste para leer .error enviado por Gin
      setErrorMsg(
        error.response?.data?.error || 'Error al conectar con el servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0ebd7] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 sm:p-12 shadow-[0_20px_40px_-10px_rgba(169,162,124,0.4)] border border-[#e0d8b0]">
        {/* logo and title */}
        <header className="flex flex-col items-center mb-8">
          <img
            className="w-50 h-50 mb-2 rounded-full"
            src="/Lucidos_Logo.png"
            alt="Lucidos Cafe Logo"
          />
          <p className="text-[#a9a27c] text-sm mt-1">Portal de acceso</p>
        </header>

        {errorMsg && (
          <div role="alert" className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-[#a9a27c] uppercase tracking-wider mb-2"
            >
              Usuario
            </label>
            <div className="relative flex items-center">
              <User
                className="absolute left-3.5 text-[#a9a27c] pointer-events-none"
                size={20}
              />
              <input
                id="username"
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#faf9f5] border-2 border-[#e0d8b0] rounded-xl text-gray-800 placeholder-[#c5bfa5] focus:border-[#00674f] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00674f]/10 transition-all duration-300"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#a9a27c] uppercase tracking-wider mb-2"
            >
              Correo
            </label>
            <div className="relative flex items-center">
              <Mail
                className="absolute left-3.5 text-[#a9a27c] pointer-events-none"
                size={20}
              />
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#faf9f5] border-2 border-[#e0d8b0] rounded-xl text-gray-800 placeholder-[#c5bfa5] focus:border-[#00674f] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00674f]/10 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#a9a27c] uppercase tracking-wider mb-2"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <Lock
                className="absolute left-3.5 text-[#a9a27c] pointer-events-none"
                size={20}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 bg-[#faf9f5] border-2 border-[#e0d8b0] rounded-xl text-gray-800 placeholder-[#c5bfa5] focus:border-[#00674f] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00674f]/10 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3.5 text-[#a9a27c] hover:text-[#00674f] transition-colors"
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right -mt-2">
            <a
              href="#"
              className="text-xs text-[#00674f] font-semibold hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <a
            href={GOOGLE_AUTH_URL}
            className="w-full border-2 border-[#e0d8b0] bg-white hover:bg-[#faf9f5] text-gray-700 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
          >
            <img
              src="https://authjs.dev/img/providers/google.svg"
              alt="Google logo"
              width="20"
              height="20"
            />
            Iniciar sesión con Google
          </a>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00674f] hover:bg-[#00523f] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00674f]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            <ArrowRight size={20} />
          </button>
        </form>

        {
          <div className="mt-8 text-center text-sm - text[#a9a27c]">
            ¿No tienes cuenta?{' '}
            <a
              href="/register"
              className="text-[#00674f] font-bold hover:underline"
            >
              Regístrate aquí
            </a>
          </div>
        }
      </div>
    </div>
  );
}