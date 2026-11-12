import React, { useState, useEffect } from 'react';
import { Car, User, Video, PenTool } from 'lucide-react';

interface WatchProps {
  handColor: string;
  icon: React.ReactNode;
}

const SingleWatch: React.FC<WatchProps> = ({ handColor, icon }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

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
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Circular Analog Watch Dial with 90% transparent background */}
      <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full border-4 border-white/20 bg-slate-950/10 backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.08)] flex items-center justify-center">
        {/* Hour Markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12 - 90;
          const rad = (angle * Math.PI) / 180;
          const radius = 85;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const num = i === 0 ? 12 : i;

          return (
            <div
              key={i}
              className="absolute text-xs font-bold font-mono text-white/80 select-none pointer-events-none"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {num}
            </div>
          );
        })}

        {/* Center Pivot */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-white z-20 shadow-sm pointer-events-none" />
        <div className="absolute w-1 h-1 rounded-full bg-black z-30 pointer-events-none" />

        {/* Hour Hand */}
        <div
          className="absolute w-1.5 h-14 rounded-full origin-bottom z-10 transition-transform duration-300 pointer-events-none"
          style={{ backgroundColor: handColor, transform: `rotate(${hourAngle}deg)`, bottom: '50%' }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-1 h-20 rounded-full bg-white/90 origin-bottom z-10 transition-transform duration-100 pointer-events-none"
          style={{ transform: `rotate(${minuteAngle}deg)`, bottom: '50%' }}
        />

        {/* Second Hand */}
        <div
          className="absolute w-0.5 h-24 rounded-full bg-rose-500 origin-bottom z-10 transition-transform duration-75 pointer-events-none"
          style={{ transform: `rotate(${secondAngle}deg)`, bottom: '50%' }}
        />
      </div>

      {/* Icon Below Watch (NO text labels anywhere) */}
      <div className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-white/90">
        {icon}
      </div>
    </div>
  );
};

export const AnalogWatchGrid: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-black grid grid-cols-2 gap-4 p-4 sm:p-8 items-center justify-items-center overflow-hidden m-0">
      <SingleWatch handColor="#38bdf8" icon={<Car className="w-6 h-6 text-sky-400" />} />
      <SingleWatch handColor="#22c55e" icon={<User className="w-6 h-6 text-emerald-400" />} />
      <SingleWatch handColor="#ec4899" icon={<Video className="w-6 h-6 text-pink-400" />} />
      <SingleWatch handColor="#f97316" icon={<PenTool className="w-6 h-6 text-orange-400" />} />
    </div>
  );
};
