export default function OrdersLoading() {
  return (
    <div className="flex flex-col gap-6 mt-8 animate-pulse">
      <div>
        <div className="h-7 w-36 bg-gray-200 rounded-xl mb-2" />
        <div className="h-3 w-24 bg-gray-200 rounded-full" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 w-16 bg-gray-200 rounded-full" />
              <div className="h-4 w-32 bg-gray-200 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-12 bg-gray-200 rounded-full" />
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 bg-gray-200 rounded-full" />
            <div className="h-3 bg-gray-200 rounded-full w-2/3" />
          </div>
          <div className="border-t border-gray-50 pt-3 flex justify-between">
            <div className="h-3 w-28 bg-gray-200 rounded-full" />
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
