import type { Product, Category } from "@repo/product-db";
import z from "zod";

export type ProductType = Product;
export type ProductsType = ProductType[];

export type StripeProductType = {
  id: string;
  name: string;
  price: number;
};

export const colors = [
  "blue", "green", "red", "yellow", "purple", "orange",
  "pink", "brown", "gray", "black", "white",
] as const;

export const sizes = [
  "xs", "s", "m", "l", "xl", "xxl",
  "34", "35", "36", "37", "38", "39", "40",
  "41", "42", "43", "44", "45", "46", "47", "48",
] as const;

export const ProductFormSchema = z
  .object({
    name: z.string().min(1, { message: "Product name is required!" }),
    shortDescription: z
      .string()
      .min(1, { message: "Short description is required!" })
      .max(60),
    description: z.string().min(1, { message: "Description is required!" }),
    price: z.number().min(1, { message: "Price is required!" }),
    salePrice: z.number().optional(),
    sku: z.string().optional(),
    brand: z.string().optional(),
    stock: z.number().min(0).default(0),
    status: z.enum(["draft", "published"]).default("published"),
    highlights: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    weight: z.number().optional(),
    categorySlug: z.string().min(1, { message: "Category is required!" }),
    sizes: z.array(z.enum(sizes)).default([]),
    colors: z.array(z.enum(colors)).default([]),
    images: z.record(z.string(), z.string()).default({}),
  })
  .refine(
    (data) => {
      if (data.salePrice !== undefined && data.salePrice >= data.price) {
        return false;
      }
      return true;
    },
    { message: "Sale price must be less than the regular price", path: ["salePrice"] }
  )
  .refine(
    (data) => {
      if (data.colors.length > 0) {
        return data.colors.every((color) => !!data.images?.[color]);
      }
      return !!data.images?.["default"];
    },
    { message: "A product image is required!", path: ["images"] }
  );

export type CategoryType = Category;

export const CategoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is Required!" }),
  slug: z.string().min(1, { message: "Slug is Required!" }),
});
