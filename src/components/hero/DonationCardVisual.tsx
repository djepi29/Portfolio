export default function DonationCardVisual() {
  return (
    <div className="space-y-4">
      {/* Donation Campaign Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Campaign Title */}
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Main Donation Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Campaign Image Placeholder */}
        <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          {/* Amount Raised */}
          <div className="text-center">
            <div className="h-8 bg-green-600 rounded w-24 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>

          {/* Progress Bar with Percent Bubble */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full relative" style={{width: '68%'}}>
                {/* Percent Bubble */}
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="h-2 bg-green-600 rounded w-3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Amount */}
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>

          {/* Donors Count */}
          <div className="text-center">
            <div className="h-3 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
            <div className="h-2 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>
        </div>

        {/* Donate Button */}
        <div className="mt-6">
          <div className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
            <div className="h-4 bg-white rounded w-16"></div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="mt-4 flex justify-center gap-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-3 bg-green-600 rounded w-12"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-3 bg-green-600 rounded w-10"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded w-14"></div>
            </div>
            <div className="h-3 bg-green-600 rounded w-14"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
