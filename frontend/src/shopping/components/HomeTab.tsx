// src/shopping/components/HomeTab.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Coffee } from 'lucide-react';
import { pageVariants } from '../animations';
import type { UserProfile } from '../types';

export function HomeTab() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

 useEffect(() => {
    fetch('http://localhost:8080/auth/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para enviar cookies/sesiones al puerto 8080
    })
        .then(async (res) => {
            const contentType = res.headers.get("content-type");

            if (res.ok && contentType && contentType.includes("application/json")) {
                const data = await res.json();
                setUser(data.user);
            } else {
                const errorText = await res.text();
                console.warn(`Servidor (8080) devolvió ${res.status}:`, errorText);
            }
        })
        .catch((err) => console.error('Red error connection to server (8080):', err))
        .finally(() => setLoadingUser(false));
}, []);
    return (
        <motion.div
            key="inicio"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="p-6 space-y-6"
        >
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="text-2xl font-bold text-[#00674f]">
                    Hola, {loadingUser ? 'Cargando...' : user?.name || 'Cliente'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">¿Qué vamos a preparar para ti hoy?</p>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#00674f] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
            >
                <div className="relative z-10">
                    <p className="text-sm opacity-90 mb-1">Tu nivel actual</p>
                    <h2 className="text-xl font-bold mb-3">Cliente Frecuente</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Star className="text-yellow-400 fill-current" size={20} />
                            <span className="font-semibold">{user?.loyalty_points ?? 0} Puntos</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
                            <span className="text-xs">🔥</span>
                            <span className="font-semibold text-xs">{user?.streak_days ?? 0} Días racha</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </motion.div>

            <div>
                <h3 className="font-bold text-gray-800 mb-3">Pedidos Recientes</h3>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-[#e0d8b0] rounded-xl p-4 flex items-center justify-between shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-[#f0ebd7] p-3 rounded-lg">
                            <Coffee className="text-[#00674f]" size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Latte con Leche de Avena</p>
                            <p className="text-xs text-gray-500">Ayer, 09:30 AM</p>
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="text-[#00674f] text-xs font-bold bg-[#f0ebd7] px-3 py-1.5 rounded-full hover:bg-[#e0d8b0]"
                    >
                        Repetir
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}