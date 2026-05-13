import React, { createContext, useContext, useState } from "react";
import { Medicine, PharmacyService } from "../services/PharmacyService";
import { BookingService } from "../services/BookingService";
import { useUserProfile } from "./ProfileContext";

export interface CartItem extends Medicine {
  qty: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (medicine: Medicine) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, qty: number) => void;
  clearCart: () => void;
  checkout: (paymentMethod: string) => Promise<string | null>;
  isCheckingOut: boolean;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { profile } = useUserProfile();

  const addToCart = (medicine: Medicine) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.medicineId === medicine.medicineId);
      if (existing) {
        return prev.map(item => item.medicineId === medicine.medicineId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...medicine, qty: 1 }];
    });
  };

  const removeFromCart = (medicineId: string) => {
    setCartItems(prev => prev.filter(item => item.medicineId !== medicineId));
  };

  const updateQuantity = (medicineId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCartItems(prev => prev.map(item => item.medicineId === medicineId ? { ...item, qty } : item));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const delivery = subtotal > 0 ? 49 : 0;
  const discount = subtotal > 500 ? 30 : 0;
  const total = subtotal + delivery - discount;

  const checkout = async (paymentMethod: string) => {
    if (!profile || cartItems.length === 0) return null;
    setIsCheckingOut(true);
    try {
      // 1. Reduce stock for each item
      for (const item of cartItems) {
        await PharmacyService.reduceStock(item.medicineId, item.qty);
      }

      // 2. Create a booking for the order
      const orderNames = cartItems.map(i => `${i.qty}x ${i.name}`).join(', ');
      
      const bookingData = {
        userId: profile.uid,
        patientName: profile.fullName,
        patientPhone: profile.phone,
        patientEmail: profile.email,
        serviceType: "medicine" as const,
        testName: `Pharmacy Order: ${orderNames}`,
        paymentMethod,
        paymentStatus: paymentMethod === "cash" ? "pending" : "completed",
        bookingStatus: "booking_confirmed",
        amount: total,
      } as Parameters<typeof BookingService.createBooking>[0];

      const bookingId = await BookingService.createBooking(bookingData);
      
      clearCart();
      return bookingId;
    } catch (error) {
      console.error("Checkout failed", error);
      return null;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, checkout, isCheckingOut, subtotal, delivery, discount, total
    }}>
      {children}
    </CartContext.Provider>
  );
};
