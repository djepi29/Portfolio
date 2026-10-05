export default function OriginalVisual() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-primary-200 rounded w-2/3"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 bg-primary-100 rounded"></div>
          <div className="h-16 bg-primary-200 rounded"></div>
          <div className="h-16 bg-primary-100 rounded"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          <div className="h-3 bg-primary-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-6 bg-green-100 rounded w-16"></div>
          <div className="h-6 bg-gray-100 rounded w-12"></div>
        </div>
      </div>
    </div>
  )
}


