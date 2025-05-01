"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function CartPage() {
  // Simulated cart items with useState to allow modifications
  const [cartItems, setCartItems] = useState([
    { id: "chair-1", name: "POÄNG Chair", price: "₹5,999", quantity: 1 },
    { id: "table-1", name: "LISABO Table", price: "₹11,499", quantity: 1 },
  ]);

  // Calculate total based on current cart items
  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity, 0);

  // Update quantity function
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item function
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Your Cart</h1>
        <p>Review your items and proceed to checkout.</p>
      </header>
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty.</p>
          <Link href="/">
            <button className={styles.button}>Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemPrice}>{item.price}</span>
                </div>
                <div className={styles.itemControls}>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.summary}>
            <div className={styles.total}>
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <Link href="/checkout">
              <button className={styles.checkoutButton}>Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
