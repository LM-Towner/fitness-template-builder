export function BlockPalette() {
  return (
    <div className="w-full lg:w-72 bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Workout Blocks</h2>
        <p className="text-sm text-gray-500 mt-1">Available workout types</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="group p-3 bg-white rounded-md border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">C</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Cardio</p>
                <p className="text-xs text-gray-500">Running, Cycling, HIIT</p>
              </div>
            </div>
          </div>
          <div className="group p-3 bg-white rounded-md border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">S</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-green-600">Strength</p>
                <p className="text-xs text-gray-500">Weights, Resistance</p>
              </div>
            </div>
          </div>
          <div className="group p-3 bg-white rounded-md border border-gray-200 hover:border-purple-500 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                <span className="text-purple-600 text-sm font-medium">F</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600">Flexibility</p>
                <p className="text-xs text-gray-500">Yoga, Stretching</p>
              </div>
            </div>
          </div>
          <div className="group p-3 bg-white rounded-md border border-gray-200 hover:border-orange-500 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center">
                <span className="text-orange-600 text-sm font-medium">R</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600">Recovery</p>
                <p className="text-xs text-gray-500">Rest, Mobility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 