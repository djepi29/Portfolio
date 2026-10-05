export default function KPIDashboardVisual() {
  return (
    <div className="space-y-4">
      {/* KPI Dashboard Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1 - Revenue */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 bg-green-600 rounded w-12"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="h-6 bg-green-600 rounded w-16 mb-2"></div>
            <div className="h-2 bg-green-200 rounded w-full mb-1"></div>
            <div className="h-2 bg-green-300 rounded w-3/4"></div>
          </div>

          {/* Card 2 - Users */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 bg-blue-600 rounded w-10"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="h-6 bg-blue-600 rounded w-14 mb-2"></div>
            <div className="h-2 bg-blue-200 rounded w-full mb-1"></div>
            <div className="h-2 bg-blue-300 rounded w-5/6"></div>
          </div>

          {/* Card 3 - Orders */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 bg-purple-600 rounded w-11"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
            <div className="h-6 bg-purple-600 rounded w-12 mb-2"></div>
            <div className="h-2 bg-purple-200 rounded w-full mb-1"></div>
            <div className="h-2 bg-purple-300 rounded w-2/3"></div>
          </div>

          {/* Card 4 - Growth */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 bg-orange-600 rounded w-9"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <div className="h-6 bg-orange-600 rounded w-18 mb-2"></div>
            <div className="h-2 bg-orange-200 rounded w-full mb-1"></div>
            <div className="h-2 bg-orange-300 rounded w-4/5"></div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-300 rounded"></div>
            <div className="w-2 h-2 bg-gray-300 rounded"></div>
            <div className="w-2 h-2 bg-gray-300 rounded"></div>
          </div>
        </div>
        
        {/* Mini Chart Bars */}
        <div className="flex items-end gap-1 h-12">
          <div className="w-2 bg-primary-200 rounded-t" style={{height: '60%'}}></div>
          <div className="w-2 bg-primary-300 rounded-t" style={{height: '80%'}}></div>
          <div className="w-2 bg-primary-400 rounded-t" style={{height: '45%'}}></div>
          <div className="w-2 bg-primary-500 rounded-t" style={{height: '90%'}}></div>
          <div className="w-2 bg-primary-400 rounded-t" style={{height: '70%'}}></div>
          <div className="w-2 bg-primary-600 rounded-t" style={{height: '100%'}}></div>
          <div className="w-2 bg-primary-500 rounded-t" style={{height: '85%'}}></div>
          <div className="w-2 bg-primary-400 rounded-t" style={{height: '55%'}}></div>
        </div>
      </div>
    </div>
  )
}
