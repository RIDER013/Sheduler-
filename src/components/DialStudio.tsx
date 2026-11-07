import React, { useState, useEffect, useRef } from 'react';
import { DialPin, DialStyleConfig, CategoryType } from '../types';
import { labels, getCategoryColor } from '../data/translations';
import {
  Clock,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Activity,
  Droplet,
  Coffee,
  Briefcase,
  BookOpen,
  X,
  Share2,
} from 'lucide-react';

interface DialStudioProps {
  pins: DialPin[];
  styleConfig: DialStyleConfig;
  onUpdatePins: (pins: DialPin[]) => void;
  onUpdateStyle: (style: DialStyleConfig) => void;
}

export const DialStudio: React.FC<DialStudioProps> = ({
  pins,
  styleConfig,
  onUpdatePins,
  onUpdateStyle,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<DialPin | null>(null);

  // Form states for Pin
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [category, setCategory] = useState<CategoryType>('work');
  const [iconName, setIconName] = useState('work');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openAddModal = () => {
    setEditingPin(null);
    setTitle('');
    setTime('09:00');
    setCategory('work');
    setIconName('work');
    setPhotoUrl(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (pin: DialPin) => {
    setEditingPin(pin);
    setTitle(pin.title);
    setTime(pin.time);
    setCategory(pin.category);
    setIconName(pin.iconName || 'sparkles');
    setPhotoUrl(pin.photoUrl);
    setIsModalOpen(true);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingPin) {
      onUpdatePins(
        pins.map((p) =>
          p.id === editingPin.id
            ? { ...p, title: title.trim(), time, category, iconName, photoUrl }
            : p
        )
      );
    } else {
      const newPin: DialPin = {
        id: `pin-${Date.now()}`,
        title: title.trim(),
        time,
        category,
        iconName,
        photoUrl,
      };
      onUpdatePins([...pins, newPin]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePin = (id: string) => {
    onUpdatePins(pins.filter((p) => p.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate hands angles
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // 12-hour or 24-hour angle calculation
  const hourAngle = styleConfig.hourFormat24
    ? ((hours % 24) / 24) * 360 + (minutes / 60) * 15
    : ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const secondAngle = (seconds / 60) * 360;

  // Render Icon helper
  const renderIconElement = (icon?: string) => {
    switch (icon) {
      case 'gym':
        return <Activity className="w-4 h-4 text-emerald-500" />;
      case 'study':
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-purple-500" />;
      case 'water':
        return <Droplet className="w-4 h-4 text-sky-500" />;
      case 'food':
        return <Coffee className="w-4 h-4 text-orange-500" />;
      case 'work':
        return <Briefcase className="w-4 h-4 text-amber-500" />;
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  // Theme styles
  const getThemeStyles = () => {
    switch (styleConfig.theme) {
      case 'neon':
        return 'bg-slate-950 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] text-cyan-100';
      case 'minimal':
        return 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white';
      case 'aesthetic':
        return 'bg-gradient-to-br from-amber-50/90 to-orange-100/80 dark:from-slate-900 dark:to-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-100';
      case 'classic':
      default:
        return 'bg-slate-900 border-slate-700 text-slate-100 shadow-xl';
    }
  };

  return (
    <div id="dial-studio" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
            <Clock className="w-4 h-4" />
            <span>CUSTOM DIAL STUDIO & ANALOG WIDGET</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Routine Dial Studio & Watch Face
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Design your custom analog clock face, pin tasks with photos or icons around the dial, and generate your phone widget.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsWidgetModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Add to Home Screen Widget</span>
          </button>

          <button
            onClick={openAddModal}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Pin Task to Dial</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left: Interactive Analog Clock Dial Preview (Col 7) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-50/80 dark:bg-slate-950/40 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
          {/* Dial Face Container */}
          <div
            className={`relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full border-4 flex items-center justify-center transition-all ${getThemeStyles()}`}
          >
            {/* Hour Markers (1 to 12 or 24) */}
            {Array.from({ length: styleConfig.hourFormat24 ? 24 : 12 }).map((_, i) => {
              const count = styleConfig.hourFormat24 ? 24 : 12;
              const angle = (i * 360) / count - 90;
              const rad = (angle * Math.PI) / 180;
              const radius = 135; // distance from center
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <div
                  key={i}
                  className="absolute text-[11px] font-bold font-mono opacity-80"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {styleConfig.hourFormat24 ? i : i === 0 ? 12 : i}
                </div>
              );
            })}

            {/* Dial Pins / Markers positioned around the circle */}
            {pins.map((pin) => {
              const [hStr, mStr] = pin.time.split(':');
              const h = parseInt(hStr, 10) || 0;
              const m = parseInt(mStr, 10) || 0;
              const totalHoursDecimal = h + m / 60;
              const count = styleConfig.hourFormat24 ? 24 : 12;
              const maxVal = styleConfig.hourFormat24 ? 24 : 12;
              const angle = ((totalHoursDecimal % maxVal) / maxVal) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const pinRadius = 100; // inner radius for pins
              const px = Math.cos(rad) * pinRadius;
              const py = Math.sin(rad) * pinRadius;

              const catColor = getCategoryColor(pin.category);

              return (
                <div
                  key={pin.id}
                  className="absolute group/pin cursor-pointer z-20"
                  style={{
                    transform: `translate(${px}px, ${py}px)`,
                  }}
                  onClick={() => openEditModal(pin)}
                  title={`${pin.title} (${pin.time})`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center ${catColor.badge} transition-transform hover:scale-125`}>
                    {pin.photoUrl ? (
                      <img
                        src={pin.photoUrl}
                        alt={pin.title}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      renderIconElement(pin.iconName)
                    )}
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/pin:flex flex-col items-center pointer-events-none z-30">
                    <div className="bg-slate-900 text-white text-[10px] font-medium py-1 px-2 rounded-md shadow-lg whitespace-nowrap">
                      {pin.time} - {pin.title}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center Pivot */}
            <div className="absolute w-3 h-3 rounded-full bg-slate-900 dark:bg-white z-20 shadow-sm" />

            {/* Hour Hand */}
            <div
              className="absolute w-1.5 h-20 rounded-full origin-bottom z-10 transition-transform duration-300"
              style={{
                backgroundColor: styleConfig.handColor,
                transform: `rotate(${hourAngle}deg)`,
                bottom: '50%',
              }}
            />

            {/* Minute Hand */}
            <div
              className="absolute w-1 h-28 rounded-full origin-bottom z-10 transition-transform duration-100"
              style={{
                backgroundColor: styleConfig.handColor,
                transform: `rotate(${minuteAngle}deg)`,
                bottom: '50%',
                opacity: 0.85,
              }}
            />

            {/* Second Hand */}
            {styleConfig.showSeconds && (
              <div
                className="absolute w-0.5 h-32 bg-rose-500 rounded-full origin-bottom z-10 transition-transform duration-75"
                style={{
                  transform: `rotate(${secondAngle}deg)`,
                  bottom: '50%',
                }}
              />
            )}
          </div>

          {/* Clock Live Readout */}
          <div className="mt-4 text-center font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>

        {/* Right: Dial Customization & Pinned Tasks List (Col 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Dial Style Controls */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Dial Face Appearance
            </h3>

            {/* Theme Selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                Theme Style
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['classic', 'minimal', 'neon', 'aesthetic'] as const).map((th) => (
                  <button
                    key={th}
                    type="button"
                    onClick={() => onUpdateStyle({ ...styleConfig, theme: th })}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border capitalize transition-all ${
                      styleConfig.theme === th
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {th}
                  </button>
                ))}
              </div>
            </div>

            {/* Hand Color & Options */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Hand Accent Color:
                </label>
                <input
                  type="color"
                  value={styleConfig.handColor}
                  onChange={(e) => onUpdateStyle({ ...styleConfig, handColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600 bg-transparent"
                />
              </div>

              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={styleConfig.showSeconds}
                    onChange={(e) => onUpdateStyle({ ...styleConfig, showSeconds: e.target.checked })}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Seconds Hand</span>
                </label>
              </div>
            </div>
          </div>

          {/* Pinned Tasks List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Pinned Dial Tasks ({pins.length})
              </h3>
              <span className="text-[11px] text-slate-400">Click any pin to edit</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {pins.map((pin) => {
                const catColor = getCategoryColor(pin.category);
                return (
                  <div
                    key={pin.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${catColor.badge}`}>
                        {pin.photoUrl ? (
                          <img src={pin.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          renderIconElement(pin.iconName)
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {pin.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {pin.time} · {pin.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(pin)}
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded transition-colors"
                        title="Edit Pin"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePin(pin.id)}
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                        title="Delete Pin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Pin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingPin ? 'Edit Dial Pin' : 'Pin Task to Clock Dial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Task / Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Jog, Client Meeting..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Time Position *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {Object.entries(labels.categories).map(([key, val]) => (
                      <option key={key} value={key}>{val}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Icon or Photo Upload selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Dial Pin Icon or Custom Photo
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    {['work', 'gym', 'study', 'sleep', 'water', 'food', 'sun'].map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => {
                          setIconName(ic);
                          setPhotoUrl(undefined);
                        }}
                        className={`p-2 rounded-xl border transition-all ${
                          iconName === ic && !photoUrl
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-600'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {renderIconElement(ic)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>Upload Custom Photo</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {photoUrl && (
                    <div className="flex items-center gap-2">
                      <img src={photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border" />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(undefined)}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
                >
                  Save Pin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add to Home Screen Widget Modal */}
      {isWidgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-600" />
                <span>Add to Home Screen Widget</span>
              </h3>
              <button
                onClick={() => setIsWidgetModalOpen(false)}
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                  📱 Android Native AppWidget Integration
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  This repository is fully configured with Capacitor (`com.rider013.scheduler`) and GitHub Actions for automated Android APK builds. The native Java AppWidgetProvider (`RoutineWidgetProvider.java`) is included under `android/app/src/main/java/com/rider013/scheduler/` so users can place your custom routine dial directly on their Android home screen.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-slate-900 dark:text-white">
                  🌐 Web / PWA Home Screen Widget Instructions:
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li>Open this app in your mobile browser (Chrome or Safari).</li>
                  <li>Tap the browser menu (3 dots or Share icon).</li>
                  <li>Select <strong className="text-slate-800 dark:text-slate-200">"Add to Home Screen"</strong> or <strong className="text-slate-800 dark:text-slate-200">"Install App"</strong>.</li>
                  <li>The Routine Dial Studio will launch instantly as a standalone app icon on your home screen!</li>
                </ol>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsWidgetModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
                >
                  Got It!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
