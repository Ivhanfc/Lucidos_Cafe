import React, { useState } from 'react';
import { User, ShoppingBag, Settings, Home, Coffee, MapPin, Gift, ChevronRight, Star } from 'lucide-react';

// --- 1. Tipos e Interfaces ---
interface Product {
    id: string;
    name: string;
    basePrice: number;
    category: string;
    imageUrl: string;
}

// --- 2. Mock Data ---
const CATEGORIES = ['Todos', 'Clásicos', 'Té & Matcha', 'Especialidades'];

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Espresso', basePrice: 30, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80' },
    // Imagen corregida para el Cortado
    { id: '2', name: 'Cortado', basePrice: 45, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80' },
    { id: '3', name: 'Americano', basePrice: 50, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=300&q=80' },
    { id: '4', name: 'Cappuccino', basePrice: 60, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&q=80' },
    { id: '5', name: 'Latte', basePrice: 70, category: 'Clásicos', imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&q=80' },
    { id: '6', name: 'Chai', basePrice: 80, category: 'Té & Matcha', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&q=80' },
    // Imagen corregida para el Matcha
    { id: '7', name: 'Matcha', basePrice: 120, category: 'Té & Matcha', imageUrl: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=300&q=80' },
    { id: '8', name: 'Bebida de temporada', basePrice: 120, category: 'Especialidades', imageUrl: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=300&q=80' },
    { id: '9', name: 'Tónicos', basePrice: 120, category: 'Especialidades', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80' },
];

export default function ShoppingPage() {
    const [activeTab, setActiveTab] = useState('Menú');
    const [activeCategory, setActiveCategory] = useState('Todos');

    // Filtrado de productos para la pestaña Menú
    const filteredProducts = activeCategory === 'Todos'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

    const groupedProducts = CATEGORIES.slice(1).reduce((acc, category) => {
        acc[category] = MOCK_PRODUCTS.filter(p => p.category === category);
        return acc;
    }, {} as Record<string, Product[]>);

    // --- Renderizado Condicional de las Vistas ---
    const renderContent = () => {
        switch (activeTab) {
            case 'Inicio':
                return (
                    <div className="p-6 space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[#00674f]">Hola, Jesús Eduardo</h1>
                            <p className="text-gray-500 text-sm mt-1">¿Qué vamos a preparar para ti hoy?</p>
                        </div>
                        <div className="bg-[#00674f] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-sm opacity-90 mb-1">Tu nivel actual</p>
                                <h2 className="text-xl font-bold mb-3">Cliente Frecuente</h2>
                                <div className="flex items-center gap-2">
                                    <Star className="text-yellow-400 fill-current" size={20} />
                                    <span className="font-semibold">320 Puntos</span>
                                </div>
                            </div>
                            {/* Decoración del banner */}
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3">Pedidos Recientes</h3>
                            <div className="bg-white border border-[#e0d8b0] rounded-xl p-4 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#f0ebd7] p-3 rounded-lg">
                                        <Coffee className="text-[#00674f]" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Latte con Leche de Avena</p>
                                        <p className="text-xs text-gray-500">Ayer, 09:30 AM</p>
                                    </div>
                                </div>
                                <button className="text-[#00674f] text-xs font-bold bg-[#f0ebd7] px-3 py-1.5 rounded-full hover:bg-[#e0d8b0]">
                                    Repetir
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'Tiendas':
                return (
                    <div className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-4">Nuestras Sucursales</h2>

                        {/* Sucursal 1 */}
                        <div className="bg-white border border-[#e0d8b0] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[#00674f]">Lúcidos Café - Zona Río</h3>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">Abierto</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">Paseo de los Héroes, Zona Urbana Río Tijuana, Tijuana, B.C.</p>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-[#f0ebd7] text-[#00674f] text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1">
                                    <MapPin size={14} /> Cómo llegar
                                </button>
                            </div>
                        </div>

                        {/* Sucursal 2 */}
                        <div className="bg-white border border-[#e0d8b0] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[#00674f]">Lúcidos Café - Playas</h3>
                                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">Cerrado</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">Paseo Ensenada, Playas de Tijuana, Tijuana, B.C.</p>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-[#f0ebd7] text-[#00674f] text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1">
                                    <MapPin size={14} /> Cómo llegar
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'Recompensas':
                return (
                    <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                        <div className="w-24 h-24 bg-[#f0ebd7] rounded-full flex items-center justify-center mb-4">
                            <Gift size={40} className="text-[#00674f]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Programa de Lealtad</h2>
                        <p className="text-gray-500 text-sm mb-6">Acumula sellos en cada compra y canjéalos por bebidas y extras gratis.</p>

                        {/* Tarjeta de sellos simulada */}
                        <div className="bg-white border-2 border-[#00674f] rounded-xl w-full p-6 shadow-md">
                            <h3 className="font-bold text-[#00674f] mb-4 text-left">Tu próxima bebida gratis</h3>
                            <div className="grid grid-cols-5 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((stamp) => (
                                    <div key={stamp} className={`aspect-square rounded-full flex items-center justify-center border-2 ${stamp <= 3 ? 'bg-[#00674f] border-[#00674f]' : 'border-[#e0d8b0] bg-gray-50'}`}>
                                        {stamp <= 3 ? <Star size={16} className="text-white fill-current" /> : null}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-left">Faltan 7 compras para tu premio.</p>
                        </div>
                    </div>
                );

            case 'Menú':
            default:
                return (
                    <>
                        {/* --- Categorías (Pills) --- */}
                        <div className="px-4 py-4 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-3 border-b border-[#e0d8b0]/30 sticky top-0 bg-[#faf9f5] z-10">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category
                                            ? 'bg-[#00674f] text-white shadow-md'
                                            : 'bg-white border border-[#e0d8b0] text-gray-600 hover:bg-[#f0ebd7]'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* --- Listado de Productos --- */}
                        <div className="pb-6">
                            {activeCategory === 'Todos' ? (
                                Object.entries(groupedProducts).map(([categoryName, products]) => (
                                    <ProductSection key={categoryName} title={categoryName} products={products} />
                                ))
                            ) : (
                                <ProductSection title={activeCategory} products={filteredProducts} showViewAll={false} />
                            )}
                        </div>
                    </>
                );
        }
    };

    return (
        // Se usa h-[100dvh] para evitar problemas de scroll en móviles iOS/Android
        <div className="h-[100dvh] bg-gray-100 flex justify-center font-sans overflow-hidden">

            {/* Contenedor tipo móvil con Flexbox para mantener el footer estático */}
            <div className="w-full max-w-[480px] bg-[#faf9f5] shadow-2xl relative flex flex-col">

                {/* --- Header (Siempre visible) --- */}
                <header className="flex-none px-4 py-3 flex items-center justify-between bg-white border-b border-[#e0d8b0]/50 z-20">
                    <div className="flex items-center gap-2">
                        <img src="/Lucidos_Logo.png" alt="Lúcidos" className="w-10 h-10 object-contain rounded-full" />
                        <span className="font-bold text-[#00674f] text-lg">Lúcidos Café</span>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 rounded-full bg-[#f0ebd7] text-[#00674f] hover:bg-[#e0d8b0] transition-colors focus:outline-none">
                            <User size={20} />
                        </button>
                        <button className="p-2 rounded-full bg-[#f0ebd7] text-[#00674f] hover:bg-[#e0d8b0] transition-colors focus:outline-none">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                {/* --- Main Content (El único que hace scroll) --- */}
                <main className="flex-1 overflow-y-auto hide-scrollbar relative">
                    {renderContent()}
                </main>

                {/* --- Botón Flotante (FAB) de Carrito idéntico a la imagen --- */}
                {/* Se posiciona absolute dentro del contenedor general, justo arriba del NavBar */}
                <button
                    className="absolute bottom-20 right-6 bg-[#00674f] text-white p-4 rounded-full shadow-[0_8px_16px_rgba(0,103,79,0.3)] hover:scale-105 transition-transform z-30 focus:outline-none focus:ring-4 focus:ring-[#00674f]/30"
                    aria-label="Ver carrito"
                >
                    <ShoppingBag size={26} strokeWidth={2} />
                </button>

                {/* --- Bottom Navigation (Siempre anclado abajo gracias al flex-col) --- */}
                <nav className="flex-none w-full bg-white border-t border-[#e0d8b0] flex justify-around items-center py-2 pb-safe px-2 z-20">
                    <NavItem icon={<Home size={22} />} label="Inicio" active={activeTab === 'Inicio'} onClick={() => setActiveTab('Inicio')} />
                    <NavItem icon={<Coffee size={22} />} label="Menú" active={activeTab === 'Menú'} onClick={() => setActiveTab('Menú')} />
                    <NavItem icon={<MapPin size={22} />} label="Tiendas" active={activeTab === 'Tiendas'} onClick={() => setActiveTab('Tiendas')} />
                    <NavItem icon={<Gift size={22} />} label="Recompensas" active={activeTab === 'Recompensas'} onClick={() => setActiveTab('Recompensas')} />
                </nav>

            </div>
        </div>
    );
}

// --- Componentes Auxiliares ---

function ProductSection({ title, products, showViewAll = true }: { title: string, products: Product[], showViewAll?: boolean }) {
    if (products.length === 0) return null;

    return (
        <section className="py-5 border-b border-[#e0d8b0]/30 last:border-0 bg-[#faf9f5]">
            <div className="flex justify-between items-end px-5 mb-4">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
                {showViewAll && (
                    <button className="text-[#00674f] text-sm font-semibold hover:underline">
                        Ver todo {products.length}
                    </button>
                )}
            </div>

            <div className="flex overflow-x-auto gap-4 px-5 pb-4 snap-x hide-scrollbar">
                {products.map(product => (
                    <div key={product.id} className="snap-center flex-shrink-0 w-32 flex flex-col items-center">
                        <div className="w-28 h-28 rounded-full border-[4px] border-[#00674f] shadow-md overflow-hidden mb-3 bg-white">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 text-center leading-tight">{product.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Desde ${product.basePrice}</p>
                        <button className="mt-2 text-[#00674f] text-xs font-semibold flex items-center gap-1 hover:bg-[#f0ebd7] px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#e0d8b0]">
                            <Settings size={12} />
                            Personalizar
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center p-2 min-w-[70px] transition-colors focus:outline-none ${active ? 'text-[#00674f]' : 'text-gray-400 hover:text-[#a9a27c]'}`}
        >
            <div className={`transition-all duration-300 ${active ? 'bg-[#f0ebd7] p-1.5 rounded-xl scale-110' : 'p-1.5 scale-100'}`}>
                {icon}
            </div>
            <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${active ? 'font-bold' : ''}`}>{label}</span>
        </button>
    );
}