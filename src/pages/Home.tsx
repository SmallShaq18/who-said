import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import QuoteCard from '../components/QuoteCard';
//import BackgroundEffects from '../components/BackgroundEffects';
import { getRandomQuote } from '../services/quoteService';

type Quote = {
  quote: string;
  character: string;
  source: string;
  movie: string;
};

const FloatingOrb = ({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
      filter: 'blur(40px)',
    }}
    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 4 + delay, repeat: Infinity, delay }}
  />
);

const FilmStrip = () => (
  <div className="absolute inset-y-0 left-0 w-12 flex flex-col gap-1 overflow-hidden opacity-10 pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div key={i} className="w-full h-8 border border-amber-400/60 rounded-sm flex-shrink-0" />
    ))}
  </div>
);

function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoteKey, setQuoteKey] = useState(0);

  const fetchQuote = () => {
    try {
      setLoading(true);
      const newQuote = getRandomQuote('');
      setQuote({
        quote: newQuote.quote,
        character: newQuote.character,
        source: newQuote.source,
        movie: newQuote.movie,
      });
      setQuoteKey(k => k + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuote(); }, []);

  return (
    <div
      className="relative min-h-screen p-5 flex flex-col items-center justify-center overflow-hidden text-white"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0c1a 40%, #0a0a0f 100%)',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Decorative orbs */}
      <FloatingOrb x="10%" y="20%" size={400} delay={0} />
      <FloatingOrb x="70%" y="60%" size={300} delay={2} />
      <FloatingOrb x="50%" y="10%" size={200} delay={1} />

      {/* Film strip decorations */}
      <FilmStrip />
      <div className="absolute inset-y-0 right-0 w-12 flex flex-col gap-1 overflow-hidden opacity-10 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="w-full h-8 border border-amber-400/60 rounded-sm flex-shrink-0" />
        ))}
      </div>

      {/* Horizontal rule lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <motion.div
        className="relative z-10 container mx-auto px-6 max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs tracking-[0.25em] uppercase"
            style={{
              borderColor: 'rgba(251,191,36,0.4)',
              background: 'rgba(251,191,36,0.05)',
              color: 'rgba(251,191,36,0.8)',
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Cinema Edition
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1
            className="font-bold mb-3 leading-none"
            style={{
              fontSize: 'clamp(4rem, 10vw, 7rem)',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #fde68a 70%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Who Said It?
          </h1>

          <div className="flex items-center gap-4 justify-center mb-5">
            <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.5))' }} />
            <div className="text-amber-400/60 text-lg">✦</div>
            <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.5))' }} />
          </div>

          <p
            className="text-lg max-w-md mx-auto"
            style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.03em', lineHeight: 1.7 }}
          >
            Test your knowledge of iconic film & anime quotes.
            <br />
            <em>Can you guess who said what?</em>
          </p>
        </motion.div>

        {/* Quote Card */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                className="flex justify-center items-center py-16"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div className="flex gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-amber-400"
                      animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : quote ? (
              <motion.div
                key={quoteKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                {/* Cinematic quote card */}
                <div
                  className="relative rounded-2xl p-8 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(251,191,36,0.15)',
                    boxShadow: '0 0 60px rgba(251,191,36,0.05), inset 0 0 60px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Corner ornaments */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-400/40" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-amber-400/40" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-amber-400/40" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-400/40" />

                  <div
                    className="text-6xl leading-none mb-4 opacity-20 select-none"
                    style={{ color: '#fbbf24', fontFamily: 'Georgia, serif' }}
                  >
                    "
                  </div>
                  <p
                    className="text-xl md:text-2xl leading-relaxed mb-6"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.9)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {quote.quote}
                  </p>

                  <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mb-5" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-amber-300" style={{ letterSpacing: '0.05em' }}>
                        {quote.character}
                      </p>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.08em' }}
                      >
                        {quote.movie || quote.source}
                      </p>
                    </div>
                    <div
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: 'rgba(251,191,36,0.1)',
                        border: '1px solid rgba(251,191,36,0.2)',
                        color: 'rgba(251,191,36,0.7)',
                        fontFamily: "'DM Mono', monospace",
                        letterSpacing: '0.1em',
                      }}
                    >
                      FEATURED
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.button
            onClick={fetchQuote}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative px-8 py-3.5 rounded-xl font-medium text-base transition-all duration-300 disabled:opacity-40"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.06em',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8rem',
            }}
          >
            <span className="mr-2">↻</span> NEW QUOTE
          </motion.button>

          <Link to="/game">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative px-10 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.3) 100%)',
                border: '1px solid rgba(251,191,36,0.5)',
                color: '#fde68a',
                letterSpacing: '0.1em',
                fontFamily: "'DM Mono', monospace",
                boxShadow: '0 0 30px rgba(251,191,36,0.15)',
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.0), rgba(251,191,36,0.15))' }}
                whileHover={{ opacity: [0, 1] }}
              />
              <span className="relative">▶ PLAY GAME</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-center mt-14 text-xs tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          10 questions · earn your rank · glory awaits
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Home;