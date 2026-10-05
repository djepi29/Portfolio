export default function CalendarVisual() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-gray-900">September 2025</div>
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L9.414 10l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 text-[11px] text-gray-500 mb-2">
        <div className="text-center">Sun</div>
        <div className="text-center">Mon</div>
        <div className="text-center">Tue</div>
        <div className="text-center">Wed</div>
        <div className="text-center">Thu</div>
        <div className="text-center">Fri</div>
        <div className="text-center">Sat</div>
      </div>

      {/* Days grid (static mock) */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading blanks for month offset */}
        <div className="aspect-square" />
        <div className="aspect-square" />
        <div className="aspect-square" />
        {/* Days 1-7 */}
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">1</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">2</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">3</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">4</div>
        {/* Row 2 */}
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">5</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">6</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">7</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">8</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">9</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">10</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">11</div>
        {/* Row 3 with selected day */}
        <div className="aspect-square relative flex items-center justify-center rounded-md text-white bg-primary-600">
          12
          <svg className="absolute top-1 right-1 w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">13</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">14</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">15</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">16</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">17</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">18</div>
        {/* Row 4 */}
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">19</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">20</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">21</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">22</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">23</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">24</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">25</div>
        {/* Row 5 */}
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">26</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">27</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">28</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">29</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100">30</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-400">1</div>
        <div className="aspect-square flex items-center justify-center rounded-md text-sm text-gray-400">2</div>
      </div>
    </div>
  )
}


