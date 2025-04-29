"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';

const products = {
  "chair-1": {
    name: "Modern Chair",
    image: "/chair.png",
  },
  "table-1": {
    name: "Wooden Table",
    image: "/table.png",
  },
  "sofa-1": {
    name: "Comfort Sofa",
    image: "/sofa.png",
  },
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const product = products[id as keyof typeof products];

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Link href="/" style={{ textDecoration: "none", fontSize: "1rem" }}>← Back to Catalog</Link>

      <h1 style={{ fontSize: "2rem", margin: "1rem 0" }}>{product.name}</h1>

      <Image src={product.image} alt={product.name} width={500} height={300} />

      <div style={{ marginTop: "2rem" }}>
        <Link href={`/ar-view/${id}`}>
          <button style={{ padding: "1rem 2rem", fontSize: "1.2rem", borderRadius: "8px", backgroundColor: "#0070f3", color: "#fff", border: "none" }}>
            View in AR
          </button>
        </Link>
      </div>
    </div>
  );
}