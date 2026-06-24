export interface AccentColor {
  id: string;
  label: string;
  from: string;
  to: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'magenta', label: 'Magenta', from: '#c840a0', to: '#7030c0' },
  { id: 'blue', label: 'Blue', from: '#3080e0', to: '#6040d0' },
  { id: 'green', label: 'Green', from: '#20a060', to: '#40c080' },
  { id: 'orange', label: 'Orange', from: '#e06020', to: '#e0a020' },
  { id: 'red', label: 'Red', from: '#e04060', to: '#c02080' },
];

export const DEFAULT_ACCENT_COLOR_ID = 'magenta';

export function getAccentColor(id: string): AccentColor {
  return ACCENT_COLORS.find((c) => c.id === id) ?? ACCENT_COLORS[0];
}
