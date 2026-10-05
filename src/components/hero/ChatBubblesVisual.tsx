export default function ChatBubblesVisual() {
  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Online Status */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="space-y-4 h-48 overflow-hidden">
          {/* Message 1 - User (Right) */}
          <div className="flex justify-end">
            <div className="flex items-end gap-2 max-w-xs">
              <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-2">
                <div className="h-3 bg-white rounded w-20 mb-1"></div>
                <div className="h-2 bg-blue-200 rounded w-16"></div>
              </div>
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Message 2 - Support (Left) */}
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-xs">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-4 py-2">
                <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>

          {/* Message 3 - User (Right) */}
          <div className="flex justify-end">
            <div className="flex items-end gap-2 max-w-xs">
              <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-2">
                <div className="h-3 bg-white rounded w-16 mb-1"></div>
                <div className="h-2 bg-blue-200 rounded w-12"></div>
              </div>
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Message 4 - Support (Left) */}
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-xs">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-4 py-2">
                <div className="h-3 bg-gray-300 rounded w-28 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-18"></div>
              </div>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-10 bg-gray-100 rounded-full px-4 flex items-center">
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="h-3 bg-gray-300 rounded w-20 mb-3"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-100 rounded-full px-3 flex items-center">
            <div className="h-2 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-8 bg-gray-100 rounded-full px-3 flex items-center">
            <div className="h-2 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-8 bg-gray-100 rounded-full px-3 flex items-center">
            <div className="h-2 bg-gray-200 rounded w-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
