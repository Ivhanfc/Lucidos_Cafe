// src/shopping/components/cart/CartView.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import type { CartItem } from '../../types';

interface CartViewProps {
    cart: CartItem[];
    updateQuantity: (productId: string, delta: number) => void;
}

export function CartView({ cart, updateQuantity }: CartViewProps) {
    return (
        <motion.div
            key="cart"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
        >
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 pt-20">
                    <ShoppingBag size={60} className="mb-4 opacity-50" />
                    <p className="text-lg">Tu carrito está vacío</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                                key={item.product.id}
                                className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-[#e0d8b0]/50"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-800">{item.product.name}</p>
                                        <p className="text-sm text-[#00674f] font-semibold">${item.product.basePrice}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-[#f0ebd7] px-2 py-1 rounded-lg">
                                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.product.id, -1)} className="text-[#00674f]"><Minus size={16} /></motion.button>
                                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.product.id, 1)} className="text-[#00674f]"><Plus size={16} /></motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}
