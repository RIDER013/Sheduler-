import React, { useState, useEffect, useRef } from 'react';
import { DialPin, DialStyleConfig } from './types';
import { DEFAULT_DIAL_PINS, DEFAULT_DIAL_STYLE } from './data/presets';
import { DialStudio } from './components/DialStudio';

const STORAGE_KEY = 'routine_dial_studio_state_v1';
const THEME_STORAGE_KEY = 'routine_dial_theme_v1';

export default function App() {
  const [dialPins, setDialPins] = useState<DialPin[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dialPins && Array.isArray(parsed.dialPins)) {
          return parsed.dialPins;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_DIAL_PINS;
  });

  const [dialStyle, setDialStyle] = useState<DialStyleConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dialStyle) {
          return parsed.dialStyle;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_DIAL_STYLE;
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ dialPins, dialStyle })
      );
    } catch (e) {
      console.error('Failed to save dial state', e);
    }
  }, [dialPins, dialStyle]);

  const handleExportBackup = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ dialPins, dialStyle }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `routine_dial_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.dialPins)) {
            setDialPins(parsed.dialPins);
            if (parsed.dialStyle) setDialStyle(parsed.dialStyle);
            alert('Restored successfully!');
          }
        } catch {
          alert('Failed to parse backup file');
        }
      };
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-100 selection:text-amber-900 transition-colors">
      <main className="flex-1 w-full h-full overflow-hidden flex flex-col p-3 sm:p-5">
        <DialStudio
          pins={dialPins}
          styleConfig={dialStyle}
          onUpdatePins={setDialPins}
          onUpdateStyle={setDialStyle}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onExport={handleExportBackup}
          onImport={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportBackup}
          accept=".json"
          className="hidden"
        />
      </main>
    </div>
  );
}
