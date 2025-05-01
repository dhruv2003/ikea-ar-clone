"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter for navigation
import styles from "./page.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const products = {
  "chair-1": {
    name: "POÄNG Chair",
    image: "/images/chair.png",
    price: "₹5,999",
    oldPrice: "₹7,499",
    discount: "-20%",
    description: "A comfortable and stylish chair with a layer of bentwood for relaxing, natural flexibility. The high back provides good support for your neck and the cotton cover is easy to keep clean.",
    specs: [
      { label: "Width", value: "68 cm" },
      { label: "Depth", value: "82 cm" },
      { label: "Height", value: "100 cm" },
      { label: "Material", value: "Birch veneer, Cotton" },
      { label: "Assembly", value: "Required" }
    ],
    images: ["/images/chair.png"],
    roomScenes: [
      {
        image: "/images/chair-living-room.jpg",
        title: "Modern Living Room",
        description: "POÄNG chair in a minimalist living room setting"
      },
      {
        image: "/images/chair-bedroom.jpg",
        title: "Cozy Reading Corner",
        description: "Create a comfortable reading space in your bedroom"
      }
    ],
    stock: {
      status: "in_stock",
      quantity: 15
    },
    variants: [
      { id: "birch", name: "Birch", color: "#E5D0B1", image: "/images/chair-birch.png" },
      { id: "black", name: "Black", color: "#333333", image: "/images/chair-black.png" },
      { id: "white", name: "White", color: "#FFFFFF", image: "/images/chair-white.png" }
    ]
  },
  "table-1": {
    name: "LISABO Table",
    image: "/images/table.png",
    price: "₹11,499",
    description: "A durable dining table made from ash veneer that seats 4 people comfortably. The clear lacquered surface is easy to wipe clean.",
    specs: [
      { label: "Length", value: "140 cm" },
      { label: "Width", value: "78 cm" },
      { label: "Height", value: "74 cm" },
      { label: "Material", value: "Ash veneer" },
      { label: "Assembly", value: "Required" }
    ],
    images: ["/images/table.png"]
  },
  "sofa-1": {
    name: "KIVIK Sofa",
    image: "/images/sofa.png",
    price: "₹44,999",
    oldPrice: "₹52,499",
    discount: "-14%",
    description: "A generous seating series with a soft, deep seat and comfortable support for your back. Seat cushions with a top layer of memory foam mold to the precise contours of your body.",
    specs: [
      { label: "Width", value: "228 cm" },
      { label: "Depth", value: "95 cm" },
      { label: "Height", value: "83 cm" },
      { label: "Material", value: "Polyester, Memory foam" },
      { label: "Assembly", value: "Required" }
    ],
    images: ["/images/sofa.png"]
  }
};

const relatedProducts = [
  { id: "chair-1", name: "POÄNG Chair", price: "₹5,999", image: "/images/chair.png" },
  { id: "table-1", name: "LISABO Table", price: "₹11,499", image: "/images/table.png" },
  { id: "sofa-1", name: "KIVIK Sofa", price: "₹44,999", image: "/images/sofa.png" }
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter(); // Initialize router
  const id = params?.id as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });

  const product = products[id as keyof typeof products];

  if (!product) {
    return <div>Product not found</div>;
  }

  const filteredRelated = relatedProducts.filter(item => item.id !== id);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipple({ x, y, show: true });
    setTimeout(() => setRipple({ x: 0, y: 0, show: false }), 800);
  };

  return (
    <div className={styles.container}>
      {/* Cart Icon */}
      <div className={styles.cartIcon}>
        <Link href="/cart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.cartSvg}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8h13.2M7 13L5.4 5M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
        </Link>
      </div>

      {/* Breadcrumb navigation */}
      <ul className={styles.breadcrumbs}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/">Furniture</Link></li>
        <li className={styles.current}>{product.name}</li>
      </ul>

      {/* Back Link */}
      <Link href="/" className={styles.backLink}>
        Back to Catalog
      </Link>

      <div className={styles.productLayout}>
        {/* Left column - Product Images */}
        <div>
          <div className={styles.imageContainer}>
            <Image
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              fill
              priority
            />
            <div className={styles.imageZoomHint} title="Click to zoom">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="7" stroke="#333" strokeWidth="2" />
                <path d="M15 15L21 21" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 7V13" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 10H13" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className={styles.thumbnailGallery}>
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${index === selectedImage ? styles.active : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image src={img} alt={`${product.name} view ${index + 1}`} width={64} height={64} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column - Product Info */}
        <div>
          <h1 className={styles.productTitle}>{product.name}</h1>

          {/* Product price with potential discount */}
          <div className={styles.productPrice}>
            {"oldPrice" in product && <span className={styles.oldPrice}>{product.oldPrice}</span>}
            <span>{product.price}</span>
            {"discount" in product && <span className={styles.discountBadge}>{product.discount}</span>}
          </div>

          {/* Product description */}
          <div className={styles.productInfo}>
            <h2>Description</h2>
            <p>{product.description}</p>

            {/* Product specifications */}
            {product.specs && (
              <div className={styles.productSpecs}>
                <h2>Specifications</h2>
                {product.specs.map((spec, index) => (
                  <div key={index} className={styles.specRow}>
                    <div className={styles.specLabel}>{spec.label}</div>
                    <div className={styles.specValue}>{spec.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={(e) => {
              handleButtonClick(e);
              setAddedToCart(true);
              setTimeout(() => {
                setAddedToCart(false);
                router.push("/cart"); // Navigate to cart page
              }, 1000);
            }}
            style={{ marginBottom: '1rem' }}
          >
            <span className={styles.buttonIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 18C9.10457 18 10 18.8954 10 20C10 21.1046 9.10457 22 8 22C6.89543 22 6 21.1046 6 20C6 18.8954 6.89543 18 8 18Z" stroke="currentColor" strokeWidth="2" />
                <path d="M18 18C19.1046 18 20 18.8954 20 20C20 21.1046 19.1046 22 18 22C16.8954 22 16 21.1046 16 20C16 18.8954 16.8954 18 18 18Z" stroke="currentColor" strokeWidth="2" />
                <path d="M2 3H5L7 14H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 6H21L19 14H7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </span>
            <span>{addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}</span>
            {ripple.show && (
              <span
                className={styles.buttonRipple}
                style={{
                  left: ripple.x + 'px',
                  top: ripple.y + 'px',
                }}
              />
            )}
          </button>

          {/* View in AR Button */}
          <Link href={`/ar-view/${id}`}>
            <button className={`${styles.button} ${styles.primary}`}>
              <span className={styles.buttonIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18.5L6 14.5V6.5L12 2.5L18 6.5V14.5L12 18.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M12 10.5L18 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 10.5L6 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 10.5V18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span>View in AR</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Related Products */}
      {filteredRelated.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2 className={styles.relatedProductsTitle}>You might also like</h2>
          <div className={styles.relatedProductsGrid}>
            {filteredRelated.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id}>
                <div className={styles.relatedProductCard}>
                  <div className={styles.relatedProductImage}>
                    <Image src={item.image} alt={item.name} fill />
                  </div>
                  <div className={styles.relatedProductInfo}>
                    <div className={styles.relatedProductName}>{item.name}</div>
                    <div className={styles.relatedProductPrice}>{item.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}