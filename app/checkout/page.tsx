"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

// Type definitions for cart items and product data
interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Sample coupon codes
  const validCoupons = {
    "WELCOME10": 10,
    "SALE20": 20,
    "IKEA50": 50
  };

  // Simulate loading cart data from localStorage or context
  useEffect(() => {
    // In a real app, you would get this from localStorage, context, or an API
    const sampleCartItems: CartItem[] = [
      { id: "chair-1", name: "POÄNG Chair", price: "₹5,999", image: "/images/chair.png", quantity: 1 },
      { id: "table-1", name: "LISABO Table", price: "₹11,499", image: "/images/table.png", quantity: 1 }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setCartItems(sampleCartItems);
      setIsLoading(false);
    }, 800);
  }, []);

  // Calculate subtotal from cart items
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  // Apply coupon code
  const applyCoupon = () => {
    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setDiscount(validCoupons[couponCode as keyof typeof validCoupons]);
    } else {
      alert("Invalid coupon code");
    }
  };

  // Calculate final totals
  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * discount) / 100;
  const shipping = 99; // Fixed shipping cost
  const total = subtotal - discountAmount + shipping;

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Handle checkout process
  const handleCheckout = () => {
    alert("Order placed successfully! This is a demo, so no actual order was placed.");
    setCartItems([]);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1>Checkout</h1>
        <div className={styles.loading}>Loading your cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Your Cart</h1>
        <div className={styles.emptyCart}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 18C9.10457 18 10 18.8954 10 20C10 21.1046 9.10457 22 8 22C6.89543 22 6 21.1046 6 20C6 18.8954 6.89543 18 8 18Z" stroke="#0058a3" strokeWidth="2"/>
            <path d="M18 18C19.1046 18 20 18.8954 20 20C20 21.1046 19.1046 22 18 22C16.8954 22 16 21.1046 16 20C16 18.8954 16.8954 18 18 18Z" stroke="#0058a3" strokeWidth="2"/>
            <path d="M2 3H5L7 14H19" stroke="#0058a3" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 6H21L19 14H7" stroke="#0058a3" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <p>Your cart is empty</p>
          <Link href="/">
            <button className={styles.button}>Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Checkout</h1>
        <Link href="/" className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>

      <div className={styles.checkoutLayout}>
        {/* Cart items section */}
        <div className={styles.cartItems}>
          <h2>Your Cart ({cartItems.length} items)</h2>
          
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={80} 
                  height={80} 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
              
              <div className={styles.itemDetails}>
                <div className={styles.itemName}>
                  <Link href={`/product/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
                
                <div className={styles.itemPrice}>
                  <div>{item.price}</div>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order summary section */}
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          
          <div className={styles.summaryRow}>
            <div>Subtotal</div>
            <div>₹{subtotal.toLocaleString()}</div>
          </div>
          
          {discount > 0 && (
            <div className={styles.summaryRow}>
              <div>Discount ({discount}%)</div>
              <div>-₹{discountAmount.toLocaleString()}</div>
            </div>
          )}
          
          <div className={styles.summaryRow}>
            <div>Shipping</div>
            <div>₹{shipping.toLocaleString()}</div>
          </div>
          
          <div className={styles.couponCode}>
            <input 
              type="text" 
              placeholder="Coupon Code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>
          
          <div className={styles.totalRow}>
            <div>Total</div>
            <div>₹{total.toLocaleString()}</div>
          </div>
          
          <button 
            className={styles.checkoutButton}
            onClick={handleCheckout}
          >
            Place Order
          </button>
          
          <div className={styles.secureCheckout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5V21H19V11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M17 9V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
