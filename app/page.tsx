import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const products = [
  {
    id: "chair-1",  // Changed to match the IDs used in the AR view
    name: "Chair",
    description: "A comfortable wooden chair.",
    image: "/images/chair.png",
  },
  {
    id: "table-1",  // Changed to match the IDs used in the AR view
    name: "Table",
    description: "A sturdy dining table.",
    image: "/images/table.png",
  },
  {
    id: "sofa-1",   // Changed to match the IDs used in the AR view
    name: "Sofa",
    description: "A stylish sofa.",  // Fixed description which was incorrect
    image: "/images/sofa.png",
  },
];

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to IKEA AR Clone</h1>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image 
                src={product.image} 
                alt={product.name} 
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productDescription}>{product.description}</p>
              <Link href={`/product/${product.id}`}>
                <button className={`${styles.button} ${styles.primary}`}>View in AR</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}