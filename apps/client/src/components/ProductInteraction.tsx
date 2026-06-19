"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@repo/types";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductInteraction = ({
  product, selectedSize, selectedColor,
}: {
  product: ProductType;
  selectedSize?: string;
  selectedColor?: string;
}) => {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();

  const handleTypeChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedColor, selectedSize });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity, selectedColor, selectedSize });
    router.push("/cart?step=2");
  };

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button key={size}
                onClick={() => handleTypeChange("size", size)}
                className={`w-10 h-10 rounded-xl text-xs font-semibold border-2 transition-all ${
                  selectedSize === size
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-violet-300"
                }`}>
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Color — <span className="capitalize font-normal text-gray-700">{selectedColor}</span>
          </p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button key={color}
                onClick={() => handleTypeChange("color", color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? "border-violet-500 scale-110" : "border-transparent hover:scale-105"}`}
                style={{ backgroundColor: color, boxShadow: "0 0 0 1px #e5e7eb" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quantity</p>
        <div className="flex items-center gap-3 w-fit border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-semibold text-gray-800 w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 mt-2">
        <button onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
          <ShoppingCart size={16} /> Add to Cart
        </button>
        <button onClick={handleBuyNow}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-violet-700 border-2 border-violet-200 hover:bg-violet-50 transition-all">
          <Zap size={16} /> Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInteraction;
