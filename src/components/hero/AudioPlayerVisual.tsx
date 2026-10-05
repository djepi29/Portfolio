export default function AudioPlayerVisual() {
  return (
    <div className="space-y-4">
      {/* Audio Player Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Lesson Title */}
        <div className="space-y-2 mb-4">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Audio Player Main */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Play/Pause Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
            </div>
          </div>
        </div>

        {/* Animated Waveform Bars */}
        <div className="flex items-end justify-center gap-1 mb-6 h-12">
          <div className="w-1 bg-purple-300 rounded-t" style={{height: '20%'}}></div>
          <div className="w-1 bg-purple-400 rounded-t" style={{height: '60%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '100%'}}></div>
          <div className="w-1 bg-purple-600 rounded-t" style={{height: '80%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '40%'}}></div>
          <div className="w-1 bg-purple-400 rounded-t" style={{height: '90%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '70%'}}></div>
          <div className="w-1 bg-purple-600 rounded-t" style={{height: '100%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '50%'}}></div>
          <div className="w-1 bg-purple-400 rounded-t" style={{height: '85%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '30%'}}></div>
          <div className="w-1 bg-purple-600 rounded-t" style={{height: '95%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '65%'}}></div>
          <div className="w-1 bg-purple-400 rounded-t" style={{height: '75%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '45%'}}></div>
          <div className="w-1 bg-purple-600 rounded-t" style={{height: '100%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '55%'}}></div>
          <div className="w-1 bg-purple-400 rounded-t" style={{height: '80%'}}></div>
          <div className="w-1 bg-purple-500 rounded-t" style={{height: '35%'}}></div>
          <div className="w-1 bg-purple-600 rounded-t" style={{height: '90%'}}></div>
        </div>

        {/* Progress Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <div className="h-3 bg-gray-200 rounded w-8"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{width: '35%'}}></div>
            <div className="absolute top-1/2 left-[35%] transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-purple-600 rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {/* Previous */}
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-r-[6px] border-r-gray-400 border-y-[4px] border-y-transparent"></div>
          </div>
          
          {/* Speed */}
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          
          {/* Next */}
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[6px] border-l-gray-400 border-y-[4px] border-y-transparent"></div>
          </div>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )
}
