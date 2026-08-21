// src/shopping/ShoppingPage.tsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { CartItem, CheckoutStep, Product, SavedCard, TabKey } from './types';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { CartFab } from './components/CartFab';
import { HomeTab } from './components/HomeTab';
import { MenuTab } from './components/MenuTab';
import { StoresTab } from './components/StoresTab';
import { RewardsTab } from './components/RewardsTab';
import { CartSheet } from './components/cart/CartSheet';

export default function ShoppingPage() {
    const [activeTab, setActiveTab] = useState<TabKey>('Menú');
    const [activeCategory, setActiveCategory] = useState('Todos');

    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
    const [savedCards] = useState<SavedCard[]>([
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

    const renderContent = () => {
        switch (activeTab) {
            case 'Inicio':
                return <HomeTab />;
            case 'Tiendas':
                return <StoresTab />;
            case 'Recompensas':
                return <RewardsTab />;
            case 'Menú':
            default:
                return (
                    <MenuTab
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        onAddToCart={addToCart}
                    />
                );
        }
    };

    return (
        <div className="h-[100dvh] bg-gray-100 flex justify-center font-sans overflow-hidden">
            <div className="w-full max-w-[480px] bg-[#faf9f5] shadow-2xl relative flex flex-col">
                <AppHeader />

                <main className="flex-1 overflow-y-auto hide-scrollbar relative">
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </main>

                {cart.length > 0 && (
                    <CartFab
                        totalItems={totalItems}
                        onClick={() => {
                            setCheckoutStep('cart');
                            setIsCartOpen(true);
                        }}
                    />
                )}

                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

                <CartSheet
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    checkoutStep={checkoutStep}
                    setCheckoutStep={setCheckoutStep}
                    cart={cart}
                    updateQuantity={updateQuantity}
                    cartTotal={cartTotal}
                    savedCards={savedCards}
                    onPay={handlePayment}
                />
            </div>
        </div>
    );
}
