import type { Habit } from '../lib/types';
import { TODAY_INDEX } from '../lib/types';
import { TODAY_LABEL } from '../lib/data/seed';
import CircularProgress from '../components/circular-progress';

interface TodayViewProps {
  habits: Habit[];
  onToggleToday: (habitId: string) => void;
  onEditHabit: (habitId: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

function TodayView({ habits, onToggleToday, onEditHabit, onDeleteHabit }: TodayViewProps) {
  const doneCount = habits.filter((h) => h.completions[TODAY_INDEX]).length;
  const percent = habits.length === 0 ? 0 : Math.round((doneCount / habits.length) * 100);

  return (
    <div className="view-main">
      <div className="view-header">
        <div>
          <h1 className="view-title">Today</h1>
          <p className="view-subtitle">
            {TODAY_LABEL} · {doneCount} of {habits.length} done
          </p>
        </div>
        <div className="today-header-right">
          <div className="today-count">
            <div className="today-count-value">
              {doneCount}/{habits.length}
            </div>
            <div className="today-count-label">completed</div>
          </div>
          <CircularProgress percent={percent} />
        </div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="habit-checklist">
        {habits.map((habit) => {
          const done = habit.completions[TODAY_INDEX];
          return (
            <div key={habit.id} className={`habit-row${done ? ' habit-row--done' : ''}`}>
              <button
                className={`habit-row-toggle${done ? ' habit-row-toggle--done' : ''}`}
                onClick={() => onToggleToday(habit.id)}
                aria-label={done ? `Mark ${habit.name} as not done` : `Mark ${habit.name} as done`}
              >
                {done && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5l2.5 2.5L9 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="habit-row-icon">{habit.icon}</span>
              <span className={`habit-row-name${done ? ' habit-row-name--done' : ''}`}>{habit.name}</span>
              <span className={`habit-row-streak${done ? ' habit-row-streak--done' : ''}`}>
                {habit.streak} day streak 🔥
              </span>
              <div className="habit-row-actions">
                <span className="habit-row-action" onClick={() => onEditHabit(habit.id)}>✏️</span>
                <span className="habit-row-action" onClick={() => onDeleteHabit(habit.id)}>🗑️</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodayView;
