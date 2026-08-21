// src/shopping/types.ts
import React from 'react';

export interface Product {
    id: string;
    name: string;
    basePrice: number;
    category: string;
    imageUrl: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface SavedCard {
    id: string;
    last4: string;
    brand: string;
    name: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    streak_days: number;
    loyalty_points: number;
}

export interface ProductSectionProps {
    title: string;
    products: Product[];
    showViewAll?: boolean;
    onAddToCart: (product: Product) => void;
    onViewAll?: () => void;
}

export type CheckoutStep = 'cart' | 'payment' | 'addCard' | 'success';

export type TabKey = 'Inicio' | 'Menú' | 'Tiendas' | 'Recompensas';

export interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}
