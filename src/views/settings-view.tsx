import type { AppSettings, ThemeMode, WeekStart } from '../lib/types';
import { ACCENT_COLORS } from '../lib/constants/accent-colors';

interface SettingsViewProps {
  settings: AppSettings;
  appVersion: string;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onResetData: () => void;
}

const THEME_OPTIONS: { id: ThemeMode; icon: string; label: string }[] = [
  { id: 'light', icon: '☀️', label: 'Light' },
  { id: 'dark', icon: '🌙', label: 'Dark' },
  { id: 'system', icon: '💻', label: 'System' },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div className={`settings-toggle${on ? ' settings-toggle--on' : ''}`} onClick={onClick}>
      <div className="settings-toggle-knob" />
    </div>
  );
}

function SettingsView({ settings, appVersion, onUpdateSettings, onResetData }: SettingsViewProps) {
  const setWeekStart = (weekStartsOn: WeekStart) => onUpdateSettings({ weekStartsOn });

  return (
    <div className="view-main">
      <div className="view-header">
        <div>
          <h1 className="view-title">Settings</h1>
        </div>
      </div>

      <div className="settings-section">
        <div className="progress-section-label">Appearance</div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-row-title">Theme</div>
              <div className="settings-row-desc">Choose your preferred appearance</div>
            </div>
            <div className="segmented">
              {THEME_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className={`segmented-btn${settings.theme === opt.id ? ' segmented-btn--active' : ''}`}
                  onClick={() => onUpdateSettings({ theme: opt.id })}
                >
                  <span>{opt.icon}</span> {opt.label}
                </div>
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-title">Accent Color</div>
              <div className="settings-row-desc">Highlight color across the app</div>
            </div>
            <div className="accent-swatches">
              {ACCENT_COLORS.map((color) => (
                <div
                  key={color.id}
                  className={`accent-swatch${settings.accentColorId === color.id ? ' accent-swatch--selected' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                  title={color.label}
                  onClick={() => onUpdateSettings({ accentColorId: color.id })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="progress-section-label">General</div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-row-title">Week Starts On</div>
              <div className="settings-row-desc">First day of your week</div>
            </div>
            <div className="segmented">
              <div
                className={`segmented-btn${settings.weekStartsOn === 'monday' ? ' segmented-btn--active' : ''}`}
                onClick={() => setWeekStart('monday')}
              >
                Monday
              </div>
              <div
                className={`segmented-btn${settings.weekStartsOn === 'sunday' ? ' segmented-btn--active' : ''}`}
                onClick={() => setWeekStart('sunday')}
              >
                Sunday
              </div>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-title">Show Streaks</div>
              <div className="settings-row-desc">Display streak count on habit cards</div>
            </div>
            <Toggle on={settings.showStreaks} onClick={() => onUpdateSettings({ showStreaks: !settings.showStreaks })} />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-title">Show Completion %</div>
              <div className="settings-row-desc">Progress ring on Today view</div>
            </div>
            <Toggle
              on={settings.showCompletionPercent}
              onClick={() => onUpdateSettings({ showCompletionPercent: !settings.showCompletionPercent })}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="progress-section-label">Notifications</div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-row-title">Daily Reminder</div>
              <div className="settings-row-desc">Get a nudge to check in each day</div>
            </div>
            <Toggle
              on={settings.dailyReminderEnabled}
              onClick={() => onUpdateSettings({ dailyReminderEnabled: !settings.dailyReminderEnabled })}
            />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-title">Reminder Time</div>
              <div className="settings-row-desc">When should we remind you?</div>
            </div>
            <input
              type="time"
              className="settings-time-input"
              value={settings.reminderTime}
              onChange={(e) => onUpdateSettings({ reminderTime: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="progress-section-label">Data</div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-row-title settings-row-title--danger">Reset All Data</div>
              <div className="settings-row-desc">Permanently delete all habits &amp; history</div>
            </div>
            <button
              className="settings-btn settings-btn--danger"
              onClick={() => {
                if (window.confirm('Permanently delete all habits and history? This cannot be undone.')) {
                  onResetData();
                }
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="progress-section-label">About</div>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-title">Version</div>
            <div className="settings-row-desc">{appVersion || '—'}</div>
          </div>
          <div className="settings-row">
            <div className="settings-row-title">License</div>
            <div className="settings-license-badge">🎁 Free Forever</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
