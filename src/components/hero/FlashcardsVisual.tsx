export default function FlashcardsVisual() {
  return (
    <div className="space-y-4">
      {/* Study Session Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-indigo-500 rounded-full" style={{width: '45%'}}></div>
          </div>
        </div>
      </div>

      {/* Flashcard Stack */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Card Stack Container */}
        <div className="relative h-48 flex items-center justify-center mb-6">
          {/* Background Cards */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-32 bg-gray-100 rounded-lg shadow-sm transform translate-x-1 translate-y-1"></div>
            <div className="absolute w-48 h-32 bg-gray-200 rounded-lg shadow-sm transform translate-x-0.5 translate-y-0.5"></div>
          </div>
          
          {/* Main Card with Flip Animation */}
          <div className="relative w-48 h-32 perspective-1000">
            <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
              {/* Front of Card */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-lg border border-indigo-200">
                <div className="p-4 h-full flex flex-col justify-center">
                  <div className="text-center space-y-2">
                    <div className="h-4 bg-indigo-600 rounded w-20 mx-auto"></div>
                    <div className="h-6 bg-gray-300 rounded w-32 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
                  </div>
                </div>
              </div>
              
              {/* Back of Card */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg border border-green-200 rotate-y-180">
                <div className="p-4 h-full flex flex-col justify-center">
                  <div className="text-center space-y-2">
                    <div className="h-4 bg-green-600 rounded w-16 mx-auto"></div>
                    <div className="h-5 bg-gray-300 rounded w-28 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Counter */}
        <div className="text-center mb-4">
          <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {/* Review Button */}
          <div className="flex-1 max-w-24">
            <div className="w-full h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <div className="h-3 bg-white rounded w-8"></div>
            </div>
          </div>
          
          {/* Know It Button */}
          <div className="flex-1 max-w-24">
            <div className="w-full h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
              <div className="h-3 bg-white rounded w-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Study Stats */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="h-6 bg-green-600 rounded w-8 mx-auto mb-1"></div>
            <div className="h-2 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-orange-600 rounded w-6 mx-auto mb-1"></div>
            <div className="h-2 bg-gray-200 rounded w-10 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-600 rounded w-8 mx-auto mb-1"></div>
            <div className="h-2 bg-gray-200 rounded w-14 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
