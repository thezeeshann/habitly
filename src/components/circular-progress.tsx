interface CircularProgressProps {
  percent: number;
}

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircularProgress({ percent }: CircularProgressProps) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <div className="ring">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={RADIUS} fill="none" style={{ stroke: 'var(--ring-track)' }} strokeWidth="5" />
        <circle
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 26 26)"
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'var(--accent-magenta)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--accent-deep-purple)' }} />
          </linearGradient>
        </defs>
      </svg>
      <span className="ring-label">{percent}%</span>
    </div>
  );
}

export default CircularProgress;
