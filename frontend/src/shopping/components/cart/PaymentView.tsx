// src/shopping/components/cart/PaymentView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Plus } from 'lucide-react';
import type { SavedCard } from '../../types';

interface PaymentViewProps {
    savedCards: SavedCard[];
    onAddCard: () => void;
}

export function PaymentView({ savedCards, onAddCard }: PaymentViewProps) {
    return (
        <motion.div
            key="payment"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
        >
            <p className="text-sm font-semibold text-gray-600 mb-2">Tarjetas Guardadas</p>
            {savedCards.map((card, i) => (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={card.id}
                    className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-[#00674f] shadow-sm cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-[#f0ebd7] p-2 rounded-lg text-[#00674f]">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{card.brand} terminada en {card.last4}</p>
                            <p className="text-xs text-gray-500">{card.name}</p>
                        </div>
                    </div>
                    <CheckCircle size={24} className="text-[#00674f]" />
                </motion.div>
            ))}

            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onAddCard}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#00674f]/50 rounded-xl text-[#00674f] font-semibold hover:bg-[#f0ebd7] transition-colors mt-4"
            >
                <Plus size={20} /> Agregar Nueva Tarjeta
            </motion.button>
        </motion.div>
    );
}
