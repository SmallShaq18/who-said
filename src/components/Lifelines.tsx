import { motion } from 'framer-motion';
import type { Lifelines } from '../hooks/useGameLogic';

type LifelinesProps = {
  handleFifty: () => void;
  handleExtraTime: () => void;
  handleHint: () => void;
  lifelines: Lifelines;
};

const lifelinesData = [
  {
    id: 'fifty',
    label: '50/50',
    icon: '◑',
    description: 'Remove two wrong answers',
    accent: 'rgba(96,165,250,1)',
    accentDim: 'rgba(96,165,250,0.1)',
    accentBorder: 'rgba(96,165,250,0.35)',
  },
  {
    id: 'extraTime',
    label: '+5 SEC',
    icon: '◷',
    description: 'Add five seconds',
    accent: 'rgba(52,211,153,1)',
    accentDim: 'rgba(52,211,153,0.1)',
    accentBorder: 'rgba(52,211,153,0.35)',
  },
  {
    id: 'hint',
    label: 'HINT',
    icon: '◈',
    description: 'Get a clue',
    accent: 'rgba(251,191,36,1)',
    accentDim: 'rgba(251,191,36,0.1)',
    accentBorder: 'rgba(251,191,36,0.35)',
  },
];

const LifelinesComponent = ({ handleFifty, handleExtraTime, handleHint, lifelines }: LifelinesProps) => {
  const handlers = [handleFifty, handleExtraTime, handleHint];

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {lifelinesData.map((data, i) => {
        const isUsed = lifelines[data.id as keyof Lifelines];

        return (
          <motion.button
            key={data.id}
            onClick={handlers[i]}
            disabled={isUsed}
            whileHover={!isUsed ? { scale: 1.05, y: -2 } : {}}
            whileTap={!isUsed ? { scale: 0.95 } : {}}
            className="group relative flex items-center gap-2 rounded-xl transition-all duration-300"
            style={{
              padding: '0.45rem 0.9rem',
              background: isUsed ? 'rgba(255,255,255,0.02)' : data.accentDim,
              border: `1px solid ${isUsed ? 'rgba(255,255,255,0.07)' : data.accentBorder}`,
              opacity: isUsed ? 0.35 : 1,
              cursor: isUsed ? 'not-allowed' : 'pointer',
              boxShadow: isUsed ? 'none' : `0 0 16px ${data.accentDim}`,
            }}
            title={data.description}
          >
            {/* Icon */}
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                color: isUsed ? 'rgba(255,255,255,0.2)' : data.accent,
                lineHeight: 1,
              }}
            >
              {data.icon}
            </span>

            {/* Label */}
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                color: isUsed ? 'rgba(255,255,255,0.2)' : data.accent,
                fontWeight: 600,
              }}
            >
              {data.label}
            </span>

            {/* Used strike overlay */}
            {isUsed && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.15)', transform: 'rotate(-8deg)' }} />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default LifelinesComponent;

/*import { motion } from 'framer-motion';
import type { Lifelines } from '../hooks/useGameLogic';

type LifelinesProps = {
  handleFifty: () => void;
  handleExtraTime: () => void;
  handleHint: () => void;
  lifelines: Lifelines;
};

const lifelinesData = [
  {
    id: 'fifty',
    label: '50/50',
    icon: '💡',
    color: 'from-blue-500 to-blue-600',
    accentColor: 'border-blue-400 shadow-blue-400/50',
  },
  {
    id: 'extraTime',
    label: '+5s',
    icon: '⏱️',
    color: 'from-green-500 to-green-600',
    accentColor: 'border-green-400 shadow-green-400/50',
  },
  {
    id: 'hint',
    label: 'Hint',
    icon: '🔍',
    color: 'from-amber-500 to-amber-600',
    accentColor: 'border-amber-400 shadow-amber-400/50',
  },
];

const LifelinesComponent = ({
  handleFifty,
  handleExtraTime,
  handleHint,
  lifelines,
}: LifelinesProps) => {
  const handlers = [handleFifty, handleExtraTime, handleHint];

  return (
    <div className="flex gap-4 mb-8 flex-wrap justify-center">
      {lifelinesData.map((data, i) => {
        const isUsed = lifelines[data.id as keyof Lifelines];

        return (
          <motion.button
            key={data.id}
            onClick={handlers[i]}
            disabled={isUsed}
            whileHover={!isUsed ? { scale: 1.05, y: -2 } : {}}
            whileTap={!isUsed ? { scale: 0.95 } : {}}
            className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 backdrop-blur-lg border-2 ${
              isUsed
                ? 'bg-gray-600/20 border-gray-500/30 opacity-40 cursor-not-allowed'
                : `bg-gradient-to-br ${data.color} border-2 ${data.accentColor} shadow-lg hover:shadow-lg text-white`
            }`}
          >
            <span className="mr-1">{data.icon}</span>
            {data.label}
          </motion.button>
        );
      })}
    </div>
  );
};

export default LifelinesComponent;*/
