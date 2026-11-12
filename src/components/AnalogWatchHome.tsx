import React, { useState, useEffect } from 'react';
import { Car, User, Video, PenTool, ChevronLeft, ChevronRight, History, X } from 'lucide-react';

interface WatchTheme {
  id: string;
  handColor: string;
  icon: React.ReactNode;
}

const WATCHES: WatchTheme[] = [
  { id: 'lambo', handColor: '#38bdf8', icon: <Car className="w-8 h-8 text-sky-400" /> },
  { id: 'self', handColor: '#22c55e', icon: <User className="w-8 h-8 text-emerald-400" /> },
  { id: 'video', handColor: '#ec4899', icon: <Video className="w-8 h-8 text-pink-400" /> },
  { id: 'pen', handColor: '#f97316', icon: <PenTool className="w-8 h-8 text-orange-400" /> },
];

const ACTIVE_WATCH_KEY = 'routine_dial_active_watch_v1';
const USAGE_HISTORY_KEY = 'routine_dial_usage_history_v1';

export const AnalogWatchHome: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_WATCH_KEY);
      if (saved !== null) {
        const idx = WATCHES.findIndex(w => w.id === saved);
        if (idx !== -1) return idx;
      }
    } catch {}
    return 0; // Default to lambo
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [appliedToast, setAppliedToast] = useState<boolean>(false);

  const activeWatch = WATCHES[currentIndex];

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real usage time tracking per second
  useEffect(() => {
    const usageTimer = setInterval(() => {
      try {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const rawHistory = localStorage.getItem(USAGE_HISTORY_KEY);
        const history: Record<string, Record<string, number>> = rawHistory ? JSON.parse(rawHistory) : {};
        
        if (!history[today]) {
          history[today] = { lambo: 0, self: 0, video: 0, pen: 0 };
        }
        history[today][activeWatch.id] = (history[today][activeWatch.id] || 0) + 1;
        
        localStorage.setItem(USAGE_HISTORY_KEY, JSON.stringify(history));
      } catch {}
    }, 1000);

    return () => clearInterval(usageTimer);
  }, [activeWatch.id]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? WATCHES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === WATCHES.length - 1 ? 0 : prev + 1));
  };

  const handleApply = () => {
    try {
      localStorage.setItem(ACTIVE_WATCH_KEY, activeWatch.id);
      localStorage.setItem('routine_dial_hand_color_v1', activeWatch.handColor);
    } catch {}

    setAppliedToast(true);
    setTimeout(() => {
      setAppliedToast(false);
    }, 2000);
  };

  // Calculate hands angles
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const secondAngle = (seconds / 60) * 360;

  // Load history logs for modal
  const getUsageHistory = (): Record<string, Record<string, number>> => {
    try {
      const raw = localStorage.getItem(USAGE_HISTORY_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const formatTimeSpent = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    if (hrs === 0) return `${mins}m ${secs}s`;
    return `${hrs}h ${remainMins}m`;
  };

  const historyData = getUsageHistory();

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-between overflow-hidden relative p-4 sm:p-6 select-none">
      {/* Top Bar with History Icon at Top Right */}
      <div className="w-full max-w-md flex items-center justify-end z-30 pt-2 pr-2">
        <button
          type="button"
          onClick={() => setShowHistoryModal(true)}
          className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-md"
          title="History"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Single Watch View */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 my-auto">
        <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border-4 border-white/20 bg-slate-950/10 backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center">
          {/* Hour Markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12 - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 115;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const num = i === 0 ? 12 : i;

            return (
              <div
                key={i}
                className="absolute text-sm font-bold font-mono text-white/90 pointer-events-none"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {num}
              </div>
            );
          })}

          {/* Center Pivot */}
          <div className="absolute w-3.5 h-3.5 rounded-full bg-white z-20 shadow-md pointer-events-none" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-black z-30 pointer-events-none" />

          {/* Hour Hand */}
          <div
            className="absolute w-2 h-20 rounded-full origin-bottom z-10 transition-transform duration-300 pointer-events-none"
            style={{ backgroundColor: activeWatch.handColor, transform: `rotate(${hourAngle}deg)`, bottom: '50%' }}
          />

          {/* Minute Hand */}
          <div
            className="absolute w-1.5 h-28 rounded-full bg-white/90 origin-bottom z-10 transition-transform duration-100 pointer-events-none"
            style={{ transform: `rotate(${minuteAngle}deg)`, bottom: '50%' }}
          />

          {/* Second Hand */}
          <div
            className="absolute w-0.5 h-32 rounded-full bg-rose-500 origin-bottom z-10 transition-transform duration-75 pointer-events-none"
            style={{ transform: `rotate(${secondAngle}deg)`, bottom: '50%' }}
          />
        </div>

        {/* Icon below watch */}
        <div className="p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg animate-fade-in">
          {activeWatch.icon}
        </div>
      </div>

      {/* Bottom Controls: Left/Right Arrows & Apply Button */}
      <div className="w-full max-w-sm pb-6 flex flex-col items-center space-y-4 z-30">
        <div className="flex items-center justify-between w-full px-8">
          <button
            type="button"
            onClick={handlePrev}
            className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all shadow-lg backdrop-blur-md"
            title="Previous Watch"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-10 py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-base shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all shadow-lg backdrop-blur-md"
            title="Next Watch"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {appliedToast && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md animate-bounce">
            Applied to Widget successfully!
          </div>
        )}
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-sky-400" />
                <span>Activity History</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-2 text-white/60 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {Object.keys(historyData).length === 0 ? (
                <div className="text-center py-12 text-white/50 text-sm">
                  No activity recorded yet. Start using the watch to track history!
                </div>
              ) : (
                Object.entries(historyData).map(([date, activities]) => (
                  <div key={date} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-xs font-bold font-mono text-sky-400">{date}</div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {Object.entries(activities).map(([act, secs]) => {
                        if (secs === 0) return null;
                        return (
                          <div key={act} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-xs">
                            <span className="capitalize text-white/80 font-medium">{act === 'lambo' ? 'Lambo' : act}</span>
                            <span className="font-mono text-sky-300">{formatTimeSpent(secs)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
