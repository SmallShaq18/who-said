import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BackgroundEffects from './BackgroundEffects';

type ResultScreenProps = {
  score: number;
  totalQuestions: number;
  mode: string;
  theme: any;
  onPlayAgain: () => void;
  onChangeMode: () => void;
};

const getResultData = (score: number, total: number) => {
  const pct = score / total;
  if (pct === 1)   return { rank: 'QUOTE MASTER',   sub: 'Absolutely legendary. You were born for this.', roman: 'I', color: '#fbbf24', dim: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.4)' };
  if (pct >= 0.8)  return { rank: 'FILM BUFF',       sub: 'Impressive recall. The screen remembers you.', roman: 'II', color: '#a78bfa', dim: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.35)' };
  if (pct >= 0.5)  return { rank: 'CASUAL VIEWER',   sub: 'Not bad. But the credits have more to offer.', roman: 'III', color: '#34d399', dim: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.35)' };
  return           { rank: 'NEEDS A REWATCH',  sub: 'Time for a marathon. The screen awaits.', roman: 'IV', color: '#f87171', dim: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.35)' };
};

const CornerOrnament = ({ pos, color }: { pos: 'tl' | 'tr' | 'bl' | 'br'; color: string }) => {
  const base: React.CSSProperties = { position: 'absolute', width: 18, height: 18, pointerEvents: 'none' };
  const sides: Record<string, React.CSSProperties> = {
    tl: { top: 12, left: 12, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    tr: { top: 12, right: 12, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` },
    bl: { bottom: 12, left: 12, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
    br: { bottom: 12, right: 12, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` },
  };
  return <div style={{ ...base, ...sides[pos] }} />;
};

import React from 'react';

const ResultScreen = ({ score, totalQuestions, mode, onPlayAgain, onChangeMode }: ResultScreenProps) => {
  const result = getResultData(score, totalQuestions);
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-5 overflow-hidden text-white"
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
      <BackgroundEffects theme={mode} />

      {/* Ambient glow matching rank color */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: `radial-gradient(ellipse, ${result.dim} 0%, transparent 70%)`, filter: 'blur(50px)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

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
        className="relative z-10 container mx-auto px-6 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs tracking-[0.25em] uppercase"
            style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.05)', color: 'rgba(251,191,36,0.65)', fontFamily: "'DM Mono', monospace" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Game Over
          </div>
        </motion.div>

        {/* Rank title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <p
            className="font-bold mb-3 leading-none"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              color: result.color,
              opacity: 0.8,
            }}
          >
            RANK {result.roman}
          </p>
          <h1
            className="font-bold mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(2.4rem, 7vw, 4rem)',
              color: result.color,
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              textShadow: `0 0 40px ${result.dim}`,
            }}
          >
            {result.rank}
          </h1>
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to right, transparent, ${result.border})` }} />
            <span style={{ color: result.color, fontSize: '0.55rem', opacity: 0.6 }}>✦</span>
            <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to left, transparent, ${result.border})` }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: '1rem', letterSpacing: '0.02em' }}>
            {result.sub}
          </p>
        </motion.div>

        {/* Score card */}
        <motion.div
          className="relative rounded-2xl overflow-hidden mb-8"
          style={{
            background: `linear-gradient(145deg, ${result.dim} 0%, rgba(255,255,255,0.015) 100%)`,
            border: `1px solid ${result.border}`,
            boxShadow: `0 0 60px ${result.dim}`,
            padding: '2.5rem',
          }}
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CornerOrnament pos="tl" color={result.border} />
          <CornerOrnament pos="tr" color={result.border} />
          <CornerOrnament pos="bl" color={result.border} />
          <CornerOrnament pos="br" color={result.border} />

          {/* Big score */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: 'spring', stiffness: 120 }}
          >
            <div className="flex items-end justify-center gap-2">
              <span
                className="font-bold leading-none"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(5rem, 15vw, 7rem)',
                  color: result.color,
                  textShadow: `0 0 60px ${result.dim}`,
                  lineHeight: 1,
                }}
              >
                {score}
              </span>
              <span
                className="mb-3"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '1.4rem',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.05em',
                }}
              >
                / {totalQuestions}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.25)',
                marginTop: 4,
              }}
            >
              CORRECT ANSWERS
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="mb-3">
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, ${result.color}99, ${result.color})`, boxShadow: `0 0 10px ${result.color}66` }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.7, duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </div>
          <p
            className="text-center"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: result.color, opacity: 0.7 }}
          >
            {percentage}% ACCURACY
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            onClick={onPlayAgain}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="py-3 rounded-xl font-medium text-sm transition-all duration-300"
            style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.35)', color: 'rgba(110,231,183,0.85)' }}
          >
            ↺ PLAY AGAIN
          </motion.button>

          <motion.button
            onClick={onChangeMode}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="py-3 rounded-xl font-medium text-sm transition-all duration-300"
            style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.35)', color: 'rgba(147,197,253,0.85)' }}
          >
            ⇄ CHANGE MODE
          </motion.button>

          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/"
              className="flex items-center justify-center py-3 rounded-xl font-medium text-sm transition-all duration-300 w-full"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              ← HOME
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultScreen;

/*import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BackgroundEffects from './BackgroundEffects';

type ResultScreenProps = {
  score: number;
  totalQuestions: number;
  mode: string;
  theme: any;
  onPlayAgain: () => void;
  onChangeMode: () => void;
};

const getResultMessage = (score: number) => {
  if (score === 10) return { title: '⭐ Quote Master', message: 'Absolutely legendary performance!' };
  if (score >= 8) return { title: '🎉 Film Buff', message: 'Impressive knowledge of quotes!' };
  if (score >= 5) return { title: '🏠 Casual Viewer', message: 'Not bad! Keep watching!' };
  return { title: '📚 Needs a Rewatch', message: 'Time for a movie marathon!' };
};

const ResultScreen = ({
  score,
  totalQuestions,
  mode,
  onPlayAgain,
  onChangeMode,
}: ResultScreenProps) => {
  const result = getResultMessage(score);
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <BackgroundEffects theme={mode} />

      <motion.div
        className="relative z-10 container mx-auto px-4 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Result Title *
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{result.title}</h1>
          <p className="text-xl text-white/70">{result.message}</p>
        </motion.div>

        {/* Score Card *
        <motion.div
          className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-10 shadow-2xl mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Animated Score *
          <motion.div
            className="text-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
          >
            <span className="text-7xl font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {score}
            </span>
            <span className="text-4xl text-white/70"> / {totalQuestions}</span>
          </motion.div>

          {/* Progress Bar *
          <div className="w-full bg-white/10 backdrop-blur-lg rounded-full h-3 border border-white/20 overflow-hidden mb-4">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full shadow-lg shadow-amber-400/50"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.6, duration: 1 }}
            />
          </div>

          <p className="text-center text-white/70 font-semibold">{Math.round(percentage)}% Correct</p>
        </motion.div>

        {/* Button Group *
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            onClick={onPlayAgain}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl backdrop-blur-lg bg-emerald-500/30 border border-emerald-400 font-semibold text-lg hover:bg-emerald-500/40 transition-all duration-300 shadow-lg shadow-emerald-400/30"
          >
            🔁 Play Again
          </motion.button>

          <motion.button
            onClick={onChangeMode}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl backdrop-blur-lg bg-blue-500/30 border border-blue-400 font-semibold text-lg hover:bg-blue-500/40 transition-all duration-300 shadow-lg shadow-blue-400/30"
          >
            🔄 Change Mode
          </motion.button>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/"
              className="block px-6 py-3 rounded-xl backdrop-blur-lg bg-slate-500/30 border border-slate-400 font-semibold text-lg hover:bg-slate-500/40 transition-all duration-300 shadow-lg shadow-slate-400/30 text-center"
            >
              🏠 Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultScreen;*/
