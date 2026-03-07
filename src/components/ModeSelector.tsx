import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import React from 'react';
import HowToPlay from './HowToPlay';

type ModeSelectorProps = {
  onModeSelect: (mode: 'movie' | 'anime' | '') => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const modes = [
  {
    id: 'movie',
    label: 'Movie Mode',
    sub: 'Hollywood classics & blockbusters',
    icon: '🎬',
    accent: 'rgba(251,191,36,1)',
    accentDim: 'rgba(251,191,36,0.12)',
    accentBorder: 'rgba(251,191,36,0.35)',
    glow: 'rgba(251,191,36,0.08)',
  },
  {
    id: 'anime',
    label: 'Anime Mode',
    sub: 'Iconic lines from legendary series',
    icon: '⛩️',
    accent: 'rgba(244,114,182,1)',
    accentDim: 'rgba(244,114,182,0.12)',
    accentBorder: 'rgba(244,114,182,0.35)',
    glow: 'rgba(244,114,182,0.08)',
  },
  {
    id: '',
    label: 'Random Mode',
    sub: 'Mixed bag — expect anything',
    icon: '🎲',
    accent: 'rgba(52,211,153,1)',
    accentDim: 'rgba(52,211,153,0.12)',
    accentBorder: 'rgba(52,211,153,0.35)',
    glow: 'rgba(52,211,153,0.08)',
  },
];

const CornerOrnament = ({ pos, color = 'rgba(251,191,36,0.3)' }: { pos: 'tl' | 'tr' | 'bl' | 'br'; color?: string }) => {
  const base: React.CSSProperties = { position: 'absolute', width: 16, height: 16, pointerEvents: 'none' };
  const sides: Record<string, React.CSSProperties> = {
    tl: { top: 10, left: 10, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    tr: { top: 10, right: 10, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` },
    bl: { bottom: 10, left: 10, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    br: { bottom: 10, right: 10, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` },
  };
  return <div style={{ ...base, ...sides[pos] }} />;
};

const ModeSelector = ({ onModeSelect, isOpen, setIsOpen }: ModeSelectorProps) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white"
      style={{ background: 'linear-gradient(135deg, #080810 0%, #0d0b18 50%, #080810 100%)', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute pointer-events-none" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 300, background: 'radial-gradient(ellipse, rgba(251,191,36,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Edge lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.3), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.3), transparent)' }} />

      {/* Film strips */}
      <div className="absolute inset-y-0 left-0 w-10 flex flex-col gap-1 overflow-hidden opacity-[0.07] pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => <div key={i} className="w-full h-8 border border-amber-400 rounded-sm flex-shrink-0" />)}
      </div>
      <div className="absolute inset-y-0 right-0 w-10 flex flex-col gap-1 overflow-hidden opacity-[0.07] pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => <div key={i} className="w-full h-8 border border-amber-400 rounded-sm flex-shrink-0" />)}
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-6 max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Badge */}
        <motion.div className="flex justify-center mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs tracking-[0.25em] uppercase" style={{ borderColor: 'rgba(251,191,36,0.35)', background: 'rgba(251,191,36,0.05)', color: 'rgba(251,191,36,0.75)', fontFamily: "'DM Mono', monospace" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Select Your Stage
          </div>
        </motion.div>

        {/* Title */}
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
          <h1
            className="font-bold leading-none mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(3.5rem, 9vw, 6rem)',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #fde68a 70%, #d97706 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Who Said It?
          </h1>
          <div className="flex items-center gap-4 justify-center mb-4">
            <div className="h-px flex-1 max-w-20" style={{ background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.4))' }} />
            <span style={{ color: 'rgba(251,191,36,0.5)', fontSize: '0.7rem' }}>✦</span>
            <div className="h-px flex-1 max-w-20" style={{ background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.4))' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>
            Choose your arena. Prove your cinematic memory.
          </p>
        </motion.div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {modes.map((mode, i) => (
            <motion.button
              key={mode.id || 'random'}
              onClick={() => onModeSelect(mode.id as any)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300"
              style={{
                background: `linear-gradient(145deg, ${mode.accentDim} 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${mode.accentBorder}`,
                boxShadow: `0 0 40px ${mode.glow}`,
                padding: '1.75rem',
                minHeight: 160,
              }}
            >
              <CornerOrnament pos="tl" color={mode.accentBorder} />
              <CornerOrnament pos="br" color={mode.accentBorder} />

              {/* Hover shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at 50% 0%, ${mode.accentDim} 0%, transparent 70%)` }} />

              <div className="relative z-10">
                <span className="text-4xl block mb-4">{mode.icon}</span>
                <p
                  className="font-bold mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.4rem',
                    fontStyle: 'italic',
                    color: mode.accent,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {mode.label}
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>
                  {mode.sub}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: mode.accent, fontSize: '1.1rem' }}>
                →
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {!isOpen ? (
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3 rounded-xl font-medium text-sm transition-all duration-300"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.12em', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)', color: 'rgba(110,231,183,0.8)' }}
            >
              📖 HOW TO PLAY
            </motion.button>
          ) : (
            <AnimatePresence>
              <motion.div
                className="w-full max-w-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <HowToPlay setIsOpen={setIsOpen} />
              </motion.div>
            </AnimatePresence>
          )}

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-7 py-3 rounded-xl font-medium text-sm transition-all duration-300"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.12em', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              ← HOME
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModeSelector;
