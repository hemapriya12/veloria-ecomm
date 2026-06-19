import ProductList from "@/components/ProductList";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) => {
  const { category, search } = await searchParams;
  const title = search
    ? `Results for "${search}" — Veloria`
    : category
    ? `${category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — Veloria`
    : "All Products — Veloria";
  return { title, description: `Shop ${title} on Veloria` };
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string; sort: string; search: string; page: string }>;
}) => {
  const { category, sort, search, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1") || 1);

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div>
        <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1">Veloria Collection</p>
        <h1 className="text-2xl font-bold text-gray-900">
          {search
            ? `Results for "${search}"`
            : category
            ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "All Products"}
        </h1>
      </div>
      <ProductList
        category={category}
        sort={sort}
        search={search}
        params="products"
        page={currentPage}
      />
    </div>
  );
};

export default ProductsPage;
