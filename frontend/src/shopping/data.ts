// src/shopping/data.ts
import type { Product } from './types';

export const CATEGORIES = ['Todos', 'Clásicos', 'Té & Matcha', 'Especialidades'];

export const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Espresso', basePrice: 30, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80' },
    { id: '2', name: 'Cortado', basePrice: 45, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80' },
    { id: '3', name: 'Americano', basePrice: 50, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=300&q=80' },
    { id: '4', name: 'Cappuccino', basePrice: 60, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&q=80' },
    { id: '5', name: 'Latte', basePrice: 70, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&q=80' },
    { id: '6', name: 'Chai', basePrice: 80, category: 'Té & Matcha', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&q=80' },
    { id: '7', name: 'Matcha', basePrice: 120, category: 'Té & Matcha', imageUrl: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=300&q=80' },
    { id: '8', name: 'Bebida de temporada', basePrice: 120, category: 'Especialidades', imageUrl: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=300&q=80' },
    { id: '9', name: 'Tónicos', basePrice: 120, category: 'Especialidades', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80' },
];

export const STORES = [
    { name: 'Lúcidos Café - Zona Río', status: 'Abierto', address: 'Paseo de los Héroes, Zona Urbana Río Tijuana, Tijuana, B.C.', open: true },
    { name: 'Lúcidos Café - Playas', status: 'Cerrado', address: 'Paseo Ensenada, Playas de Tijuana, Tijuana, B.C.', open: false },
    { name: 'Lúcidos Café - Cesun Universidad', status: 'Abierto', address: 'Plantel CESUN Universidad, Tijuana, B.C.', open: true },
];
