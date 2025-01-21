// src/App.tsx
import Editor from './components/Editor/index'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-white">LiveCodeIDE</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Editor />
      </main>

      {/* Status Bar */}
      <footer className="bg-gray-800 border-t border-gray-700 py-2 px-4">
        <div className="text-sm text-gray-400 flex items-center justify-between">
          <span>Ready</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  )
}