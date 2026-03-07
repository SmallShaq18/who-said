export type GameMode = 'movie' | 'anime' | '';

export interface Theme {
  gradient: string;
  accentColor: string;
  progressColor: string;
  background: string;
  glowColor: string;
  buttonHover: string;
}

export const THEMES: Record<GameMode, Theme> = {
  movie: {
    gradient: 'from-slate-900 via-blue-900 to-amber-900',
    accentColor: '#FCD34D', // Amber/Yellow
    progressColor: 'bg-amber-400',
    background:
      'radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)',
    glowColor: 'shadow-lg shadow-amber-400/50',
    buttonHover: 'hover:bg-amber-400/20',
  },
  anime: {
    gradient: 'from-purple-900 via-pink-900 to-indigo-900',
    accentColor: '#EC4899', // Pink
    progressColor: 'bg-pink-400',
    background:
      'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
    glowColor: 'shadow-lg shadow-pink-400/50',
    buttonHover: 'hover:bg-pink-400/20',
  },
  '': {
    gradient: 'from-emerald-900 via-cyan-900 to-green-900',
    accentColor: '#4ADE80', // Green
    progressColor: 'bg-green-400',
    background:
      'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
    glowColor: 'shadow-lg shadow-green-400/50',
    buttonHover: 'hover:bg-green-400/20',
  },
};

export const getTheme = (mode: GameMode | null): Theme => {
  if (!mode) return THEMES[''];
  return THEMES[mode];
};
