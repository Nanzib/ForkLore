import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Placeholder route components
function Shelf() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800">Story Shelf (Catalog)</h2>
      <p className="mt-2 text-slate-600">Browse branching community universes.</p>
    </div>
  );
}

function Reader() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-indigo-600">Reader View</h2>
      <p className="mt-2 text-slate-600">Active story beat and branching crossroads.</p>
    </div>
  );
}

function Editor() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-emerald-600">Chapter Editor</h2>
      <p className="mt-2 text-slate-600">Draft new story branches and continuations.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Global Navigation Header */}
        <header className="border-b border-slate-200 bg-white p-4 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Fork<span className="text-indigo-600">Lore</span>
            </h1>
            <nav className="flex gap-4 text-sm font-medium">
              <Link to="/" className="text-slate-600 hover:text-indigo-600 transition">
                Shelf
              </Link>
              <Link to="/story/test-story-id" className="text-slate-600 hover:text-indigo-600 transition">
                Reader Demo
              </Link>
              <Link to="/write" className="text-slate-600 hover:text-indigo-600 transition">
                Write
              </Link>
            </nav>
          </div>
        </header>

        {/* Dynamic Route View */}
        <main className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Shelf />} />
            <Route path="/story/:id" element={<Reader />} />
            <Route path="/write" element={<Editor />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}