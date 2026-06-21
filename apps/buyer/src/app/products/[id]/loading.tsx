export default function ProductLoading() {
  return (
    <div className="flex flex-col gap-8 mt-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center">
        {[80, 16, 100, 16, 160].map((w, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded-full" style={{ width: w }} />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image skeleton */}
        <div className="w-full lg:w-5/12">
          <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
          <div className="flex gap-2 mt-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="w-full lg:w-7/12 flex flex-col gap-4">
          <div className="h-3 w-24 bg-gray-200 rounded-full" />
          <div className="h-9 w-3/4 bg-gray-200 rounded-xl" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />)}
            <div className="h-3 w-24 bg-gray-200 rounded-full ml-2" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl" />
          <div className="flex flex-col gap-2">
            <div className="h-3 bg-gray-200 rounded-full" />
            <div className="h-3 bg-gray-200 rounded-full w-5/6" />
            <div className="h-3 bg-gray-200 rounded-full w-4/6" />
          </div>
          <div className="h-12 bg-gray-200 rounded-xl mt-4" />
        </div>
      </div>

      {/* Reviews skeleton */}
      <div className="mt-12 flex flex-col gap-6">
        <div className="h-7 w-48 bg-gray-200 rounded-xl" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 bg-gray-200 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <div className="h-3 w-24 bg-gray-200 rounded-full" />
                <div className="h-2.5 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full" />
            <div className="h-3 bg-gray-200 rounded-full w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
