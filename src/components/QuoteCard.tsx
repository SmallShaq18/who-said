import { motion } from 'framer-motion';

type QuoteCardProps = {
  quote: string;
  character: string;
  source: string;
};

const QuoteCard = ({ quote, character, source }: QuoteCardProps) => {
  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden group transition-all duration-500"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)',
          border: '1px solid rgba(251,191,36,0.15)',
          boxShadow: '0 0 60px rgba(251,191,36,0.04), 0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Corner ornaments */}
        {(['tl','tr','bl','br'] as const).map(pos => {
          const s: React.CSSProperties = { position: 'absolute', width: 16, height: 16, pointerEvents: 'none', transition: 'border-color 0.3s' };
          const sides: Record<string, React.CSSProperties> = {
            tl: { top: 12, left: 12, borderTop: '1px solid rgba(251,191,36,0.3)', borderLeft: '1px solid rgba(251,191,36,0.3)' },
            tr: { top: 12, right: 12, borderTop: '1px solid rgba(251,191,36,0.3)', borderRight: '1px solid rgba(251,191,36,0.3)' },
            bl: { bottom: 12, left: 12, borderBottom: '1px solid rgba(251,191,36,0.3)', borderLeft: '1px solid rgba(251,191,36,0.3)' },
            br: { bottom: 12, right: 12, borderBottom: '1px solid rgba(251,191,36,0.3)', borderRight: '1px solid rgba(251,191,36,0.3)' },
          };
          return <div key={pos} style={{ ...s, ...sides[pos] }} />;
        })}

        {/* Hover shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.05) 0%, transparent 65%)' }}
        />

        <div className="relative p-8 md:p-12">
          {/* Decorative quote mark */}
          <div
            className="mb-4 leading-none select-none"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '4.5rem',
              color: 'rgba(251,191,36,0.18)',
              lineHeight: 0.8,
            }}
          >
            "
          </div>

          {/* Quote text */}
          <p
            className="leading-relaxed mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.15rem, 2.5vw, 1.35rem)',
              color: 'rgba(255,255,255,0.88)',
              letterSpacing: '0.01em',
            }}
          >
            {quote}
          </p>

          {/* Divider */}
          <div className="h-px mb-5" style={{ background: 'linear-gradient(to right, rgba(251,191,36,0.25), transparent)' }} />

          {/* Attribution */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <p
                className="font-semibold mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.15rem',
                  color: '#fbbf24',
                  letterSpacing: '0.02em',
                }}
              >
                {character}
              </p>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                {source}
              </p>
            </div>
            <div
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs"
              style={{
                fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.1em',
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: 'rgba(251,191,36,0.6)',
              }}
            >
              QUOTE
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuoteCard;

/*import { motion } from 'framer-motion';

type QuoteCardProps = {
  quote: string;
  character: string;
  source: string;
};

const QuoteCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const QuoteCard = ({ quote, character, source }: QuoteCardProps) => {
  return (
    <motion.div
      variants={QuoteCardVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl"
    >
      <div className="relative rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden group hover:shadow-2xl hover:shadow-white/10 transition-all duration-300">
        {/* Decorative gradient border *
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/0 via-transparent to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Content *
        <div className="relative p-8 md:p-12">
          {/* Opening quote mark *
          <div className="text-6xl text-white/20 mb-4">‟</div>

          {/* Quote text *
          <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-white italic">
            {quote}
          </p>

          {/* Attribution *
          <div className="space-y-2">
            <p className="text-lg font-semibold text-amber-300">— {character}</p>
            <p className="text-sm text-white/60">{source}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuoteCard;*/
