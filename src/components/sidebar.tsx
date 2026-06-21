import type { Habit } from '../lib/types';

export type ViewKey = 'today' | 'weekly' | 'progress';

interface SidebarProps {
  habits: Habit[];
  activeView: ViewKey;
  todayRemaining: number;
  dimmed?: boolean;
  onSelectView: (view: ViewKey) => void;
  onEditHabit: (habitId: string) => void;
}

const NAV_ITEMS: { key: ViewKey; icon: string; label: string }[] = [
  { key: 'today', icon: '☀️', label: 'Today' },
  { key: 'weekly', icon: '📅', label: 'Weekly' },
  { key: 'progress', icon: '📊', label: 'Progress' },
];

function Sidebar({ habits, activeView, todayRemaining, dimmed, onSelectView, onEditHabit }: SidebarProps) {
  return (
    <aside className={`sidebar${dimmed ? ' sidebar--dimmed' : ''}`}>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`sidebar-nav-item${activeView === item.key ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => onSelectView(item.key)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className={`sidebar-nav-label${activeView === item.key ? ' sidebar-nav-label--active' : ''}`}>
              {item.label}
            </span>
            {item.key === 'today' && todayRemaining > 0 && (
              <span className="sidebar-nav-badge">{todayRemaining}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-divider" />
      <div className="sidebar-section-label">My Habits</div>
      <div className="sidebar-habit-list">
        {habits.map((habit) => (
          <div key={habit.id} className="sidebar-habit-item" onClick={() => onEditHabit(habit.id)}>
            <span className="sidebar-habit-icon">{habit.icon}</span>
            <span className="sidebar-habit-name">{habit.name}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-divider" />
      <div className="sidebar-nav-item sidebar-nav-item--settings">
        <span className="sidebar-nav-icon">⚙️</span>
        <span className="sidebar-nav-label">Settings</span>
      </div>
    </aside>
  );
}

export default Sidebar;
