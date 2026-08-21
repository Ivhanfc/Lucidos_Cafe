// src/shopping/components/AppHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';

export function AppHeader() {
    return (
        <header className="flex-none px-4 py-3 flex items-center justify-between bg-white border-b border-[#e0d8b0]/50 z-20">
            <div className="flex items-center gap-2">
                <img src="/Lucidos_Logo.png" alt="Lúcidos" className="w-10 h-10 object-contain rounded-full bg-[#f0ebd7]" />
                <span className="font-bold text-[#00674f] text-lg">Lúcido's Café</span>
            </div>
            <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-full bg-[#f0ebd7] text-[#00674f] hover:bg-[#e0d8b0] transition-colors">
                    <User size={20} />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-full bg-[#f0ebd7] text-[#00674f] hover:bg-[#e0d8b0] transition-colors">
                    <Settings size={20} />
                </motion.button>
            </div>
        </header>
    );
}
