import { useState } from 'react';
import type { Habit, HistoryEntry } from '../lib/types';
import { DAY_LABELS, TODAY_INDEX } from '../lib/types';

interface ProgressViewProps {
  habits: Habit[];
  history: HistoryEntry[];
}

function entryPercent(entry: HistoryEntry): number {
  return entry.total === 0 ? 0 : Math.round((entry.completed / entry.total) * 100);
}

function heatLevel(ratio: number, hasOccurred: boolean): string {
  if (!hasOccurred) return 'heat--future';
  if (ratio === 1) return 'heat--full';
  if (ratio >= 0.7) return 'heat--high';
  if (ratio >= 0.4) return 'heat--mid';
  return 'heat--low';
}

function ProgressView({ habits, history }: ProgressViewProps) {
  const [range, setRange] = useState<'week' | 'month'>('week');

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const daysElapsed = TODAY_INDEX + 1;
  const totalPossible = habits.length * daysElapsed;
  const totalDone = habits.reduce(
    (sum, h) => sum + h.completions.slice(0, daysElapsed).filter(Boolean).length,
    0,
  );
  const thisWeekPercent = totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100);

  const ranked = [...habits].sort((a, b) => b.streak - a.streak);

  const monthAverage =
    history.length === 0 ? 0 : Math.round(history.reduce((sum, e) => sum + entryPercent(e), 0) / history.length);
  const monthBest = history.reduce((max, e) => Math.max(max, entryPercent(e)), 0);

  return (
    <div className="view-main">
      <div className="view-header">
        <div>
          <h1 className="view-title">Progress</h1>
          <p className="view-subtitle">June 2026 · Week 3</p>
        </div>
        <div className="range-toggle">
          <div
            className={`range-toggle-btn${range === 'week' ? ' range-toggle-btn--active' : ''}`}
            onClick={() => setRange('week')}
          >
            Week
          </div>
          <div
            className={`range-toggle-btn${range === 'month' ? ' range-toggle-btn--active' : ''}`}
            onClick={() => setRange('month')}
          >
            Month
          </div>
        </div>
      </div>

      {range === 'month' ? (
        history.length === 0 ? (
          <p className="progress-coming-soon">Come back daily — your month view fills in as you use Habitly.</p>
        ) : (
          <>
            <div className="progress-stats-row">
              <div className="progress-stat-card progress-stat-card--pink">
                <div className="progress-stat-value">{monthAverage}%</div>
                <div className="progress-stat-label">Average completion</div>
              </div>
              <div className="progress-stat-card progress-stat-card--purple">
                <div className="progress-stat-value">{monthBest}%</div>
                <div className="progress-stat-label">Best day</div>
              </div>
              <div className="progress-stat-card progress-stat-card--blue">
                <div className="progress-stat-value">{history.length}</div>
                <div className="progress-stat-label">Days tracked</div>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-section-label">Last {history.length} {history.length === 1 ? 'Day' : 'Days'}</div>
              <div className="month-chart">
                {history.map((entry) => (
                  <div className="month-bar-col" key={entry.date} title={`${entry.date}: ${entry.completed}/${entry.total}`}>
                    <div className="month-bar-track">
                      <div className="month-bar-fill" style={{ height: `${entryPercent(entry)}%` }} />
                    </div>
                    <div className="month-bar-day">{Number(entry.date.slice(8, 10))}</div>
                  </div>
                ))}
              </div>
              <p className="month-chart-hint">Hover a bar to see that day's completion.</p>
            </div>
          </>
        )
      ) : (
        <>
          <div className="progress-stats-row">
            <div className="progress-stat-card progress-stat-card--pink">
              <div className="progress-stat-value">{bestStreak}</div>
              <div className="progress-stat-label">Best streak 🔥</div>
            </div>
            <div className="progress-stat-card progress-stat-card--purple">
              <div className="progress-stat-value">{thisWeekPercent}%</div>
              <div className="progress-stat-label">This week</div>
            </div>
            <div className="progress-stat-card progress-stat-card--blue">
              <div className="progress-stat-value">{history.length}</div>
              <div className="progress-stat-label">Days tracked</div>
            </div>
            <div className="progress-stat-card progress-stat-card--orange">
              <div className="progress-stat-value">{habits.length}</div>
              <div className="progress-stat-label">Active habits</div>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-section-label">This Week</div>
            <div className="heatmap-row">
              {DAY_LABELS.map((label, i) => {
                const hasOccurred = i <= TODAY_INDEX;
                const count = hasOccurred ? habits.filter((h) => h.completions[i]).length : 0;
                const ratio = hasOccurred && habits.length > 0 ? count / habits.length : 0;
                return (
                  <div className="heatmap-col" key={label}>
                    <div className="heatmap-day-label">{label}</div>
                    <div className={`heatmap-bar ${heatLevel(ratio, hasOccurred)}`}>
                      {hasOccurred ? `${count}/${habits.length}` : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-section-label">Habit Streaks</div>
            <div className="streak-list">
              {ranked.map((habit) => (
                <div className="streak-row" key={habit.id}>
                  <span className="streak-icon">{habit.icon}</span>
                  <span className="streak-name">{habit.name}</span>
                  <div className="streak-track">
                    <div
                      className="streak-fill"
                      style={{ width: `${bestStreak === 0 ? 0 : (habit.streak / bestStreak) * 100}%` }}
                    />
                  </div>
                  <span className="streak-value">{habit.streak} days</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProgressView;
