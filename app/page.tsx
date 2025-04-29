"use client";

import Link from "next/link";
import Image from 'next/image';

const products = [
  {
    id: "chair-1",
    name: "Modern Chair",
    image: "/chair.png",
  },
  {
    id: "table-1",
    name: "Wooden Table",
    image: "/table.png",
  },
  {
    id: "sofa-1",
    name: "Comfort Sofa",
    image: "/sofa.png",
  },
];

export default function HomePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Furniture Catalog</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", textAlign: "center" }}>
              <Image 
                src={product.image} 
                alt={product.name} 
                width={500} 
                height={300} 
                priority={true} 
                style={{ borderRadius: "8px" }}
              />
              <h2 style={{ marginTop: "0.5rem", fontSize: "1.2rem" }}>{product.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}