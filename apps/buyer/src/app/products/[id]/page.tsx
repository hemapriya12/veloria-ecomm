import ProductInteraction from "@/components/ProductInteraction";
import ReviewSection from "@/components/ReviewSection";
import { ProductType, getProductImage } from "@repo/types";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

const fetchProduct = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`,
    { next: { revalidate: 60 } });
  return res.json() as Promise<ProductType>;
};

const fetchReviewStats = async (id: string): Promise<{ avg: number; count: number }> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/reviews/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { avg: 0, count: 0 };
    const reviews: Array<{ rating: number }> = await res.json();
    if (!reviews.length) return { avg: 0, count: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg: Math.round(avg * 10) / 10, count: reviews.length };
  } catch {
    return { avg: 0, count: 0 };
  }
};

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id }   = await params;
  const product  = await fetchProduct(id);
  const images   = product.images as Record<string, string>;
  const imageUrl = images["default"] ?? Object.values(images)[0] ?? "/featured.png";
  const price    = ((product as any).salePrice ?? product.price) / 100;
  return {
    title:       product.name,
    description: product.shortDescription ?? product.description,
    openGraph: {
      title:       `${product.name} — Veloria`,
      description: product.shortDescription ?? product.description,
      images:      [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card:        "summary_large_image",
      title:       product.name,
      description: `$${price.toFixed(2)} · ${product.categorySlug.replace(/-/g, " ")}`,
      images:      [imageUrl],
    },
  };
};

const ProductPage = async ({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string; size?: string }>;
}) => {
  const { id }    = await params;
  const { size, color } = await searchParams;
  const [product, reviewStats] = await Promise.all([
    fetchProduct(id),
    fetchReviewStats(id),
  ]);

  const selectedSize  = size  || product.sizes[0]  || undefined;
  const selectedColor = color || product.colors[0] || undefined;

  return (
    <div className="flex flex-col gap-8 mt-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-violet-600 transition-colors">Products</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* Image */}
        <div className="w-full lg:w-5/12">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
            <Image
              src={getProductImage(product.images, selectedColor)}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {/* Color thumbnails */}
          {product.colors.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.colors.map((c) => (
                <Link key={c} href={`?color=${c}${selectedSize ? `&size=${selectedSize}` : ""}`}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedColor === c ? "border-violet-500" : "border-gray-200"}`}>
                  <Image src={getProductImage(product.images, c)} alt={c} fill className="object-cover" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full lg:w-7/12 flex flex-col gap-4">
          {/* Category badge */}
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">{product.categorySlug}</span>

          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

          {/* Live rating from reviews */}
          {reviewStats.count > 0 ? (
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className={
                  s <= Math.round(reviewStats.avg)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200 fill-gray-200"
                } />
              ))}
              <span className="text-xs text-gray-400 ml-1">
                {reviewStats.avg.toFixed(1)} · {reviewStats.count} review{reviewStats.count !== 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">No reviews yet</span>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            {(product as any).salePrice ? (
              <>
                <p className="text-3xl font-bold text-gray-900">${((product as any).salePrice / 100).toFixed(2)}</p>
                <p className="text-xl text-gray-400 line-through">${(product.price / 100).toFixed(2)}</p>
                <span className="text-sm font-bold text-white bg-red-500 px-2.5 py-1 rounded-full">
                  {(product as any).discountPercent}% OFF
                </span>
              </>
            ) : (
              <p className="text-3xl font-bold text-gray-900">${(product.price / 100).toFixed(2)}</p>
            )}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

          <ProductInteraction product={product} selectedSize={selectedSize} selectedColor={selectedColor} />

          {/* Trust badges */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {["Klarna", "Stripe", "Visa", "Mastercard"].map((brand) => (
              <span key={brand} className="text-xs text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg">{brand}</span>
            ))}
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            By clicking Buy Now, you agree to our{" "}
            <span className="underline hover:text-violet-600 cursor-pointer">Terms & Conditions</span> and{" "}
            <span className="underline hover:text-violet-600 cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
      <ReviewSection productId={product.id} />
    </div>
  );
};

export default ProductPage;
