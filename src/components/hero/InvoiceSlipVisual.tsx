export default function InvoiceSlipVisual() {
  return (
    <div className="space-y-4">
      {/* Invoice Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Invoice Number */}
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>

      {/* Invoice/Receipt Slip */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Tear-off Edge */}
        <div className="relative mb-4">
          <div className="h-6 bg-gray-100 rounded-t-lg border-b-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Company Header */}
        <div className="text-center mb-4">
          <div className="h-5 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-28 mx-auto"></div>
        </div>

        {/* Invoice Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-14"></div>
            <div className="h-3 bg-gray-300 rounded w-18"></div>
          </div>
        </div>

        {/* Line Items */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="space-y-3">
            {/* Item 1 */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-12"></div>
            </div>
            
            {/* Item 2 */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-14"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-10"></div>
            </div>
            
            {/* Item 3 */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="h-3 bg-gray-300 rounded w-22 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-18"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-14"></div>
            </div>
          </div>
        </div>

        {/* Totals Section */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-10"></div>
              <div className="h-3 bg-gray-300 rounded w-14"></div>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-2">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-400 rounded w-20"></div>
            </div>
          </div>
        </div>

        {/* Paid Stamp */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-500 rounded-full flex items-center justify-center bg-red-50">
              <div className="text-center">
                <div className="h-3 bg-red-600 rounded w-12 mx-auto mb-1"></div>
                <div className="h-2 bg-red-500 rounded w-8 mx-auto"></div>
              </div>
            </div>
            {/* Stamp texture lines */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-red-500 rounded-full opacity-30">
              <div className="absolute top-2 left-2 w-16 h-16 border border-red-400 rounded-full"></div>
              <div className="absolute top-4 left-4 w-12 h-12 border border-red-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs">
          <div className="h-2 bg-gray-200 rounded w-32 mx-auto mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-28 mx-auto"></div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="h-3 bg-gray-300 rounded w-20 mb-3"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-6 bg-blue-100 rounded border border-blue-200 flex items-center justify-center">
            <div className="w-4 h-3 bg-blue-500 rounded-sm"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  )
}
