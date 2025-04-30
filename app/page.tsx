import Image from "next/image";
import styles from "./page.module.css";

const products = [
  {
    id: 1,
    name: "Chair",
    description: "A comfortable wooden chair.",
    image: "/images/chair.jpg",
  },
  {
    id: 2,
    name: "Table",
    description: "A sturdy dining table.",
    image: "/images/table.jpg",
  },
  {
    id: 3,
    name: "Lamp",
    description: "A stylish desk lamp.",
    image: "/images/lamp.jpg",
  },
];

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Welcome to IKEA AR Clone</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <Image src={product.image} alt={product.name} width={300} height={200} />
            <div style={{ padding: "1rem" }}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <button className={`${styles.button} ${styles.primary}`}>View in AR</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}