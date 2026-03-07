import { motion, AnimatePresence } from 'framer-motion';
import type { Quote } from '../services/quoteService';

type QuoteDisplayProps = {
  quote: Quote | null;
  revealed: boolean;
};

const QuoteDisplay = ({ quote, revealed }: QuoteDisplayProps) => {
  if (!quote) return null;

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(251,191,36,0.12)',
          padding: '2rem 2.5rem',
        }}
      >
        {/* Corner ornaments */}
        {[
          { top: 10, left: 10, borderTop: '1px solid rgba(251,191,36,0.25)', borderLeft: '1px solid rgba(251,191,36,0.25)' },
          { top: 10, right: 10, borderTop: '1px solid rgba(251,191,36,0.25)', borderRight: '1px solid rgba(251,191,36,0.25)' },
          { bottom: 10, left: 10, borderBottom: '1px solid rgba(251,191,36,0.25)', borderLeft: '1px solid rgba(251,191,36,0.25)' },
          { bottom: 10, right: 10, borderBottom: '1px solid rgba(251,191,36,0.25)', borderRight: '1px solid rgba(251,191,36,0.25)' },
        ].map((style, i) => (
          <div key={i} className="absolute w-4 h-4 pointer-events-none" style={style} />
        ))}

        {/* Decorative quote mark */}
        <div
          className="mb-2 leading-none select-none text-left"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '3.5rem',
            color: 'rgba(251,191,36,0.15)',
            lineHeight: 0.8,
          }}
        >
          "
        </div>

        {/* Quote text */}
        <p
          className="leading-relaxed"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)',
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '0.01em',
          }}
        >
          {quote.quote}
        </p>

        {/* Reveal panel */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mt-6"
            >
              <div className="h-px mb-5" style={{ background: 'linear-gradient(to right, transparent, rgba(52,211,153,0.3), transparent)' }} />

              <div
                className="inline-flex flex-col items-center gap-1 rounded-xl px-6 py-4"
                style={{
                  background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.3)',
                  boxShadow: '0 0 20px rgba(52,211,153,0.06)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: '#34d399', fontSize: '0.8rem' }}>✓</span>
                  <span
                    className="font-semibold"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '1.2rem',
                      color: '#6ee7b7',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {quote.character}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(52,211,153,0.5)',
                  }}
                >
                  {quote.movie?.toUpperCase()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuoteDisplay;

/*import { motion } from 'framer-motion';
import type { Quote } from '../services/quoteService';

type QuoteDisplayProps = {
  quote: Quote | null;
  revealed: boolean;
};

const QuoteDisplay = ({ quote, revealed }: QuoteDisplayProps) => {
  if (!quote) return null;

  return (
    <div className="w-full max-w-2xl text-center">
      <motion.div
        className="rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6 md:p-8 shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xl md:text-2xl italic leading-relaxed text-white font-light mb-6">
          “{quote.quote}”
        </p>

        {revealed && (
          <motion.div
            className="rounded-lg backdrop-blur-lg bg-emerald-500/20 border border-emerald-400/50 p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="flex items-center justify-center gap-2 text-lg">
              <span className="u2705">✅</span>
              <span className="font-semibold">{quote.character}</span>
            </p>
            <p className="text-sm text-white/70 mt-1 italic">from {quote.movie}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuoteDisplay;*/
