import type { Habit } from '../lib/types';
import { DAY_LABELS, TODAY_INDEX } from '../lib/types';
import { WEEK_RANGE_LABEL, WEEK_DAY_DATES } from '../lib/data/seed';

interface WeeklyViewProps {
  habits: Habit[];
}

type CellStatus = 'done' | 'missed' | 'pending' | 'upcoming';

function getCellStatus(habit: Habit, dayIndex: number): CellStatus {
  if (dayIndex > TODAY_INDEX) return 'upcoming';
  if (dayIndex === TODAY_INDEX) return habit.completions[dayIndex] ? 'done' : 'pending';
  return habit.completions[dayIndex] ? 'done' : 'missed';
}

function Cell({ status }: { status: CellStatus }) {
  if (status === 'done') {
    return (
      <div className="week-cell-mark week-cell-mark--done">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M2 5.5l2.5 2.5L9 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === 'missed') {
    return (
      <div className="week-cell-mark week-cell-mark--missed">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M2 2l5 5M7 2L2 7" stroke="#e090b0" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (status === 'pending') {
    return <div className="week-cell-mark week-cell-mark--pending" />;
  }
  return <span className="week-cell-upcoming">·</span>;
}

function WeeklyView({ habits }: WeeklyViewProps) {
  const daysElapsed = TODAY_INDEX + 1;
  const totalPossible = habits.length * daysElapsed;
  const totalDone = habits.reduce(
    (sum, h) => sum + h.completions.slice(0, daysElapsed).filter(Boolean).length,
    0,
  );
  const completionRate = totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100);

  const dayTotals = DAY_LABELS.map((_, dayIndex) =>
    dayIndex < daysElapsed ? habits.filter((h) => h.completions[dayIndex]).length : -1,
  );
  const bestDayIndex = dayTotals.indexOf(Math.max(...dayTotals));

  return (
    <div className="view-main">
      <div className="view-header">
        <div>
          <h1 className="view-title">Weekly</h1>
          <p className="view-subtitle">{WEEK_RANGE_LABEL}</p>
        </div>
        <div className="week-nav">
          <div className="week-nav-arrow">←</div>
          <span className="week-nav-label">Week 3</span>
          <div className="week-nav-arrow week-nav-arrow--next">→</div>
        </div>
      </div>

      <div className="week-summary-row">
        <div className="week-summary-card week-summary-card--pink">
          <div className="week-summary-value">{completionRate}%</div>
          <div className="week-summary-label">Completion rate</div>
        </div>
        <div className="week-summary-card week-summary-card--purple">
          <div className="week-summary-value">{totalDone}</div>
          <div className="week-summary-label">Habits completed</div>
        </div>
        <div className="week-summary-card week-summary-card--green">
          <div className="week-summary-value">{DAY_LABELS[bestDayIndex]}</div>
          <div className="week-summary-label">Best day this week</div>
        </div>
        <div className="week-summary-card week-summary-card--orange">
          <div className="week-summary-value">↑8%</div>
          <div className="week-summary-label">vs last week</div>
        </div>
      </div>

      <div className="week-grid">
        <div className="week-grid-row week-grid-row--head">
          <div className="week-grid-habit-col week-grid-head-label">Habit</div>
          {DAY_LABELS.map((label, i) => (
            <div
              key={label}
              className={`week-grid-day-head${i === TODAY_INDEX ? ' week-grid-day-head--today' : ''}${i > TODAY_INDEX ? ' week-grid-day-head--future' : ''}`}
            >
              <div className="week-grid-day-label">{label}</div>
              <div className="week-grid-day-date">{WEEK_DAY_DATES[i]}</div>
            </div>
          ))}
        </div>
        {habits.map((habit, rowIndex) => (
          <div key={habit.id} className={`week-grid-row${rowIndex % 2 === 1 ? ' week-grid-row--alt' : ''}`}>
            <div className="week-grid-habit-col">
              <span className="week-grid-habit-icon">{habit.icon}</span>
              <span className="week-grid-habit-name">{habit.name}</span>
            </div>
            {DAY_LABELS.map((_, dayIndex) => (
              <div
                key={dayIndex}
                className={`week-grid-cell${dayIndex === TODAY_INDEX ? ' week-grid-cell--today' : ''}${dayIndex > TODAY_INDEX ? ' week-grid-cell--future' : ''}`}
              >
                <Cell status={getCellStatus(habit, dayIndex)} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="week-legend">
        <div className="week-legend-item">
          <div className="week-cell-mark week-cell-mark--done week-legend-swatch" />
          <span>Completed</span>
        </div>
        <div className="week-legend-item">
          <div className="week-cell-mark week-cell-mark--missed week-legend-swatch" />
          <span>Missed</span>
        </div>
        <div className="week-legend-item">
          <div className="week-cell-mark week-cell-mark--pending week-legend-swatch" />
          <span>Today (pending)</span>
        </div>
        <div className="week-legend-item">
          <span className="week-cell-upcoming">·</span>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}

export default WeeklyView;
