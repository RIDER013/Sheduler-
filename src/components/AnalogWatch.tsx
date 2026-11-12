import React, { useState, useEffect } from 'react';
import { Car, User, Video, PenTool } from 'lucide-react';

const HAND_COLOR_KEY = 'routine_dial_hand_color_v1';

export const AnalogWatch: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [handColor, setHandColor] = useState<string>(() => {
    try {
      return localStorage.getItem(HAND_COLOR_KEY) || '#38bdf8';
    } catch {
      return '#38bdf8';
    }
  });
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(HAND_COLOR_KEY, handColor);
    } catch {}
  }, [handColor]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const secondAngle = (seconds / 60) * 360;

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden m-0 p-0 relative">
      {/* Tapable Analog Watch Dial with 90% transparent / translucent background */}
      <div
        onClick={() => setShowOverlay(true)}
        className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full border-4 border-white/20 bg-slate-950/10 backdrop-blur-md shadow-[0_0_60px_rgba(255,255,255,0.1)] flex items-center justify-center cursor-pointer transition-transform active:scale-95"
        title="Tap to change hand color"
      >
        {/* Hour Markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12 - 90;
          const rad = (angle * Math.PI) / 180;
          const radius = 135;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const num = i === 0 ? 12 : i;

          return (
            <div
              key={i}
              className="absolute text-sm font-bold font-mono text-white/80 select-none pointer-events-none"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {num}
            </div>
          );
        })}

        {/* Center Pivot */}
        <div className="absolute w-3 h-3 rounded-full bg-white z-20 shadow-md pointer-events-none" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-black z-30 pointer-events-none" />

        {/* Hour Hand */}
        <div
          className="absolute w-2 h-20 rounded-full origin-bottom z-10 transition-transform duration-300 pointer-events-none"
          style={{ backgroundColor: handColor, transform: `rotate(${hourAngle}deg)`, bottom: '50%' }}
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

      {/* Transparent Floating Overlay / Dialog with ONLY 4 Icon Options (NO text labels) */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowOverlay(false)}
        >
          <div
            className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center gap-5 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon 1: Lamborghini / Car (Sky Blue #38bdf8) */}
            <button
              type="button"
              onClick={() => {
                setHandColor('#38bdf8');
                setShowOverlay(false);
              }}
              className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/40 hover:bg-sky-500/40 flex items-center justify-center text-sky-400 transition-all hover:scale-110 active:scale-95 shadow-lg"
              title="Sky Blue"
            >
              <Car className="w-7 h-7" />
            </button>

            {/* Icon 2: Self / Boy (Green #22c55e) */}
            <button
              type="button"
              onClick={() => {
                setHandColor('#22c55e');
                setShowOverlay(false);
              }}
              className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/40 flex items-center justify-center text-emerald-400 transition-all hover:scale-110 active:scale-95 shadow-lg"
              title="Green"
            >
              <User className="w-7 h-7" />
            </button>

            {/* Icon 3: Instagram + YouTube / Editing (Pink #ec4899) */}
            <button
              type="button"
              onClick={() => {
                setHandColor('#ec4899');
                setShowOverlay(false);
              }}
              className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/40 hover:bg-pink-500/40 flex items-center justify-center text-pink-400 transition-all hover:scale-110 active:scale-95 shadow-lg"
              title="Pink"
            >
              <Video className="w-7 h-7" />
            </button>

            {/* Icon 4: Pen / Study (Orange #f97316) */}
            <button
              type="button"
              onClick={() => {
                setHandColor('#f97316');
                setShowOverlay(false);
              }}
              className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 hover:bg-orange-500/40 flex items-center justify-center text-orange-400 transition-all hover:scale-110 active:scale-95 shadow-lg"
              title="Orange"
            >
              <PenTool className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
