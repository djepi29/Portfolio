export default function PricingSliderVisual() {
  return (
    <div className="space-y-4">
      {/* Pricing Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Project Type */}
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>

      {/* Pricing Estimator */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Slider Container */}
        <div className="space-y-6">
          {/* Feature Complexity Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-28"></div>
              <div className="h-4 bg-emerald-600 rounded w-16"></div>
            </div>
            
            {/* Slider Track */}
            <div className="relative">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full relative" style={{width: '65%'}}>
                  {/* Slider Handle */}
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-3 border-emerald-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <div className="absolute inset-1 bg-emerald-100 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Slider Labels */}
              <div className="flex justify-between mt-2 text-xs">
                <div className="h-2 bg-gray-200 rounded w-8"></div>
                <div className="h-2 bg-gray-200 rounded w-10"></div>
                <div className="h-2 bg-gray-200 rounded w-12"></div>
                <div className="h-2 bg-gray-200 rounded w-8"></div>
                <div className="h-2 bg-gray-200 rounded w-10"></div>
              </div>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-blue-600 rounded w-14"></div>
            </div>
            
            <div className="relative">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative" style={{width: '40%'}}>
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-3 border-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <div className="absolute inset-1 bg-blue-100 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs">
                <div className="h-2 bg-gray-200 rounded w-6"></div>
                <div className="h-2 bg-gray-200 rounded w-8"></div>
                <div className="h-2 bg-gray-200 rounded w-10"></div>
                <div className="h-2 bg-gray-200 rounded w-8"></div>
                <div className="h-2 bg-gray-200 rounded w-6"></div>
              </div>
            </div>
          </div>

          {/* Design Quality Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-purple-600 rounded w-18"></div>
            </div>
            
            <div className="relative">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full relative" style={{width: '80%'}}>
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-3 border-purple-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <div className="absolute inset-1 bg-purple-100 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs">
                <div className="h-2 bg-gray-200 rounded w-10"></div>
                <div className="h-2 bg-gray-200 rounded w-8"></div>
                <div className="h-2 bg-gray-200 rounded w-12"></div>
                <div className="h-2 bg-gray-200 rounded w-10"></div>
                <div className="h-2 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
          <div className="text-center">
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
            <div className="h-8 bg-emerald-600 rounded w-32 mx-auto mb-1"></div>
            <div className="h-2 bg-gray-200 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-24"></div>
            <div className="w-4 h-4 bg-emerald-500 rounded border-2 border-emerald-600"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="w-4 h-4 bg-gray-200 rounded border-2 border-gray-300"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-28"></div>
            <div className="w-4 h-4 bg-emerald-500 rounded border-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
