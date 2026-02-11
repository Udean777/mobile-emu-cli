import { useEffect, useState } from "react";
import type { EmulatorInfo } from "../shared/types";
import { emulatorApi } from "./api/emulatorApi";

interface EmulatorListProps {
  platform: "android" | "ios";
}

export default function EmulatorList({ platform }: EmulatorListProps) {
  const [emulators, setEmulators] = useState<EmulatorInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  const fetchEmulators = async () => {
    setLoading(true);
    try {
      const list = await emulatorApi.list();
      setEmulators(list);
    } catch (err) {
      console.error("Failed to fetch emulators", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmulators();
  }, []);

  const handleLaunch = async (emulator: EmulatorInfo) => {
    if (launchingId) return;
    setLaunchingId(emulator.id);
    try {
      await emulatorApi.launch(emulator);
    } catch (err) {
      console.error("Failed to launch emulator", err);
    } finally {
      setLaunchingId(null);
    }
  };

  const filteredEmulators = emulators.filter(
    (emu) => emu.platform === platform,
  );

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 capitalize">
            {platform} Devices
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {filteredEmulators.length}{" "}
            {platform === "android" ? "emulators" : "simulators"} found
          </p>
        </div>
        <button
          onClick={fetchEmulators}
          disabled={loading}
          className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all disabled:opacity-50 shadow-sm active:scale-95"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-sm font-semibold">
            {loading ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>

      {loading && filteredEmulators.length === 0 ? (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white border border-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredEmulators.map((emu) => (
            <div
              key={emu.id}
              className="group relative flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 overflow-hidden"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-colors ${
                    platform === "android"
                      ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                      : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                  }`}
                >
                  {platform === "android" ? (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">
                    {emu.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded">
                      {emu.id}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <p className="text-xs text-slate-400 capitalize font-medium">
                      {emu.platform} ready
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLaunch(emu)}
                  disabled={!!launchingId}
                  className={`relative overflow-hidden px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${
                    launchingId === emu.id
                      ? "bg-amber-50 text-amber-600 cursor-wait"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                  }`}
                >
                  {launchingId === emu.id && (
                    <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {launchingId === emu.id ? "Launching..." : "Launch"}
                </button>
              </div>

              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-indigo-50/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
            </div>
          ))}

          {!loading && filteredEmulators.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No {platform} devices found
              </h3>
              <p className="text-slate-500 text-sm mt-1 max-w-[280px] text-center">
                We couldn't detect any {platform}{" "}
                {platform === "android" ? "emulators" : "simulators"}. Make sure
                your SDK is properly configured.
              </p>
              <button
                onClick={fetchEmulators}
                className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
              >
                Try refreshing
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
