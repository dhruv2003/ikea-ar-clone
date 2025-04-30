"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* Back Link */}
      <Link href="/" style={{ textDecoration: "none", color: "#0070f3", fontSize: "1rem" }}>
        ← Back to Catalog
      </Link>

      {/* Product Title */}
      <h1 style={{ fontSize: "2.5rem", margin: "1.5rem 0 1rem", fontWeight: "bold" }}>
        {product.name}
      </h1>

      {/* Product Image */}
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={500}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
          }}
          priority
        />
      </div>

      {/* View in AR Button */}
      <Link href={`/ar-view/${id}`}>
        <button
          style={{
            padding: "1rem 2.5rem",
            fontSize: "1.2rem",
            borderRadius: "8px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005ccc";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0070f3";
          }}
        >
          View in AR
        </button>
      </Link>
    </div>
  );
}