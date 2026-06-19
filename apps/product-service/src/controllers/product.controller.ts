import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";
import { producer } from "../utils/kafka";
import { StripeProductType } from "@repo/types";

export const createProduct = async (req: Request, res: Response) => {
  const data: Prisma.ProductCreateInput = req.body;

  const { colors, images } = data;

  if (colors && Array.isArray(colors) && colors.length > 0) {
    if (!images || typeof images !== "object") {
      return res
        .status(400)
        .json({ message: "Images object is required when colors are specified!" });
    }
    const missingColors = (colors as string[]).filter(
      (color) => !(color in (images as object))
    );
    if (missingColors.length > 0) {
      return res
        .status(400)
        .json({ message: "Missing images for colors!", missingColors });
    }
  }

  const product = await prisma.product.create({ data });

  const stripeProduct: StripeProductType = {
    id: product.id.toString(),
    name: product.name,
    price: product.price,
  };

  producer.send("product.created", { value: stripeProduct });
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name, shortDescription, description, price, salePrice,
    discountPercent, sku, brand, stock, status, highlights,
    tags, weight, sizes, colors, images, categorySlug,
  } = req.body;

  // Auto-compute salePrice from discountPercent if provided
  const computedSalePrice = (() => {
    if (discountPercent !== undefined && price !== undefined) {
      const pct = Number(discountPercent);
      if (pct > 0 && pct < 100) return Math.round(Number(price) * (1 - pct / 100));
      if (pct === 0) return null;
    }
    if (salePrice !== undefined) return salePrice === null ? null : Number(salePrice);
    return undefined;
  })();

  const data: Prisma.ProductUpdateInput = {
    ...(name              !== undefined && { name }),
    ...(shortDescription  !== undefined && { shortDescription }),
    ...(description       !== undefined && { description }),
    ...(price             !== undefined && { price: Number(price) }),
    ...(computedSalePrice !== undefined && { salePrice: computedSalePrice }),
    ...(discountPercent   !== undefined && { discountPercent: Number(discountPercent) }),
    ...(sku               !== undefined && { sku }),
    ...(brand             !== undefined && { brand }),
    ...(stock             !== undefined && { stock: Number(stock) }),
    ...(status            !== undefined && { status }),
    ...(highlights        !== undefined && { highlights }),
    ...(tags              !== undefined && { tags }),
    ...(weight            !== undefined && { weight: weight === null ? null : Number(weight) }),
    ...(sizes             !== undefined && { sizes }),
    ...(colors            !== undefined && { colors }),
    ...(images            !== undefined && { images }),
    ...(categorySlug      !== undefined && { category: { connect: { slug: categorySlug } } }),
  };

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error("[updateProduct]", error.message);
    return res.status(500).json({ message: error.message || "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedProduct = await prisma.product.delete({
    where: { id: Number(id) },
  });

  producer.send("product.deleted", { value: Number(id) });

  return res.status(200).json(deletedProduct);
};

export const getProducts = async (req: Request, res: Response) => {
  const { sort, category, search, limit, offset, sellerEmail } = req.query;

  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
      case "desc":
        return { price: Prisma.SortOrder.desc };
      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };
      default:
        return { createdAt: Prisma.SortOrder.desc };
    }
  })();

  // Split query into individual tokens so "nike shoes" matches products
  // containing both "nike" AND "shoes" anywhere across all searchable fields.
  const searchTokens = search
    ? (search as string).trim().split(/\s+/).filter(Boolean)
    : [];

  const searchWhere =
    searchTokens.length > 0
      ? {
          AND: searchTokens.map((token) => ({
            OR: [
              { name:             { contains: token, mode: Prisma.QueryMode.insensitive } },
              { brand:            { contains: token, mode: Prisma.QueryMode.insensitive } },
              { shortDescription: { contains: token, mode: Prisma.QueryMode.insensitive } },
              { description:      { contains: token, mode: Prisma.QueryMode.insensitive } },
              { sku:              { contains: token, mode: Prisma.QueryMode.insensitive } },
              { categorySlug:     { contains: token, mode: Prisma.QueryMode.insensitive } },
              { tags:             { has: token.toLowerCase() } },
            ],
          })),
        }
      : {};

  const raw = await prisma.product.findMany({
    where: {
      ...(sellerEmail ? { sellerEmail: sellerEmail as string } : {}),
      ...(category && category !== "all"
        ? { category: { slug: category as string } }
        : {}),
      ...searchWhere,
      ...(req.query.admin !== "true" ? { status: "published" } : {}),
    },
    orderBy,
    take:  limit  ? Number(limit)  : undefined,
    skip:  offset ? Number(offset) : undefined,
  });

  // Client-side relevance ranking when a search term is present.
  // Rank by: exact name match > name starts with > name contains >
  //          brand match > tag match > description match
  let products = raw;
  if (search) {
    const q = (search as string).toLowerCase();
    const score = (p: typeof raw[0]): number => {
      const name = p.name.toLowerCase();
      const brand = (p.brand ?? "").toLowerCase();
      if (name === q)                        return 100;
      if (name.startsWith(q))               return 85;
      if (name.includes(q))                 return 70;
      if (brand === q)                       return 60;
      if (brand.includes(q))                return 50;
      if (p.tags?.some((t) => t.toLowerCase().includes(q))) return 40;
      if ((p.shortDescription ?? "").toLowerCase().includes(q)) return 30;
      return 10;
    };
    products = [...raw].sort((a, b) => score(b) - score(a));
  }

  res.status(200).json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  return res.status(200).json(product);
};

// Internal endpoint called by order-service to decrement stock after purchase
export const decrementStock = async (req: Request, res: Response) => {
  const { id }        = req.params;
  const { decrement } = req.body as { decrement: number };

  if (!decrement || decrement < 1) {
    return res.status(400).json({ message: "decrement must be >= 1" });
  }

  try {
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data:  { stock: { decrement } },
    });
    return res.status(200).json({ id: updated.id, stock: updated.stock });
  } catch {
    // Product not found or stock would go negative — fail silently so order still goes through
    return res.status(200).json({ skipped: true });
  }
};
