import { BlockPalette } from './components/BlockPalette';
import { PlannerGrid } from './components/PlannerGrid';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 sm:py-5 px-3 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">FT</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Fitness Template Builder
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Help
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                Save Template
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-3 sm:px-4">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Weekly Workout Plan</h2>
          <p className="text-sm text-gray-500 mt-1">Drag and drop workout blocks to create your weekly schedule</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <BlockPalette />
          <PlannerGrid />
        </div>
      </main>
    </div>
  );
}

export default App;
