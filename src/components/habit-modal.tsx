import { useState } from 'react';
import type { Habit } from '../lib/types';
import { DAY_LABELS, ICON_CHOICES } from '../lib/types';

interface HabitModalProps {
  habit: Habit | null;
  onSave: (data: { name: string; icon: string; repeatDays: boolean[] }) => void;
  onDelete: () => void;
  onClose: () => void;
}

function HabitModal({ habit, onSave, onDelete, onClose }: HabitModalProps) {
  const isEdit = habit !== null;
  const [name, setName] = useState(habit?.name ?? '');
  const [icon, setIcon] = useState(habit?.icon ?? ICON_CHOICES[0]);
  const [repeatDays, setRepeatDays] = useState<boolean[]>(habit?.repeatDays ?? [true, true, true, true, true, true, true]);

  const toggleDay = (index: number) => {
    setRepeatDays((days) => days.map((d, i) => (i === index ? !d : d)));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, repeatDays });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Habit' : 'New Habit'}</h2>
          <div className="modal-close" onClick={onClose}>✕</div>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label">HABIT NAME</label>
            <input
              className="modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Run"
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">ICON</label>
            <div className="icon-picker">
              {ICON_CHOICES.map((choice) => (
                <div
                  key={choice}
                  className={`icon-option${icon === choice ? ' icon-option--selected' : ''}`}
                  onClick={() => setIcon(choice)}
                >
                  {choice}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-field">
            <label className="modal-label">REPEAT</label>
            <div className="repeat-picker">
              {DAY_LABELS.map((label, i) => (
                <div
                  key={label}
                  className={`repeat-day${repeatDays[i] ? ' repeat-day--active' : ''}`}
                  onClick={() => toggleDay(i)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {isEdit && (
            <button className="modal-btn modal-btn--delete" onClick={onDelete}>
              Delete Habit
            </button>
          )}
          <button className="modal-btn modal-btn--save" onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Add Habit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitModal;
