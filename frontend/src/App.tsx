import { useState } from 'react';
import { Coffee, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', { email, password });
  };

  return (
    <div className="min-h-screen bg-[#f0ebd7] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 sm:p-12 shadow-[0_20px_40px_-10px_rgba(169,162,124,0.4)] border border-[#e0d8b0]">

        {/* Encabezado */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#00674f] text-white flex items-center justify-center rounded-2xl mb-4 -rotate-6 hover:rotate-6 transition-transform duration-300">
            <Coffee size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-[#00674f] text-3xl font-extrabold tracking-tight">Lúcidos Café</h1>
          <p className="text-[#a9a27c] text-sm mt-1">Portal de acceso</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#a9a27c] uppercase tracking-wider mb-2" htmlFor="email">
              Usuario / Correo
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-[#a9a27c] pointer-events-none" size={20} />
              <input
                id="email"
                type="email"
                placeholder="email@example"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#faf9f5] border-2 border-[#e0d8b0] rounded-xl text-gray-800 placeholder-[#c5bfa5] focus:border-[#00674f] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00674f]/10 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a9a27c] uppercase tracking-wider mb-2" htmlFor="password">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-[#a9a27c] pointer-events-none" size={20} />
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#a9a27c] hover:text-[#00674f] transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right -mt-2">
            <a href="#" className="text-xs text-[#00674f] font-semibold hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00674f] hover:bg-[#00523f] active:translate-y-0 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00674f]/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            Entrar a la tienda
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}