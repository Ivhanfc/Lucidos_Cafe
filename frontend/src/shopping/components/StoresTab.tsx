// src/shopping/components/StoresTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { pageVariants } from '../animations';
import { STORES } from '../data';

export function StoresTab() {
    return (
        <motion.div
            key="tiendas"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="p-6 space-y-4"
        >
            <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-4">Nuestras Sucursales</h2>

            {STORES.map((store, index) => (
                <motion.div
                    key={store.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-[#e0d8b0] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-[#00674f]">{store.name}</h3>
                        <span className={`${store.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-[10px] font-bold px-2 py-1 rounded-full`}>{store.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{store.address}</p>
                    <div className="flex gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-[#f0ebd7] text-[#00674f] text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1"
                        >
                            <MapPin size={14} /> Cómo llegar
                        </motion.button>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
