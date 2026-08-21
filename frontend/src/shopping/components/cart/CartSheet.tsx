// src/shopping/components/cart/CartSheet.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { CartItem, CheckoutStep, SavedCard } from '../../types';
import { CartView } from './CartView';
import { PaymentView } from './PaymentView';
import { AddCardView } from './AddCardView';
import { SuccessView } from './SuccessView';

interface CartSheetProps {
    isOpen: boolean;
    onClose: () => void;
    checkoutStep: CheckoutStep;
    setCheckoutStep: (step: CheckoutStep) => void;
    cart: CartItem[];
    updateQuantity: (productId: string, delta: number) => void;
    cartTotal: number;
    savedCards: SavedCard[];
    onPay: () => void;
}

const STEP_TITLES: Record<CheckoutStep, string> = {
    cart: 'Tu Carrito',
    payment: 'Método de Pago',
    addCard: 'Agregar Tarjeta',
    success: '¡Pedido Confirmado!',
};

export function CartSheet({
    isOpen,
    onClose,
    checkoutStep,
    setCheckoutStep,
    cart,
    updateQuantity,
    cartTotal,
    savedCards,
    onPay,
}: CartSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
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
                                        {STEP_TITLES[checkoutStep]}
                                    </motion.span>
                                </AnimatePresence>
                            </h2>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-[#faf9f5]">
                            <AnimatePresence mode="wait">
                                {checkoutStep === 'cart' && (
                                    <CartView cart={cart} updateQuantity={updateQuantity} />
                                )}
                                {checkoutStep === 'payment' && (
                                    <PaymentView savedCards={savedCards} onAddCard={() => setCheckoutStep('addCard')} />
                                )}
                                {checkoutStep === 'addCard' && (
                                    <AddCardView onSave={() => setCheckoutStep('payment')} />
                                )}
                                {checkoutStep === 'success' && <SuccessView />}
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
                                        onClick={onPay}
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
    );
}
