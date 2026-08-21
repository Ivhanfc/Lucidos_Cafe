// src/shopping/components/RewardsTab.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Flame } from 'lucide-react';
import { pageVariants } from '../animations';
import type { UserProfile } from '../types';

export function RewardsTab() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(async (res) => {
                const contentType = res.headers.get("content-type");
                if (res.ok && contentType?.includes("application/json")) {
                    const data = await res.json();
                    setUser(data.user);
                }
            })
            .catch((err) => console.error('Error al cargar datos de lealtad:', err))
            .finally(() => setLoading(false));
    }, []);

    // Calculamos sellos basados en el usuario (máximo 10 por ciclo)
    const streakDays = user?.streak_days ?? 0;
    const currentStamps = streakDays % 10; 
    const stampsNeeded = 10 - currentStamps;

    return (
        <motion.div
            key="recompensas"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="p-6 flex flex-col items-center justify-center text-center h-full space-y-4"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 bg-[#f0ebd7] rounded-full flex items-center justify-center"
            >
                <Gift size={36} className="text-[#00674f]" />
            </motion.div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800">Programa de Lealtad</h2>
                <p className="text-gray-500 text-xs mt-1">Acumula rachas de visita diaria y canjéalas por recompensas.</p>
            </div>

            {/* Tarjeta de Racha Actual */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-[#00674f] text-white p-4 rounded-xl flex items-center justify-between shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-lg">
                        <Flame className="text-orange-400 fill-current" size={24} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-white/80">Racha de Visitas</p>
                        <p className="text-lg font-bold">
                            {loading ? '...' : `${streakDays} ${streakDays === 1 ? 'Día' : 'Días'}`}
                        </p>
                    </div>
                </div>
                <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-medium">
                    🔥 ¡Sigue así!
                </span>
            </motion.div>

            {/* Tarjeta de Sellos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border-2 border-[#00674f] rounded-xl w-full p-5 shadow-md"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[#00674f] text-sm">Tu próxima bebida gratis</h3>
                    <span className="text-xs font-semibold text-gray-500">{currentStamps}/10 sellos</span>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((stampNumber) => {
                        const isStamped = stampNumber <= currentStamps;
                        return (
                            <motion.div
                                key={stampNumber}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.15 + (stampNumber * 0.03) }}
                                className={`aspect-square rounded-full flex items-center justify-center border-2 transition-colors ${
                                    isStamped 
                                        ? 'bg-[#00674f] border-[#00674f]' 
                                        : 'border-[#e0d8b0] bg-gray-50'
                                }`}
                            >
                                {isStamped && <Star size={14} className="text-yellow-400 fill-current" />}
                            </motion.div>
                        );
                    })}
                </div>

                <p className="text-xs text-gray-500 mt-4 text-left">
                    {loading 
                        ? 'Cargando tu progreso...' 
                        : currentStamps === 0 && streakDays > 0 && streakDays % 10 === 0
                            ? '🎉 ¡Tienes una bebida gratis lista para reclamar!'
                            : `Faltan ${stampsNeeded} ${stampsNeeded === 1 ? 'día' : 'días'} de racha para tu premio.`
                    }
                </p>
            </motion.div>
        </motion.div>
    );
}