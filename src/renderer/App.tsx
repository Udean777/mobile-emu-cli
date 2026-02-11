import { useState } from "react";
import EmulatorList from "./EmulatorList";

function App() {
  const [activeTab, setActiveTab] = useState<"android" | "ios">("android");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <header className="bg-white/70 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Mobile Emu
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Desktop Controller v1.0.2
              </p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("android")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "android"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setActiveTab("ios")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "ios"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              iOS Emulator
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <EmulatorList platform={activeTab} />
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-8 border-t border-slate-200">
        <p className="text-center text-slate-400 text-sm">
          &copy; 2026 Mobile Emu CLI. Modernized with &hearts;
        </p>
      </footer>
    </div>
  );
}

export default App;
