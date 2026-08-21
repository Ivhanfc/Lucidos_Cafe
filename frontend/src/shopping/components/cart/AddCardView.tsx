// src/shopping/components/cart/AddCardView.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AddCardViewProps {
    onSave: () => void;
}

export function AddCardView({ onSave }: AddCardViewProps) {
    return (
        <motion.div
            key="addCard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
        >
            <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Número de Tarjeta</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00674f]" />
            </div>
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Expiración</label>
                    <input type="text" placeholder="MM/AA" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00674f]" />
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">CVC</label>
                    <input type="text" placeholder="123" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00674f]" />
                </div>
            </div>
            <button
                onClick={onSave}
                className="w-full bg-[#00674f] text-white font-bold py-3 rounded-xl mt-2"
            >
                Guardar Tarjeta
            </button>
        </motion.div>
    );
}
