// src/shopping/components/ProductSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { ProductSectionProps } from '../types';

export function ProductSection({ title, products, showViewAll = true, onAddToCart, onViewAll }: ProductSectionProps) {
    return (
        <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[#00674f] text-lg">{title}</h3>
                {showViewAll && (
                    <button onClick={onViewAll} className="text-xs font-semibold text-gray-500 hover:text-[#00674f]">
                        Ver todos
                    </button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-3">
                {products.map(product => (
                    <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-[#e0d8b0]/60 rounded-2xl p-3 flex flex-col justify-between shadow-sm"
                    >
                        <img src={product.imageUrl} alt={product.name} className="w-full h-28 object-cover rounded-xl mb-2" />
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-[#00674f] text-sm">${product.basePrice}</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onAddToCart(product)}
                                className="bg-[#00674f] text-white p-2 rounded-xl shadow-md hover:bg-[#00523e]"
                            >
                                <Plus size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
