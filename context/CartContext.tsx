import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: ImageSourcePropType;
  type: 'product' | 'custom_bouquet';
  hasVase?: boolean; // ✨ ADICIONADO AQUI
}

// Constantes de preço (centralizadas para fácil manutenção)
const VASE_PRICE = 48.00;
const COUPON_DISCOUNT_VALUE = 18.00;

interface CartContextData {
  // Itens e operações básicas
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  
  // Cálculos
  subtotal: number;
  finalTotal: number;
  
  // Extras (vaso, cartão, cupom)
  hasVase: boolean;
  setHasVase: (value: boolean) => void;
  hasCard: boolean;
  setHasCard: (value: boolean) => void;
  couponApplied: boolean;
  setCouponApplied: (value: boolean) => void;
  couponDiscount: number;
  
  // Constantes expostas (opcional, útil no checkout)
  vasePrice: number;
}

const CartContext = createContext<CartContextData | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Estados dos extras
  const [hasVase, setHasVase] = useState(false);
  const [hasCard, setHasCard] = useState(true);
  const [couponApplied, setCouponApplied] = useState(false);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prevItems => prevItems
      .map(item => item.id === id
        ? { ...item, quantity: item.quantity + delta }
        : item
      )
      .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    // Reset dos extras ao limpar o carrinho
    setHasVase(false);
    setHasCard(true);
    setCouponApplied(false);
  };

  // Cálculos derivados
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    [items]
  );
  
  const couponDiscount = couponApplied ? COUPON_DISCOUNT_VALUE : 0;
  const finalTotal = Math.max(
    0,
    subtotal + (hasVase ? VASE_PRICE : 0) - couponDiscount
  );

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      finalTotal,
      hasVase,
      setHasVase,
      hasCard,
      setHasCard,
      couponApplied,
      setCouponApplied,
      couponDiscount,
      vasePrice: VASE_PRICE,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}