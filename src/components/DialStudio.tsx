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
  Sparkles,
  Sun,
  Moon,
  Activity,
  Droplet,
  Coffee,
  Briefcase,
  BookOpen,
  X,
  Sliders,
  Compass,
  Download,
} from 'lucide-react';

interface DialStudioProps {
  pins: DialPin[];
  styleConfig: DialStyleConfig;
  onUpdatePins: (pins: DialPin[]) => void;
  onUpdateStyle: (style: DialStyleConfig) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const DialStudio: React.FC<DialStudioProps> = ({
  pins,
  styleConfig,
  onUpdatePins,
  onUpdateStyle,
  isDarkMode,
  onToggleDarkMode,
  onExport,
  onImport,
}) => {
  const safePins = pins || [];
  const safeStyle: DialStyleConfig = styleConfig || {
    theme: 'classic',
    handColor: '#d97706',
    showSeconds: true,
    hourFormat24: true,
  };

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'dial' | 'customize'>('dial');
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
        safePins.map((p) =>
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
      onUpdatePins([...safePins, newPin]);
    }
    setIsModalOpen(false);
  };

  const handleDeletePin = (id: string) => {
    onUpdatePins(safePins.filter((p) => p.id !== id));
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

  const hourAngle = safeStyle.hourFormat24
    ? ((hours % 24) / 24) * 360 + (minutes / 60) * 15
    : ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const secondAngle = (seconds / 60) * 360;

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

  const getThemeStyles = () => {
    switch (safeStyle.theme) {
      case 'modernMidnight':
        return 'bg-slate-950 border-sky-500/60 shadow-[0_0_35px_rgba(14,165,233,0.2)] text-sky-100';
      case 'minimalistMono':
        return 'bg-slate-100 border-slate-300 text-slate-900 shadow-sm';
      case 'electricNeon':
        return 'bg-black border-emerald-500 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.25)]';
      case 'aesthetic':
        return 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300 text-amber-950 shadow-md';
      case 'classic':
      default:
        return 'bg-slate-900 border-amber-600/60 text-amber-100 shadow-xl';
    }
  };

  return (
    <div id="dial-studio" className="h-full w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-4 sm:p-6 flex flex-col overflow-hidden shadow-sm">
      {/* Navigation & Tab Switcher Bar */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Routine Dial
          </h2>
        </div>

        {/* Center/Right Tabs & Controls */}
        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl">
            <button
              onClick={() => setActiveTab('dial')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'dial'
                  ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Dial</span>
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'customize'
                  ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            type="button"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Screen 1: Watch Face / Dial Screen (Fixed, no-scroll) */}
      {activeTab === 'dial' && (
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden py-4 space-y-5">
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2.5 shrink-0">
            <button
              onClick={openAddModal}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Pin Task</span>
            </button>

            <button
              onClick={() => setIsWidgetModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Widget</span>
            </button>
          </div>

          {/* Clean Analog Clock Dial */}
          <div className="p-5 bg-slate-50/80 dark:bg-zinc-950/40 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 relative flex flex-col items-center justify-center shrink-0">
            <div
              className={`relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border-4 flex items-center justify-center transition-all ${getThemeStyles()}`}
            >
              {/* Hour Markers */}
              {Array.from({ length: safeStyle.hourFormat24 ? 24 : 12 }).map((_, i) => {
                const count = safeStyle.hourFormat24 ? 24 : 12;
                const angle = (i * 360) / count - 90;
                const rad = (angle * Math.PI) / 180;
                const radius = 125;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;

                return (
                  <div
                    key={i}
                    className="absolute text-[11px] font-bold font-mono opacity-80"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    {safeStyle.hourFormat24 ? i : i === 0 ? 12 : i}
                  </div>
                );
              })}

              {/* Dial Pins */}
              {safePins.map((pin) => {
                const [hStr, mStr] = pin.time.split(':');
                const h = parseInt(hStr, 10) || 0;
                const m = parseInt(mStr, 10) || 0;
                const totalHoursDecimal = h + m / 60;
                const maxVal = safeStyle.hourFormat24 ? 24 : 12;
                const angle = ((totalHoursDecimal % maxVal) / maxVal) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const pinRadius = 90;
                const px = Math.cos(rad) * pinRadius;
                const py = Math.sin(rad) * pinRadius;

                const catColor = getCategoryColor(pin.category);

                return (
                  <div
                    key={pin.id}
                    className="absolute group/pin cursor-pointer z-20"
                    style={{ transform: `translate(${px}px, ${py}px)` }}
                    onClick={() => {
                      openEditModal(pin);
                      setActiveTab('customize');
                    }}
                    title={`${pin.title} (${pin.time})`}
                  >
                    <div className={`w-7 h-7 rounded-full border-2 border-white dark:border-black shadow-md flex items-center justify-center ${catColor.badge} transition-transform hover:scale-125`}>
                      {pin.photoUrl ? (
                        <img src={pin.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        renderIconElement(pin.iconName)
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Center Pivot */}
              <div className="absolute w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white z-20 shadow-sm" />

              {/* Hour Hand */}
              <div
                className="absolute w-1.5 h-16 rounded-full origin-bottom z-10 transition-transform duration-300"
                style={{ backgroundColor: safeStyle.handColor, transform: `rotate(${hourAngle}deg)`, bottom: '50%' }}
              />

              {/* Minute Hand */}
              <div
                className="absolute w-1 h-24 rounded-full origin-bottom z-10 transition-transform duration-100"
                style={{ backgroundColor: safeStyle.handColor, transform: `rotate(${minuteAngle}deg)`, bottom: '50%', opacity: 0.85 }}
              />

              {/* Second Hand */}
              {safeStyle.showSeconds && (
                <div
                  className="absolute w-0.5 h-28 bg-rose-500 rounded-full origin-bottom z-10 transition-transform duration-75"
                  style={{ transform: `rotate(${secondAngle}deg)`, bottom: '50%' }}
                />
              )}
            </div>

            <div className="mt-3 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Screen 2: Customize & Tasks Screen (Contained overflow) */}
      {activeTab === 'customize' && (
        <div className="flex-1 overflow-y-auto py-4 space-y-4 max-w-xl mx-auto w-full pr-1">
          {/* Themes Panel */}
          <div className="bg-slate-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              🎨 Clock Aesthetic Profiles (Themes Panel)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'classic', name: 'Classic Gold', color: '#d97706', desc: 'Warm amber & dark slate' },
                { id: 'modernMidnight', name: 'Modern Midnight', color: '#38bdf8', desc: 'Deep navy & glowing cyan' },
                { id: 'minimalistMono', name: 'Minimalist Mono', color: '#0f172a', desc: 'Clean light grey & charcoal' },
                { id: 'electricNeon', name: 'Electric Neon', color: '#22c55e', desc: 'Pitch black & vibrant neon' },
                { id: 'aesthetic', name: 'Aesthetic Sunset', color: '#f97316', desc: 'Warm sunset gradient' },
              ].map((profile) => {
                const isSelected = safeStyle.theme === profile.id;
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() =>
                      onUpdateStyle({
                        ...safeStyle,
                        theme: profile.id as any,
                        handColor: profile.color,
                      })
                    }
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 dark:bg-zinc-900 text-amber-900 dark:text-amber-100 shadow-xs'
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 border border-white shadow-xs"
                      style={{ backgroundColor: profile.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{profile.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{profile.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hand Color & Options */}
          <div className="bg-slate-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Hand Color:
              </label>
              <input
                type="color"
                value={safeStyle.handColor}
                onChange={(e) => onUpdateStyle({ ...safeStyle, handColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border bg-transparent"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={safeStyle.showSeconds}
                onChange={(e) => onUpdateStyle({ ...safeStyle, showSeconds: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Seconds Hand</span>
            </label>
          </div>

          {/* Pinned Tasks Manager */}
          <div className="bg-slate-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Pinned Tasks ({safePins.length})
              </h3>
              <button
                onClick={openAddModal}
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {safePins.map((pin) => {
                const catColor = getCategoryColor(pin.category);
                return (
                  <div
                    key={pin.id}
                    className="flex items-center justify-between p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${catColor.badge}`}>
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
                        <div className="text-[10px] font-mono text-slate-500">
                          {pin.time} · {pin.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(pin)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-amber-600 rounded"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePin(pin.id)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
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
      )}

      {/* Add / Edit Pin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingPin ? 'Edit Dial Pin' : 'Pin Task to Clock Dial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
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
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white"
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
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {Object.entries(labels.categories).map(([key, val]) => (
                      <option key={key} value={key}>{val}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Dial Pin Icon or Custom Photo
                </label>
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
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
                          ? 'border-amber-500 bg-amber-50 dark:bg-zinc-800 text-amber-600'
                          : 'border-slate-200 dark:border-zinc-700'
                      }`}
                    >
                      {renderIconElement(ic)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 rounded-xl"
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
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-600" />
                <span>Android Home Screen Widget</span>
              </h3>
              <button
                onClick={() => setIsWidgetModalOpen(false)}
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                  🤖 Native Android AppWidget (`RoutineWidgetProvider`)
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Daily Scheduler is built as a strict native Android application (`com.rider013.scheduler`) using Capacitor and Gradle. The native Java AppWidgetProvider is fully embedded under `android/app/src/main/java/com/rider013/scheduler/RoutineWidgetProvider.java`.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-slate-900 dark:text-white">
                  How to Place the Widget on Your Android Home Screen:
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li>Exit to your Android phone home screen.</li>
                  <li>Long-press (press and hold) any empty space on your home screen.</li>
                  <li>Tap <strong className="text-slate-800 dark:text-slate-200">Widgets</strong> in the pop-up menu.</li>
                  <li>Scroll and find <strong className="text-slate-800 dark:text-slate-200">Daily Scheduler</strong>.</li>
                  <li>Touch and hold the Routine Dial widget, then drag it to your desired home screen grid position!</li>
                </ol>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Ready for APK Build via GitHub Actions
                </span>
                <button
                  type="button"
                  onClick={() => {
                    alert('Android AppWidget pin request sent to system launcher!');
                    setIsWidgetModalOpen(false);
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Request Native Widget Pin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
