export default function ProductsLoading() {
  return (
    <div className="flex flex-col gap-6 mt-8 animate-pulse">
      <div>
        <div className="h-3 w-32 bg-gray-200 rounded-full mb-2" />
        <div className="h-7 w-48 bg-gray-200 rounded-xl" />
      </div>
      {/* Filter bar skeleton */}
      <div className="flex gap-2 flex-wrap">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded-full" />
        ))}
      </div>
      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
            <div className="h-4 bg-gray-200 rounded-full w-3/4" />
            <div className="h-3 bg-gray-200 rounded-full w-1/2" />
            <div className="h-5 bg-gray-200 rounded-full w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
