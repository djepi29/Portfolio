export default function MapPinVisual() {
  return (
    <div className="space-y-4">
      {/* Map Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Search Bar */}
        <div className="h-8 bg-gray-100 rounded-lg"></div>
      </div>

      {/* Map Panel */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Faux Map Tiles Background */}
        <div className="relative h-48 bg-gray-50 rounded-lg overflow-hidden">
          {/* Map Tile Grid */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-px">
            {/* Road tiles */}
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            
            {/* Building tiles */}
            <div className="bg-blue-100"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-green-100"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-blue-100"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-green-100"></div>
            <div className="bg-gray-200"></div>
            
            {/* More tiles */}
            <div className="bg-gray-200"></div>
            <div className="bg-blue-100"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-green-100"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-blue-100"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-green-100"></div>
            
            {/* Road intersection */}
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            
            {/* Building area */}
            <div className="bg-blue-100"></div>
            <div className="bg-blue-100"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-green-100"></div>
            <div className="bg-green-100"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-blue-100"></div>
            <div className="bg-blue-100"></div>
            
            {/* Bottom row */}
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
            <div className="bg-gray-200"></div>
          </div>

          {/* Floating Pin Badge */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Pin shadow */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-gray-400 rounded-full opacity-30"></div>
              
              {/* Main pin */}
              <div className="relative w-8 h-8 bg-red-500 rounded-full shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                {/* Pin point */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500"></div>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <div className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
            </div>
            <div className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>

        {/* Address Summary Panel */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            {/* Location Icon */}
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            
            {/* Address Details */}
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-40"></div>
              <div className="h-3 bg-gray-200 rounded w-28"></div>
            </div>
            
            {/* Distance */}
            <div className="text-right">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-2 bg-gray-200 rounded w-8 mt-1"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Actions */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="h-3 bg-gray-300 rounded w-20 mb-3"></div>
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="h-3 bg-blue-600 rounded w-16"></div>
          </div>
          <div className="flex-1 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="h-3 bg-gray-400 rounded w-12"></div>
          </div>
          <div className="flex-1 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="h-3 bg-gray-400 rounded w-14"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
