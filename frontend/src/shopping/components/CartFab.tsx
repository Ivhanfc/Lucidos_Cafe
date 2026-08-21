// src/shopping/components/CartFab.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface CartFabProps {
    totalItems: number;
    onClick: () => void;
}

export function CartFab({ totalItems, onClick }: CartFabProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="absolute bottom-20 right-6 bg-[#00674f] text-white p-4 rounded-full shadow-[0_8px_16px_rgba(0,103,79,0.3)] z-30 focus:outline-none"
            aria-label="Ver carrito"
        >
            <ShoppingBag size={26} strokeWidth={2} />
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#faf9f5]"
                    >
                        <motion.span
                            key={totalItems}
                            initial={{ scale: 0.1, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 450, damping: 20 }}
                        >
                            {totalItems}
                        </motion.span>
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
