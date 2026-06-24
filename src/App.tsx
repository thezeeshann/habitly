import { useEffect, useRef, useState } from 'react';
import type { AppSettings, Habit, HistoryEntry } from './lib/types';
import { DEFAULT_SETTINGS, TODAY_INDEX } from './lib/types';
import { SEED_HABITS } from './lib/data/seed';
import { getAccentColor } from './lib/constants/accent-colors';
import TitleBar from './components/title-bar';
import Sidebar, { type ViewKey } from './components/sidebar';
import HabitModal from './components/habit-modal';
import TodayView from './views/today-view';
import WeeklyView from './views/weekly-view';
import ProgressView from './views/progress-view';
import SettingsView from './views/settings-view';

type ModalState = { mode: 'add' } | { mode: 'edit'; habitId: string } | null;

const HISTORY_LIMIT = 30;

function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [habits, setHabits] = useState<Habit[]>(SEED_HABITS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeView, setActiveView] = useState<ViewKey>('today');
  const [modal, setModal] = useState<ModalState>(null);
  const [ready, setReady] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const lastReminderFiredRef = useRef<string | null>(null);

  useEffect(() => {
    window.habitly.load().then((persisted) => {
      if (persisted) {
        setHabits(persisted.habits);
        setHistory(persisted.history);
        if (persisted.settings) setSettings(persisted.settings);
      }
      setReady(true);
    });
    window.habitly.getVersion().then(setAppVersion);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.habitly.save({ habits, history, settings });
  }, [ready, habits, history, settings]);

  useEffect(() => {
    const key = todayDateKey();
    const completed = habits.filter((h) => h.completions[TODAY_INDEX]).length;
    const total = habits.length;
    setHistory((prev) => {
      const rest = prev.filter((entry) => entry.date !== key);
      return [...rest, { date: key, completed, total }]
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .slice(-HISTORY_LIMIT);
    });
  }, [habits]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(media.matches);
    const listener = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && systemPrefersDark);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  useEffect(() => {
    const accent = getAccentColor(settings.accentColorId);
    document.documentElement.style.setProperty('--accent-magenta', accent.from);
    document.documentElement.style.setProperty('--accent-deep-purple', accent.to);
  }, [settings.accentColorId]);

  useEffect(() => {
    if (!settings.dailyReminderEnabled) return;
    const interval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const current = `${hh}:${mm}`;
      const todayKey = todayDateKey();
      if (current === settings.reminderTime && lastReminderFiredRef.current !== todayKey) {
        lastReminderFiredRef.current = todayKey;
        if (Notification.permission === 'granted') {
          new Notification('Habitly', { body: "Don't forget to check in on today's habits." });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }
    }, 20_000);
    return () => clearInterval(interval);
  }, [settings.dailyReminderEnabled, settings.reminderTime]);

  const todayRemaining = habits.filter((h) => !h.completions[TODAY_INDEX]).length;
  const editingHabit = modal?.mode === 'edit' ? habits.find((h) => h.id === modal.habitId) ?? null : null;

  const toggleToday = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const nowDone = !h.completions[TODAY_INDEX];
        const completions = h.completions.map((v, i) => (i === TODAY_INDEX ? nowDone : v));
        return { ...h, completions, streak: nowDone ? h.streak + 1 : Math.max(0, h.streak - 1) };
      }),
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setModal(null);
  };

  const saveHabit = (data: { name: string; icon: string; repeatDays: boolean[] }) => {
    if (modal?.mode === 'edit') {
      setHabits((prev) =>
        prev.map((h) => (h.id === modal.habitId ? { ...h, name: data.name, icon: data.icon, repeatDays: data.repeatDays } : h)),
      );
    } else {
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: data.name,
        icon: data.icon,
        repeatDays: data.repeatDays,
        streak: 0,
        completions: [false, false, false, false, false, false, false],
      };
      setHabits((prev) => [...prev, newHabit]);
    }
    setModal(null);
  };

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const resetData = () => {
    setHabits([]);
    setHistory([]);
  };

  return (
    <div className="app-window">
      <TitleBar onNewHabit={() => setModal({ mode: 'add' })} />
      <div className="app-body">
        <Sidebar
          habits={habits}
          activeView={activeView}
          todayRemaining={todayRemaining}
          dimmed={modal !== null}
          isDark={isDark}
          onSelectView={setActiveView}
          onEditHabit={(habitId) => setModal({ mode: 'edit', habitId })}
          onToggleDark={(dark) => updateSettings({ theme: dark ? 'dark' : 'light' })}
        />
        <div className="app-content">
          {activeView === 'today' && (
            <TodayView
              habits={habits}
              showStreaks={settings.showStreaks}
              showCompletionPercent={settings.showCompletionPercent}
              onToggleToday={toggleToday}
              onEditHabit={(habitId) => setModal({ mode: 'edit', habitId })}
              onDeleteHabit={deleteHabit}
            />
          )}
          {activeView === 'weekly' && <WeeklyView habits={habits} />}
          {activeView === 'progress' && <ProgressView habits={habits} history={history} />}
          {activeView === 'settings' && (
            <SettingsView
              settings={settings}
              appVersion={appVersion}
              onUpdateSettings={updateSettings}
              onResetData={resetData}
            />
          )}

          {modal !== null && (
            <HabitModal
              habit={editingHabit}
              onSave={saveHabit}
              onDelete={() => modal.mode === 'edit' && deleteHabit(modal.habitId)}
              onClose={() => setModal(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
