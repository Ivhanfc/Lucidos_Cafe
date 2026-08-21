// src/shopping/components/cart/SuccessView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export function SuccessView() {
    return (
        <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
        >
            <CheckCircle size={64} className="text-[#00674f] mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Gracias por tu compra!</h3>
            <p className="text-gray-500 text-sm">Estamos preparando tu pedido en barismo.</p>
        </motion.div>
    );
}
