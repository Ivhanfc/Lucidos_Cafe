// src/shopping.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, ShoppingBag, Settings, Home, Coffee, MapPin, Gift, Star,
    X, Plus, Minus, CreditCard, CheckCircle
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

interface ProductSectionProps {
    title: string;
    products: Product[];
    showViewAll?: boolean;
    onAddToCart: (product: Product) => void;
    onViewAll?: () => void;
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

const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
};

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
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

function ProductSection({ title, products, showViewAll = true, onAddToCart, onViewAll }: ProductSectionProps) {
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

export default function ShoppingPage() {
    const [activeTab, setActiveTab] = useState('Menú');
    const [activeCategory, setActiveCategory] = useState('Todos');

    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'addCard' | 'success'>('cart');
    const [savedCards, setSavedCards] = useState<SavedCard[]>([
        { id: 'c1', last4: '4242', brand: 'Visa', name: 'Jesús Eduardo' }
    ]);

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
        }, 3000);
    };

    const filteredProducts = activeCategory === 'Todos'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

    const groupedProducts = CATEGORIES.slice(1).reduce((acc, category) => {
        acc[category] = MOCK_PRODUCTS.filter(p => p.category === category);
        return acc;
    }, {} as Record<string, Product[]>);

    const renderContent = () => {
        switch (activeTab) {
            case 'Inicio':
                return (
                    <motion.div
                        key="inicio"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="p-6 space-y-6"
                    >
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <h1 className="text-2xl font-bold text-[#00674f]">Hola, Jesús Eduardo</h1>
                            <p className="text-gray-500 text-sm mt-1">¿Qué vamos a preparar para ti hoy?</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#00674f] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <p className="text-sm opacity-90 mb-1">Tu nivel actual</p>
                                <h2 className="text-xl font-bold mb-3">Cliente Frecuente</h2>
                                <div className="flex items-center gap-2">
                                    <Star className="text-yellow-400 fill-current" size={20} />
                                    <span className="font-semibold">320 Puntos</span>
                                </div>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        </motion.div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3">Pedidos Recientes</h3>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white border border-[#e0d8b0] rounded-xl p-4 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#f0ebd7] p-3 rounded-lg">
                                        <Coffee className="text-[#00674f]" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Latte con Leche de Avena</p>
                                        <p className="text-xs text-gray-500">Ayer, 09:30 AM</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="text-[#00674f] text-xs font-bold bg-[#f0ebd7] px-3 py-1.5 rounded-full hover:bg-[#e0d8b0]"
                                >
                                    Repetir
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                );

            case 'Tiendas':
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

                        {[
                            { name: 'Lúcidos Café - Zona Río', status: 'Abierto', address: 'Paseo de los Héroes, Zona Urbana Río Tijuana, Tijuana, B.C.', open: true },
                            { name: 'Lúcidos Café - Playas', status: 'Cerrado', address: 'Paseo Ensenada, Playas de Tijuana, Tijuana, B.C.', open: false },
                            { name: 'Lúcidos Café - Cesun Universidad', status: 'Abierto', address: 'Plantel CESUN Universidad, Tijuana, B.C.', open: true }
                        ].map((store, index) => (
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

            case 'Recompensas':
                return (
                    <motion.div
                        key="recompensas"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="p-6 flex flex-col items-center justify-center text-center h-full"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="w-24 h-24 bg-[#f0ebd7] rounded-full flex items-center justify-center mb-4"
                        >
                            <Gift size={40} className="text-[#00674f]" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Programa de Lealtad</h2>
                        <p className="text-gray-500 text-sm mb-6">Acumula sellos en cada compra y canjéalos por bebidas y extras gratis.</p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border-2 border-[#00674f] rounded-xl w-full p-6 shadow-md"
                        >
                            <h3 className="font-bold text-[#00674f] mb-4 text-left">Tu próxima bebida gratis</h3>
                            <div className="grid grid-cols-5 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((stamp, i) => (
                                    <motion.div
                                        key={stamp}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + (i * 0.05) }}
                                        className={`aspect-square rounded-full flex items-center justify-center border-2 ${stamp <= 3 ? 'bg-[#00674f] border-[#00674f]' : 'border-[#e0d8b0] bg-gray-50'}`}
                                    >
                                        {stamp <= 3 ? <Star size={16} className="text-white fill-current" /> : null}
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-left">Faltan 7 compras para tu premio.</p>
                        </motion.div>
                    </motion.div>
                );

            case 'Menú':
            default:
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
                                                onAddToCart={addToCart}
                                                onViewAll={() => setActiveCategory(categoryName)}
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
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
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
                        <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-full bg-[#f0ebd7] text-[#00674f] hover:bg-[#e0d8b0] transition-colors">
                            <User size={20} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-full bg-[#f0ebd7] text-[#00674f] hover:bg-[#e0d8b0] transition-colors">
                            <Settings size={20} />
                        </motion.button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto hide-scrollbar relative">
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </main>

                {cart.length > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setCheckoutStep('cart');
                            setIsCartOpen(true);
                        }}
                        className="absolute bottom-20 right-6 bg-[#00674f] text-white p-4 rounded-full shadow-[0_8px_16px_rgba(0,103,79,0.3)] z-30 focus:outline-none"
                        aria-label="Ver carrito"
                    >
                        <ShoppingBag size={26} strokeWidth={2} />
                        <AnimatePresence>
                            {totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#faf9f5]"
                                >
                                    <motion.span
                                        key={totalItems}
                                        initial={{ scale: 0.1, opacity: 0.5 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 450, damping: 20 }}
                                    >
                                        {totalItems}
                                    </motion.span>
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                )}

                <nav className="flex-none w-full bg-white border-t border-[#e0d8b0] flex justify-around items-center py-2 pb-safe px-2 z-20">
                    <NavItem icon={<Home size={22} />} label="Inicio" active={activeTab === 'Inicio'} onClick={() => setActiveTab('Inicio')} />
                    <NavItem icon={<Coffee size={22} />} label="Menú" active={activeTab === 'Menú'} onClick={() => setActiveTab('Menú')} />
                    <NavItem icon={<MapPin size={22} />} label="Tiendas" active={activeTab === 'Tiendas'} onClick={() => setActiveTab('Tiendas')} />
                    <NavItem icon={<Gift size={22} />} label="Recompensas" active={activeTab === 'Recompensas'} onClick={() => setActiveTab('Recompensas')} />
                </nav>

                <AnimatePresence>
                    {isCartOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="bg-white w-full rounded-t-3xl h-[85%] flex flex-col overflow-hidden shadow-2xl"
                            >
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <h2 className="text-xl font-bold text-[#00674f]">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={checkoutStep}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                            >
                                                {checkoutStep === 'cart' && 'Tu Carrito'}
                                                {checkoutStep === 'payment' && 'Método de Pago'}
                                                {checkoutStep === 'addCard' && 'Agregar Tarjeta'}
                                                {checkoutStep === 'success' && '¡Pedido Confirmado!'}
                                            </motion.span>
                                        </AnimatePresence>
                                    </h2>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsCartOpen(false)}
                                        className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                                    >
                                        <X size={20} />
                                    </motion.button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 bg-[#faf9f5]">
                                    <AnimatePresence mode="wait">
                                        {checkoutStep === 'cart' && (
                                            <motion.div
                                                key="cart"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                            >
                                                {cart.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 pt-20">
                                                        <ShoppingBag size={60} className="mb-4 opacity-50" />
                                                        <p className="text-lg">Tu carrito está vacío</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <AnimatePresence>
                                                            {cart.map((item) => (
                                                                <motion.div
                                                                    layout
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                                                                    key={item.product.id}
                                                                    className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-[#e0d8b0]/50"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                                                                        <div>
                                                                            <p className="font-bold text-gray-800">{item.product.name}</p>
                                                                            <p className="text-sm text-[#00674f] font-semibold">${item.product.basePrice}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 bg-[#f0ebd7] px-2 py-1 rounded-lg">
                                                                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.product.id, -1)} className="text-[#00674f]"><Minus size={16} /></motion.button>
                                                                        <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                                                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.product.id, 1)} className="text-[#00674f]"><Plus size={16} /></motion.button>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {checkoutStep === 'payment' && (
                                            <motion.div
                                                key="payment"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-4"
                                            >
                                                <p className="text-sm font-semibold text-gray-600 mb-2">Tarjetas Guardadas</p>
                                                {savedCards.map((card, i) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        key={card.id}
                                                        className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-[#00674f] shadow-sm cursor-pointer"
                                                    >
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
                                                    </motion.div>
                                                ))}

                                                <motion.button
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setCheckoutStep('addCard')}
                                                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#00674f]/50 rounded-xl text-[#00674f] font-semibold hover:bg-[#f0ebd7] transition-colors mt-4"
                                                >
                                                    <Plus size={20} /> Agregar Nueva Tarjeta
                                                </motion.button>
                                            </motion.div>
                                        )}

                                        {checkoutStep === 'addCard' && (
                                            <motion.div
                                                key="addCard"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Número de Tarjeta</label>
                                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00674f]" />
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="flex-1">
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Expiración</label>
                                                        <input type="text" placeholder="MM/AA" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00674f]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">CVC</label>
                                                        <input type="text" placeholder="123" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00674f]" />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setCheckoutStep('payment')}
                                                    className="w-full bg-[#00674f] text-white font-bold py-3 rounded-xl mt-2"
                                                >
                                                    Guardar Tarjeta
                                                </button>
                                            </motion.div>
                                        )}

                                        {checkoutStep === 'success' && (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center justify-center py-12 text-center"
                                            >
                                                <CheckCircle size={64} className="text-[#00674f] mb-4" />
                                                <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Gracias por tu compra!</h3>
                                                <p className="text-gray-500 text-sm">Estamos preparando tu pedido en barismo.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {cart.length > 0 && checkoutStep !== 'success' && (
                                    <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-3">
                                        <div className="flex justify-between items-center text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-[#00674f]">${cartTotal}</span>
                                        </div>
                                        {checkoutStep === 'cart' && (
                                            <button
                                                onClick={() => setCheckoutStep('payment')}
                                                className="w-full bg-[#00674f] text-white font-bold py-3.5 rounded-xl shadow-lg"
                                            >
                                                Continuar al Pago
                                            </button>
                                        )}
                                        {checkoutStep === 'payment' && (
                                            <button
                                                onClick={handlePayment}
                                                className="w-full bg-[#00674f] text-white font-bold py-3.5 rounded-xl shadow-lg"
                                            >
                                                Pagar (${cartTotal})
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}