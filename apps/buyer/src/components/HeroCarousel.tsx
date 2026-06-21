"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    badge:    "New Season 2026",
    title:    "Style that speaks",
    highlight:"for itself.",
    desc:     "Discover the latest fashion trends curated just for you. Premium quality, unbeatable prices.",
    cta:      { label: "Shop Fashion", href: "/products?category=mens-clothing" },
    bg:       "radial-gradient(ellipse at 30% 50%, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)",
    image:    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
    imageAlt: "Premium sneakers",
  },
  {
    badge:    "Tech Picks",
    title:    "Power in your",
    highlight:"hands.",
    desc:     "The latest smartphones, laptops, and wearables — engineered for life on the move.",
    cta:      { label: "Shop Electronics", href: "/products?category=mobile-phones" },
    bg:       "radial-gradient(ellipse at 30% 50%, #0d1117 0%, #0f2027 40%, #203a43 70%, #2c5364 100%)",
    image:    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&q=80",
    imageAlt: "Latest smartphone",
  },
  {
    badge:    "Beauty & Skincare",
    title:    "Glow like you",
    highlight:"mean it.",
    desc:     "Expertly curated skincare, makeup, and fragrances for every skin type and tone.",
    cta:      { label: "Shop Beauty", href: "/products?category=skincare" },
    bg:       "radial-gradient(ellipse at 30% 50%, #2d1b33 0%, #4a1942 40%, #7b2d6e 70%, #c06090 100%)",
    image:    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
    imageAlt: "Skincare products",
  },
  {
    badge:    "Home & Living",
    title:    "Make your space",
    highlight:"feel alive.",
    desc:     "Beautiful furniture, lighting, and décor to transform every room in your home.",
    cta:      { label: "Shop Home", href: "/products?category=home-decor" },
    bg:       "radial-gradient(ellipse at 30% 50%, #1a2e1a 0%, #1e3a1e 40%, #2d5a2d 70%, #4a7c4a 100%)",
    image:    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    imageAlt: "Modern living space",
  },
  {
    badge:    "Fitness & Sport",
    title:    "Push beyond",
    highlight:"your limits.",
    desc:     "Pro-grade sports gear, gym equipment, and activewear built for peak performance.",
    cta:      { label: "Shop Sport", href: "/products?category=exercise-fitness" },
    bg:       "radial-gradient(ellipse at 30% 50%, #1a0a0a 0%, #2d1010 40%, #5a1a1a 70%, #8b2020 100%)",
    image:    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80",
    imageAlt: "Fitness equipment",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    []
  );
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  // Auto-advance every 4 s unless user is hovering
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next, paused]);

  const slide = slides[current]!;

  return (
    <div
      className="relative rounded-3xl overflow-hidden min-h-[340px] flex items-center select-none"
      style={{ background: slide.bg, transition: "background 0.6s ease" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative rings */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white"
            style={{
              width:     (i + 1) * 200,
              height:    (i + 1) * 200,
              top:       "50%",
              left:      "30%",
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}
      </div>

      {/* Slide image */}
      <div
        key={current}
        className="absolute right-0 top-0 h-full w-1/2 hidden md:block animate-fade-in"
      >
        <Image
          src={slide.image}
          alt={slide.imageAlt}
          fill
          className="object-cover object-center opacity-60"
          priority
        />
        {/* Gradient fade on left edge of image */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--fade-color, rgba(15,15,40,1)) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 px-10 py-12 max-w-lg">
        <span className="text-violet-300 text-xs font-semibold uppercase tracking-[0.3em] mb-4 block">
          {slide.badge}
        </span>
        <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-4">
          {slide.title}
          <span
            className="block text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #a78bfa, #f472b6)" }}
          >
            {slide.highlight}
          </span>
        </h1>
        <p className="text-white/50 text-sm mb-8 max-w-xs">{slide.desc}</p>
        <div className="flex items-center gap-3">
          <Link
            href={slide.cta.href}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            {slide.cta.label} <ArrowRight size={15} />
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white/70 border border-white/20 hover:bg-white/10 transition-all"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
