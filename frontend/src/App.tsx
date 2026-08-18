import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const GOOGLE_AUTH_URL = `${BASE_URL}/auth/google`;


interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, icon, rightElement, ...props }) => (
  <div className="animate-fadeIn">
    <label className="block text-xs font-semibold text-[#a9a27c] uppercase tracking-wider mb-2">
      {label}
    </label>
    <div className="relative flex items-center">
      <div className="absolute left-3.5 text-[#a9a27c] pointer-events-none">
        {icon}
      </div>
      <input
        className="w-full pl-11 pr-11 py-3.5 bg-[#faf9f5] border-2 border-[#e0d8b0] rounded-xl text-gray-800 placeholder-[#c5bfa5] focus:border-[#00674f] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00674f]/10 transition-all duration-300"
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3.5">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

export default function AuthPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  // Manejo de estado de inputs más limpio
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await axios.post(`${BASE_URL}${endpoint}`, payload, {
        withCredentials: true,
      });

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      window.location.href = '/dashboard';
    } catch (error: unknown) {
      console.error('Error de autenticación:', error);

      if (axios.isAxiosError(error)) {
        setErrorMsg(error.response?.data?.error || 'Error al conectar con el servidor');
      } else {
        setErrorMsg('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <main className="min-h-screen bg-[#f0ebd7] flex items-center justify-center p-4 selection:bg-[#00674f] selection:text-white">
      <section className="w-full max-w-[420px] bg-white rounded-2xl p-8 sm:p-12 shadow-[0_20px_40px_-10px_rgba(169,162,124,0.4)] border border-[#e0d8b0] transition-all duration-500">

        <header className="flex flex-col items-center mb-8">
          <div className="relative mb-3 group">

            <img
              className="w-32 h-32 md:w-[140px] md:h-[140px] rounded-full object-cover shadow-[0_8px_20px_rgba(169,162,124,0.3)] border-2 border-[#f0ebd7] p-1 bg-white transition-transform duration-300 group-hover:scale-105"
              src="/Lucidos_Logo.png"
              alt="Logo de Lúcidos Café"
            />
          </div>
          <h1 className="text-[#00674f] text-lg mt-1 font-bold tracking-wide transition-all">
            {isLogin ? 'Portal de acceso' : 'Registro de usuario'}
          </h1>
        </header>

        {errorMsg && (
          <div role="alert" className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center flex items-center justify-center gap-2 animate-pulse">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <CustomInput
              label="Usuario"
              name="username"
              type="text"
              placeholder="Nombre de usuario"
              icon={<User size={20} />}
              value={formData.username}
              onChange={handleInputChange}
              required={!isLogin}
            />
          )}

          <CustomInput
            label="Correo"
            name="email"
            type="email"
            placeholder="email@example.com"
            icon={<Mail size={20} />}
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <CustomInput
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock size={20} />}
            value={formData.password}
            onChange={handleInputChange}
            required
            rightElement={
              <button
                type="button"
                onClick={toggleShowPassword}
                className="text-[#a9a27c] hover:text-[#00674f] transition-colors focus:outline-none rounded-full p-1 focus:ring-2 focus:ring-[#00674f]/20"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          {isLogin && (
            <div className="text-right -mt-2">
              <a href="#" className="text-xs text-[#00674f] font-semibold hover:underline transition-all">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}

          <a
            href={GOOGLE_AUTH_URL}
            className="w-full border-2 border-[#e0d8b0] bg-white hover:bg-[#faf9f5] text-gray-700 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#e0d8b0]/50"
          >
            <img src="https://authjs.dev/img/providers/google.svg" alt="Google" width="20" height="20" />
            Iniciar sesión con Google
          </a>

          {/* 3. Botón con estado de carga (Spinner) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00674f] hover:bg-[#00523f] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00674f]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <footer className="mt-8 text-center text-sm text-[#a9a27c]">
          {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-[#00674f] font-bold hover:underline bg-transparent border-none cursor-pointer focus:outline-none rounded px-1 focus:ring-2 focus:ring-[#00674f]/20 transition-all"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </footer>
      </section>
    </main>
  );
}