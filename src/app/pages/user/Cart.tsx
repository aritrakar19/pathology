import React from "react";
import { Link } from "react-router";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, delivery, discount, total } = useCart();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/user/pharmacy" className="inline-flex items-center gap-2 text-[#6B7C7B] hover:text-[#1FAF9A] text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Pharmacy
      </Link>

      <h1 className="text-2xl font-bold text-[#1C2B2A]">Your Cart</h1>

      <div className="space-y-3">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6F0EE] p-10 text-center">
            <div className="w-16 h-16 bg-[#F4F8F7] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-[#1FAF9A]" />
            </div>
            <h2 className="text-xl font-bold text-[#1C2B2A] mb-2">Your cart is empty</h2>
            <p className="text-[#6B7C7B] mb-6">Looks like you haven't added any medicines yet.</p>
            <Link to="/user/pharmacy" className="px-6 py-3 bg-[#1FAF9A] text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-block">
              Browse Medicines
            </Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.medicineId} className="bg-white rounded-2xl border border-[#E6F0EE] p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F4F8F7] rounded-xl flex items-center justify-center overflow-hidden">
                <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1C2B2A] text-sm truncate">{item.name}</h3>
                <p className="text-xs text-[#6B7C7B]">{item.quantity}</p>
                <p className="font-bold text-[#1C2B2A] mt-1">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateQuantity(item.medicineId, item.qty - 1)}
                  className="w-8 h-8 bg-[#F4F8F7] rounded-lg flex items-center justify-center text-[#6B7C7B] hover:text-[#1FAF9A]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-sm">{item.qty}</span>
                <button 
                  onClick={() => updateQuantity(item.medicineId, item.qty + 1)}
                  className="w-8 h-8 bg-[#F4F8F7] rounded-lg flex items-center justify-center text-[#6B7C7B] hover:text-[#1FAF9A]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.medicineId)}
                className="p-2 text-[#6B7C7B] hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#E6F0EE] p-5 space-y-3">
        <h3 className="font-semibold text-[#1C2B2A]">Order Summary</h3>
        <div className="flex justify-between text-sm text-[#6B7C7B]"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between text-sm text-[#6B7C7B]"><span>Delivery</span><span>₹{delivery}</span></div>
        <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{discount}</span></div>
        <div className="border-t border-[#E6F0EE] pt-3 flex justify-between font-bold text-[#1C2B2A]">
          <span>Total</span><span>₹{total}</span>
        </div>
      </div>

      <Link 
        to={cartItems.length > 0 ? "/user/checkout" : "#"} 
        className={`block w-full px-6 py-4 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-xl font-semibold text-center transition-all ${cartItems.length > 0 ? "hover:shadow-lg hover:shadow-[#1FAF9A]/25" : "opacity-50 cursor-not-allowed"}`}
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
