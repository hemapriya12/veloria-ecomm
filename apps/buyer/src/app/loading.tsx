export default function Loading() {
  return (
    <div className="flex flex-col gap-16 animate-pulse">
      {/* Hero carousel skeleton */}
      <div className="w-full h-64 sm:h-80 bg-gray-100 rounded-2xl" />

      {/* Perks skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-28 bg-gray-100 rounded" />
              <div className="h-2.5 w-20 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Featured products section */}
      <div>
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div className="flex flex-col gap-2">
            <div className="h-2.5 w-24 bg-gray-100 rounded" />
            <div className="h-7 w-44 bg-gray-100 rounded" />
          </div>
          <div className="h-4 w-14 bg-gray-100 rounded" />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-100 rounded-full" />
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-full aspect-square bg-gray-100 rounded-2xl" />
              <div className="h-4 w-3/4 bg-gray-100 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
              <div className="h-5 w-1/4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
