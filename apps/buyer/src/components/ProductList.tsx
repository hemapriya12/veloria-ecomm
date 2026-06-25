import ProductCard from "./ProductCard";
import Filter from "./Filter";
import Pagination from "./Pagination";

const PAGE_SIZE = 20;

const fetchData = async ({
  category,
  sort,
  search,
  params,
  page,
}: {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
  page?: number;
}) => {
  const isHomepage = params === "homepage";
  const limit  = isHomepage ? 8 : PAGE_SIZE;
  const offset = isHomepage ? 0 : ((page ?? 1) - 1) * PAGE_SIZE;

  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  if (search)   qs.set("search", search);
  qs.set("sort",   sort || "newest");
  qs.set("limit",  String(limit));
  qs.set("offset", String(offset));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?${qs.toString()}`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const ProductList = async ({
  category,
  sort,
  search,
  params,
  page,
}: {
  category: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
  page?: number;
}) => {
  const currentPage = page ?? 1;
  const products    = await fetchData({ category, sort, search, params, page: currentPage });

  const hasMore = params === "products" && products.length === PAGE_SIZE;
  const hasPrev = currentPage > 1;

  return (
    <div className="w-full">
      {params === "products" && <Filter />}

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-gray-500 font-medium">No products found</p>
          <p className="text-sm text-gray-400">Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {params === "products" && (hasPrev || hasMore) && (
        <Pagination
          currentPage={currentPage}
          hasMore={hasMore}
          category={category}
          sort={sort}
          search={search}
        />
      )}
    </div>
  );
};

export default ProductList;
