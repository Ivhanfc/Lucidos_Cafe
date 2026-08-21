// src/shopping/components/BottomNav.tsx
import React from 'react';
import { Home, Coffee, MapPin, Gift } from 'lucide-react';
import { NavItem } from './NavItem';
import type { TabKey } from '../types';

interface BottomNavProps {
    activeTab: TabKey;
    setActiveTab: (tab: TabKey) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
    return (
        <nav className="flex-none w-full bg-white border-t border-[#e0d8b0] flex justify-around items-center py-2 pb-safe px-2 z-20">
            <NavItem icon={<Home size={22} />} label="Inicio" active={activeTab === 'Inicio'} onClick={() => setActiveTab('Inicio')} />
            <NavItem icon={<Coffee size={22} />} label="Menú" active={activeTab === 'Menú'} onClick={() => setActiveTab('Menú')} />
            <NavItem icon={<MapPin size={22} />} label="Tiendas" active={activeTab === 'Tiendas'} onClick={() => setActiveTab('Tiendas')} />
            <NavItem icon={<Gift size={22} />} label="Recompensas" active={activeTab === 'Recompensas'} onClick={() => setActiveTab('Recompensas')} />
        </nav>
    );
}
