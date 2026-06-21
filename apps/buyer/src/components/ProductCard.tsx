"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType, getProductImage, formatPrice } from "@repo/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors[0] ?? undefined);
  const [selectedSize, setSelectedSize]   = useState<string | undefined>(product.sizes[0] ?? undefined);
  const [hovered, setHovered]             = useState(false);
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1, selectedSize, selectedColor });
    toast.success("Added to cart!");
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <Image
            src={getProductImage(product.images, selectedColor)}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
          />
          {/* Status badge */}
          {(product as any).status === "published" && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/90 text-violet-600 shadow-sm">
                New
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-violet-600 transition-colors">{product.name}</h3>
          </Link>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.shortDescription}</p>
        </div>

        {/* Selectors */}
        {(product.sizes.length > 0 || product.colors.length > 0) && (
          <div className="flex items-center gap-4">
            {product.sizes.length > 0 && (
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-violet-400 bg-gray-50"
              >
                {product.sizes.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            )}
            {product.colors.length > 0 && (
              <div className="flex items-center gap-1.5">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${selectedColor === color ? "border-violet-500 scale-110" : "border-gray-200"}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {(product as any).salePrice ? (
              <>
                <p className="font-bold text-gray-900">${((product as any).salePrice / 100).toFixed(2)}</p>
                <p className="text-xs text-gray-400 line-through">${(product.price / 100).toFixed(2)}</p>
                <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                  -{(product as any).discountPercent}%
                </span>
              </>
            ) : (
              <p className="font-bold text-gray-900">${(product.price / 100).toFixed(2)}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            <ShoppingCart size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
