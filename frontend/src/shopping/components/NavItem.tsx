// src/shopping/components/NavItem.tsx
import React from 'react';
import type { NavItemProps } from '../types';

export function NavItem({ icon, label, active, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 flex-1 py-1 ${active ? 'text-[#00674f] font-bold' : 'text-gray-400 hover:text-gray-600'}`}
        >
            {icon}
            <span className="text-[10px]">{label}</span>
        </button>
    );
}
