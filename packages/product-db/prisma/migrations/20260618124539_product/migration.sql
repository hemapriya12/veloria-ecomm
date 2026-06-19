-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "discountPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "salePrice" INTEGER,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published',
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "weight" DOUBLE PRECISION;
