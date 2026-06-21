import { useEffect, useState } from 'react';
import type { Habit, HistoryEntry } from './lib/types';
import { TODAY_INDEX } from './lib/types';
import { SEED_HABITS } from './lib/data/seed';
import TitleBar from './components/title-bar';
import Sidebar, { type ViewKey } from './components/sidebar';
import HabitModal from './components/habit-modal';
import TodayView from './views/today-view';
import WeeklyView from './views/weekly-view';
import ProgressView from './views/progress-view';

type ModalState = { mode: 'add' } | { mode: 'edit'; habitId: string } | null;

const HISTORY_LIMIT = 30;

function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [habits, setHabits] = useState<Habit[]>(SEED_HABITS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeView, setActiveView] = useState<ViewKey>('today');
  const [modal, setModal] = useState<ModalState>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.habitly.load().then((persisted) => {
      if (persisted) {
        setHabits(persisted.habits);
        setHistory(persisted.history);
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.habitly.save({ habits, history });
  }, [ready, habits, history]);

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

  return (
    <div className="app-window">
      <TitleBar onNewHabit={() => setModal({ mode: 'add' })} />
      <div className="app-body">
        <Sidebar
          habits={habits}
          activeView={activeView}
          todayRemaining={todayRemaining}
          dimmed={modal !== null}
          onSelectView={setActiveView}
          onEditHabit={(habitId) => setModal({ mode: 'edit', habitId })}
        />
        <div className="app-content">
          {activeView === 'today' && (
            <TodayView
              habits={habits}
              onToggleToday={toggleToday}
              onEditHabit={(habitId) => setModal({ mode: 'edit', habitId })}
              onDeleteHabit={deleteHabit}
            />
          )}
          {activeView === 'weekly' && <WeeklyView habits={habits} />}
          {activeView === 'progress' && <ProgressView habits={habits} history={history} />}

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
