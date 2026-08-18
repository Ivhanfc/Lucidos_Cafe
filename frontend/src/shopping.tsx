import React, { useState } from 'react';
import {
    User, ShoppingBag, Settings, Home, Coffee, MapPin, Gift, Star,
    X, Plus, Minus, Trash2, CreditCard, CheckCircle
} from 'lucide-react';


interface Product {
    id: string;
    name: string;
    basePrice: number;
    category: string;
    imageUrl: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface SavedCard {
    id: string;
    last4: string;
    brand: string;
    name: string;
}

const CATEGORIES = ['Todos', 'Clásicos', 'Té & Matcha', 'Especialidades'];

const MOCK_PRODUCTS: Product[] = [
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

export default function ShoppingPage() {
    const [activeTab, setActiveTab] = useState('Menú');
    const [activeCategory, setActiveCategory] = useState('Todos');

    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'addCard' | 'success'>('cart');
    const [savedCards, setSavedCards] = useState<SavedCard[]>([
        { id: 'c1', last4: '4242', brand: 'Visa', name: 'Jesús Eduardo' }
    ]);

    // Cart functions
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handlePayment = () => {
        setCheckoutStep('success');
        setTimeout(() => {
            setCart([]);
            setIsCartOpen(false);
            setCheckoutStep('cart');
        }, 3000); // Modal closes after 3 secs
    };

    // Filter products for the Menu tab
    const filteredProducts = activeCategory === 'Todos'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

    const groupedProducts = CATEGORIES.slice(1).reduce((acc, category) => {
        acc[category] = MOCK_PRODUCTS.filter(p => p.category === category);
        return acc;
    }, {} as Record<string, Product[]>);

    // Conditional render
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

                        {/* Branch 1 */}
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

                        {/* Branch 2 */}
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

                        {/* Branch 3 (Added: Cesun Universidad) */}
                        <div className="bg-white border border-[#e0d8b0] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[#00674f]">Lúcidos Café - Cesun Universidad</h3>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">Abierto</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">Plantel CESUN Universidad, Tijuana, B.C.</p>
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
                        {/* --- Categories --- */}
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

                        {/* --- Product list --- */}
                        <div className="pb-6">
                            {activeCategory === 'Todos' ? (
                                Object.entries(groupedProducts).map(([categoryName, products]) => (
                                    <ProductSection
                                        key={categoryName}
                                        title={categoryName}
                                        products={products}
                                        onAddToCart={addToCart}
                                        onViewAll={() => setActiveCategory(categoryName)} // Added functionality to filter
                                    />
                                ))
                            ) : (
                                <ProductSection
                                    title={activeCategory}
                                    products={filteredProducts}
                                    showViewAll={false}
                                    onAddToCart={addToCart}
                                />
                            )}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="h-[100dvh] bg-gray-100 flex justify-center font-sans overflow-hidden">
            <div className="w-full max-w-[480px] bg-[#faf9f5] shadow-2xl relative flex flex-col">

                <header className="flex-none px-4 py-3 flex items-center justify-between bg-white border-b border-[#e0d8b0]/50 z-20">
                    <div className="flex items-center gap-2">
                        <img src="/Lucidos_Logo.png" alt="Lúcidos" className="w-10 h-10 object-contain rounded-full bg-[#f0ebd7]" />
                        <span className="font-bold text-[#00674f] text-lg">Lúcido's Café</span>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 rounded-full bg-[#f0ebd7] text-[#00674f] hover:bg-[#e0d8b0] transition-colors">
                            <User size={20} />
                        </button>
                        <button className="p-2 rounded-full bg-[#f0ebd7] text-[#00674f] hover:bg-[#e0d8b0] transition-colors">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto hide-scrollbar relative">
                    {renderContent()}
                </main>


                <button
                    onClick={() => {
                        setCheckoutStep('cart');
                        setIsCartOpen(true);
                    }}
                    className="absolute bottom-20 right-6 bg-[#00674f] text-white p-4 rounded-full shadow-[0_8px_16px_rgba(0,103,79,0.3)] hover:scale-105 transition-transform z-30 focus:outline-none"
                    aria-label="Ver carrito"
                >
                    <ShoppingBag size={26} strokeWidth={2} />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#faf9f5]">
                            {totalItems}
                        </span>
                    )}
                </button>

                <nav className="flex-none w-full bg-white border-t border-[#e0d8b0] flex justify-around items-center py-2 pb-safe px-2 z-20">
                    <NavItem icon={<Home size={22} />} label="Inicio" active={activeTab === 'Inicio'} onClick={() => setActiveTab('Inicio')} />
                    <NavItem icon={<Coffee size={22} />} label="Menú" active={activeTab === 'Menú'} onClick={() => setActiveTab('Menú')} />
                    <NavItem icon={<MapPin size={22} />} label="Tiendas" active={activeTab === 'Tiendas'} onClick={() => setActiveTab('Tiendas')} />
                    <NavItem icon={<Gift size={22} />} label="Recompensas" active={activeTab === 'Recompensas'} onClick={() => setActiveTab('Recompensas')} />
                </nav>

