interface TitleBarProps {
  onNewHabit: () => void;
}

function TitleBar({ onNewHabit }: TitleBarProps) {
  return (
    <div className="titlebar">
      <button className="titlebar-new-btn" onClick={onNewHabit}>
        New Habit
      </button>
    </div>
  );
}

export default TitleBar;
