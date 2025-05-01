"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function CartPage() {
  // Simulated cart items
  const cartItems = [
    { id: "chair-1", name: "POÄNG Chair", price: "₹5,999", quantity: 1 },
    { id: "table-1", name: "LISABO Table", price: "₹11,499", quantity: 1 },
  ];

  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity, 0);

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
                <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className={styles.summary}>
            <div className={styles.total}>
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button className={styles.checkoutButton}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