                {isCartOpen && (
                    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-sm transition-opacity">
                        <div className="bg-white w-full rounded-t-3xl h-[85%] flex flex-col overflow-hidden animate-slide-up shadow-2xl">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-[#00674f]">
                                    {checkoutStep === 'cart' && 'Tu Carrito'}
                                    {checkoutStep === 'payment' && 'Método de Pago'}
                                    {checkoutStep === 'addCard' && 'Agregar Tarjeta'}
                                    {checkoutStep === 'success' && '¡Pedido Confirmado!'}
                                </h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6 bg-[#faf9f5]">

                                {checkoutStep === 'cart' && (
                                    <>
                                        {cart.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <ShoppingBag size={60} className="mb-4 opacity-50" />
                                                <p className="text-lg">Tu carrito está vacío</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {cart.map((item) => (
                                                    <div key={item.product.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-[#e0d8b0]/50">
                                                        <div className="flex items-center gap-3">
                                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                                                            <div>
                                                                <p className="font-bold text-gray-800">{item.product.name}</p>
                                                                <p className="text-sm text-[#00674f] font-semibold">${item.product.basePrice}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 bg-[#f0ebd7] px-2 py-1 rounded-lg">
                                                            <button onClick={() => updateQuantity(item.product.id, -1)} className="text-[#00674f]"><Minus size={16} /></button>
                                                            <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.product.id, 1)} className="text-[#00674f]"><Plus size={16} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {checkoutStep === 'payment' && (
                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-gray-600 mb-2">Tarjetas Guardadas</p>
                                        {savedCards.map(card => (
                                            <div key={card.id} className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-[#00674f] shadow-sm cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#f0ebd7] p-2 rounded-lg text-[#00674f]">
                                                        <CreditCard size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{card.brand} terminada en {card.last4}</p>
                                                        <p className="text-xs text-gray-500">{card.name}</p>
                                                    </div>
                                                </div>
                                                <CheckCircle size={24} className="text-[#00674f]" />
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => setCheckoutStep('addCard')}
                                            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#00674f]/50 rounded-xl text-[#00674f] font-semibold hover:bg-[#f0ebd7] transition-colors mt-4"
                                        >
                                            <Plus size={20} /> Agregar Nueva Tarjeta
                                        </button>
                                    </div>
                                )}

                                {checkoutStep === 'addCard' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Número de Tarjeta</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00674f]" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Nombre en la tarjeta</label>
                                            <input type="text" placeholder="Ej. Juan Pérez" className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00674f]" />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Vencimiento</label>
                                                <input type="text" placeholder="MM/YY" className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00674f]" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">CVV</label>
                                                <input type="text" placeholder="123" className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00674f]" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSavedCards([...savedCards, { id: 'c2', last4: '1234', brand: 'Mastercard', name: 'Nueva Tarjeta' }]);
                                                setCheckoutStep('payment');
                                            }}
                                            className="w-full bg-[#00674f] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#00523e] transition-colors mt-6"
                                        >
                                            Guardar Tarjeta
                                        </button>
                                    </div>
                                )}

                                {checkoutStep === 'success' && (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">¡Pago Exitoso!</h3>
                                        <p className="text-gray-500">Tu pedido se está preparando y estará listo pronto.</p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Total and Button */}
                            {cart.length > 0 && checkoutStep !== 'success' && checkoutStep !== 'addCard' && (
                                <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-500 font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-[#00674f]">${cartTotal.toFixed(2)}</span>
                                    </div>

                                    {checkoutStep === 'cart' ? (
                                        <button
                                            onClick={() => setCheckoutStep('payment')}
                                            className="w-full bg-[#00674f] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#00523e] transition-colors text-lg"
                                        >
                                            Proceder al Pago
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handlePayment}
                                            className="w-full bg-[#00674f] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#00523e] transition-colors text-lg flex justify-center gap-2"
                                        >
                                            Pagar ${cartTotal.toFixed(2)}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Auxiliar Components

function ProductSection({
    title,
    products,
    showViewAll = true,
    onAddToCart,
    onViewAll
}: {
    title: string,
    products: Product[],
    showViewAll?: boolean,
    onAddToCart: (p: Product) => void,
    onViewAll?: () => void
}) {
    if (products.length === 0) return null;

    return (
        <section className="py-5 border-b border-[#e0d8b0]/30 last:border-0 bg-[#faf9f5]">
            <div className="flex justify-between items-end px-5 mb-4">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
                {showViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-[#00674f] text-sm font-semibold hover:underline cursor-pointer"
                    >
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


                        <button
                            onClick={() => onAddToCart(product)}
                            className="mt-2 text-[#00674f] text-xs font-bold flex items-center gap-1 hover:bg-[#f0ebd7] px-4 py-2 rounded-lg transition-colors border border-transparent bg-white shadow-sm hover:shadow-md"
                        >
                            <Plus size={14} strokeWidth={3} />
                            Agregar
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