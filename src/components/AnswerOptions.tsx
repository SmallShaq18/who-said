import { motion } from 'framer-motion';

type AnswerOptionsProps = {
  options: string[];
  selected: string | null;
  revealed: boolean;
  correctAnswer: string;
  onSelect: (option: string) => void;
};

const LABELS = ['A', 'B', 'C', 'D'];

const AnswerOptions = ({ options, selected, revealed, correctAnswer, onSelect }: AnswerOptionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
      {options.map((option, i) => {
        const isCorrect = option === correctAnswer;
        const isSelected = option === selected;

        let bg = 'rgba(255,255,255,0.03)';
        let border = 'rgba(255,255,255,0.1)';
        let labelBg = 'rgba(255,255,255,0.06)';
        let labelColor = 'rgba(255,255,255,0.3)';
        let textColor = 'rgba(255,255,255,0.65)';
        let shadow = 'none';
        let icon: string | null = null;

        if (!revealed && isSelected) {
          bg = 'rgba(251,191,36,0.1)';
          border = 'rgba(251,191,36,0.5)';
          labelBg = 'rgba(251,191,36,0.15)';
          labelColor = '#fbbf24';
          textColor = '#fde68a';
          shadow = '0 0 20px rgba(251,191,36,0.1)';
        }

        if (revealed) {
          if (isCorrect) {
            bg = 'rgba(52,211,153,0.1)';
            border = 'rgba(52,211,153,0.45)';
            labelBg = 'rgba(52,211,153,0.15)';
            labelColor = '#34d399';
            textColor = '#6ee7b7';
            shadow = '0 0 20px rgba(52,211,153,0.1)';
            icon = '✓';
          } else if (isSelected && !isCorrect) {
            bg = 'rgba(239,68,68,0.1)';
            border = 'rgba(239,68,68,0.4)';
            labelBg = 'rgba(239,68,68,0.12)';
            labelColor = '#f87171';
            textColor = 'rgba(252,165,165,0.8)';
            shadow = '0 0 20px rgba(239,68,68,0.08)';
            icon = '✕';
          }
        }

        return (
          <motion.button
            key={i}
            onClick={() => onSelect(option)}
            disabled={revealed}
            whileHover={!revealed ? { scale: 1.02, y: -2 } : {}}
            whileTap={!revealed ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="relative flex items-center gap-4 rounded-xl text-left transition-all duration-300 overflow-hidden group"
            style={{
              background: bg,
              border: `1px solid ${border}`,
              boxShadow: shadow,
              padding: '0.875rem 1.125rem',
              cursor: revealed ? 'not-allowed' : 'pointer',
            }}
          >
            {!revealed && !isSelected && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)' }} />
            )}

            <div
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-all duration-300"
              style={{ background: labelBg, border: `1px solid ${border}`, color: labelColor, fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.05em' }}
            >
              {icon ?? LABELS[i]}
            </div>

            <span
              className="flex-1 font-medium transition-colors duration-300"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem', color: textColor, letterSpacing: '0.01em' }}
            >
              {option}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default AnswerOptions;

