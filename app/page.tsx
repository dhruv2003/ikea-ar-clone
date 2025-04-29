"use client";

import Link from "next/link";
import Image from "next/image";

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
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Furniture Catalog
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
        }}
      >
        {products.map((product) => (
          <Link
          key={product.id}
          href={`/product/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              transition: "transform 0.2s, box-shadow 0.2s",
              textAlign: "center",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ position: "relative" }}>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
              {/* Text background box */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.9)",
                  padding: "0.8rem 1rem",
                  backdropFilter: "blur(2px)",
                }}
              >
                <h2 style={{ fontSize: "1.3rem", margin: 0, color: "#333", fontWeight: "600" }}>
                  {product.name}
                </h2>
              </div>
            </div>
          </div>
        </Link>
        ))}
      </div>
    </div>
  );
}