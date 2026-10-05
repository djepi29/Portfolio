export default function InventoryVisual() {
  return (
    <div className="space-y-4">
      {/* Inventory Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Search Bar */}
        <div className="h-8 bg-gray-100 rounded-lg mb-4"></div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* SKU Card 1 - In Stock */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          {/* Thumbnail Block */}
          <div className="w-full h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-2 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
          </div>
          
          {/* SKU Info */}
          <div className="space-y-1 mb-2">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
            <div className="h-2 bg-gray-200 rounded w-12"></div>
          </div>
          
          {/* Stock Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-green-100 rounded-full px-2 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <div className="h-2 bg-green-600 rounded w-8"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-10"></div>
          </div>
          
          {/* Barcode Strip */}
          <div className="flex gap-0.5 mb-2">
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
          </div>
        </div>

        {/* SKU Card 2 - Low Stock Alert */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          {/* Thumbnail Block */}
          <div className="w-full h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-2 flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-500 rounded"></div>
          </div>
          
          {/* SKU Info */}
          <div className="space-y-1 mb-2">
            <div className="h-3 bg-gray-300 rounded w-14"></div>
            <div className="h-2 bg-gray-200 rounded w-10"></div>
          </div>
          
          {/* Low Stock Alert Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-red-100 rounded-full px-2 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              <div className="h-2 bg-red-600 rounded w-6"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
          
          {/* Barcode Strip */}
          <div className="flex gap-0.5 mb-2">
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
          </div>
        </div>

        {/* SKU Card 3 - Out of Stock */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          {/* Thumbnail Block */}
          <div className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-400 rounded"></div>
          </div>
          
          {/* SKU Info */}
          <div className="space-y-1 mb-2">
            <div className="h-3 bg-gray-300 rounded w-18"></div>
            <div className="h-2 bg-gray-200 rounded w-14"></div>
          </div>
          
          {/* Out of Stock Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-gray-100 rounded-full px-2 flex items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-1"></div>
              <div className="h-2 bg-gray-600 rounded w-7"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-6"></div>
          </div>
          
          {/* Barcode Strip */}
          <div className="flex gap-0.5 mb-2">
            <div className="w-1 h-3 bg-gray-600"></div>
            <div className="w-0.5 h-3 bg-gray-600"></div>
            <div className="w-1 h-3 bg-gray-600"></div>
            <div className="w-0.5 h-3 bg-gray-600"></div>
            <div className="w-1 h-3 bg-gray-600"></div>
            <div className="w-0.5 h-3 bg-gray-600"></div>
            <div className="w-1 h-3 bg-gray-600"></div>
            <div className="w-0.5 h-3 bg-gray-600"></div>
            <div className="w-1 h-3 bg-gray-600"></div>
            <div className="w-0.5 h-3 bg-gray-600"></div>
            <div className="w-1 h-3 bg-gray-600"></div>
            <div className="w-0.5 h-3 bg-gray-600"></div>
          </div>
        </div>

        {/* SKU Card 4 - High Stock */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          {/* Thumbnail Block */}
          <div className="w-full h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-2 flex items-center justify-center">
            <div className="w-8 h-8 bg-green-500 rounded"></div>
          </div>
          
          {/* SKU Info */}
          <div className="space-y-1 mb-2">
            <div className="h-3 bg-gray-300 rounded w-15"></div>
            <div className="h-2 bg-gray-200 rounded w-11"></div>
          </div>
          
          {/* High Stock Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-blue-100 rounded-full px-2 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              <div className="h-2 bg-blue-600 rounded w-9"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          
          {/* Barcode Strip */}
          <div className="flex gap-0.5 mb-2">
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
            <div className="w-1 h-3 bg-gray-800"></div>
            <div className="w-0.5 h-3 bg-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
