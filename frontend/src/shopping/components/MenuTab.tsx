// src/shopping/components/MenuTab.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../animations';
import { CATEGORIES, MOCK_PRODUCTS } from '../data';
import type { Product } from '../types';
import { ProductSection } from './ProductSection';

interface MenuTabProps {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    onAddToCart: (product: Product) => void;
}

export function MenuTab({ activeCategory, setActiveCategory, onAddToCart }: MenuTabProps) {
    const filteredProducts = activeCategory === 'Todos'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

    const groupedProducts = CATEGORIES.slice(1).reduce((acc, category) => {
        acc[category] = MOCK_PRODUCTS.filter(p => p.category === category);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <motion.div
            key="menu"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
        >
            <div className="px-4 py-4 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-3 border-b border-[#e0d8b0]/30 sticky top-0 bg-[#faf9f5] z-10">
                {CATEGORIES.map(category => (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category
                            ? 'bg-[#00674f] text-white shadow-md'
                            : 'bg-white border border-[#e0d8b0] text-gray-600 hover:bg-[#f0ebd7]'
                            }`}
                    >
                        {category}
                    </motion.button>
                ))}
            </div>

            <div className="pb-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeCategory === 'Todos' ? (
                            Object.entries(groupedProducts).map(([categoryName, products]) => (
                                <ProductSection
                                    key={categoryName}
                                    title={categoryName}
                                    products={products}
                                    onAddToCart={onAddToCart}
                                    onViewAll={() => setActiveCategory(categoryName)}
                                />
                            ))
                        ) : (
                            <ProductSection
                                title={activeCategory}
                                products={filteredProducts}
                                showViewAll={false}
                                onAddToCart={onAddToCart}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
