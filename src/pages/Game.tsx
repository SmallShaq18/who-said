import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSound } from '../hooks/useSound';
import ModeSelector from '../components/ModeSelector';
import ResultScreen from '../components/ResultScreen';
import LifelinesComponent from '../components/Lifelines';
import TimerBar from '../components/TimerBar';
import AnswerOptions from '../components/AnswerOptions';
import QuoteDisplay from '../components/QuoteDisplay';
//import BackgroundEffects from '../components/BackgroundEffects';
import { getTheme } from '../theme/themes';

/* ─── Decorative helpers ─── */
const CornerOrnament = ({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: 12, left: 12, borderTop: '1px solid', borderLeft: '1px solid' },
    tr: { top: 12, right: 12, borderTop: '1px solid', borderRight: '1px solid' },
    bl: { bottom: 12, left: 12, borderBottom: '1px solid', borderLeft: '1px solid' },
    br: { bottom: 12, right: 12, borderBottom: '1px solid', borderRight: '1px solid' },
  };
  return (
    <div
      className="absolute w-5 h-5 pointer-events-none"
      style={{ ...styles[pos], borderColor: 'rgba(251,191,36,0.3)' }}
    />
  );
};

const Divider = () => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.25))' }} />
    <span style={{ color: 'rgba(251,191,36,0.4)', fontSize: '0.6rem' }}>✦</span>
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.25))' }} />
  </div>
);

/* ─── Main component ─── */
const Game = () => {
  const playCorrect = useSound('/sounds/correct.mp3');
  const playWrong = useSound('/sounds/wrong.mp3');
  const playTick = useSound('/sounds/tick (mp3cut).mp3');

  const gameLogic = useGameLogic();
  const [soundOn, setSoundOn] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const theme = getTheme(gameLogic.mode);

  useEffect(() => {
    if (!gameLogic.revealed && gameLogic.timeLeft > 0 && gameLogic.isPlaying) {
      const timer = setTimeout(() => {
        soundOn && playTick();
        gameLogic.setTimeLeft(gameLogic.timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (gameLogic.timeLeft === 0 && !gameLogic.revealed && gameLogic.isPlaying) {
      gameLogic.handleNext();
    }
  }, [gameLogic.timeLeft, gameLogic.revealed, gameLogic.isPlaying, soundOn, playTick, gameLogic]);

  const handleRevealWithSound = () => {
    const isCorrect = gameLogic.handleReveal();
    if (isCorrect) { soundOn && playCorrect(); }
    else { soundOn && playWrong(); }
  };

  /* ── Mode select ── */
  if (gameLogic.mode === null) {
    return <ModeSelector onModeSelect={gameLogic.startGame} isOpen={isOpen} setIsOpen={setIsOpen} />;
  }

  /* ── Game over ── */
  if (gameLogic.gameOver) {
    return (
      <ResultScreen
        score={gameLogic.score}
        totalQuestions={gameLogic.TOTAL_QUESTIONS}
        mode={gameLogic.mode}
        theme={theme}
        onPlayAgain={() => gameLogic.startGame(gameLogic.mode!)}
        onChangeMode={gameLogic.restartGame}
      />
    );
  }

  /* ── Loading ── */
  if (gameLogic.loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen p-5"
        style={{ background: 'linear-gradient(135deg, #0a0a0f, #0f0c1a)', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex gap-2 justify-center mb-4">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400"
                animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace" }}>
            LOADING SCENE...
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── Game screen ── */
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white p-5"
      style={{
        background: 'linear-gradient(135deg, #080810 0%, #0d0b18 50%, #080810 100%)',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
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
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Top/bottom lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.35), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.35), transparent)' }} />

      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Header ── */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1
              className="font-bold leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                background: 'linear-gradient(135deg, #fbbf24, #fde68a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Who Said It?
            </h1>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.25)',
                marginTop: 2,
              }}
            >
              CINEMA EDITION
            </p>
          </div>

          {/* Sound toggle */}
          <motion.button
            onClick={() => setSoundOn(!soundOn)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '1.1rem',
            }}
          >
            {soundOn ? '🔊' : '🔇'}
          </motion.button>
        </motion.div>

        {/* ── Score & Progress ── */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)' }}>
              QUESTION {gameLogic.questionCount + 1} / {gameLogic.TOTAL_QUESTIONS}
            </span>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(251,191,36,0.5)' }}>
                SCORE
              </span>
              <span
                className="font-bold"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.4rem',
                  color: '#fbbf24',
                  lineHeight: 1,
                }}
              >
                {gameLogic.score}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #d97706, #fbbf24)', boxShadow: '0 0 8px rgba(251,191,36,0.5)' }}
              initial={false}
              animate={{ width: `${((gameLogic.questionCount + 1) / gameLogic.TOTAL_QUESTIONS) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* ── Main card ── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)',
            border: '1px solid rgba(251,191,36,0.12)',
            boxShadow: '0 0 80px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.2)',
          }}
        >
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />

          <div className="p-6 md:p-8">
            {/* Lifelines */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-5"
            >
              <LifelinesComponent
                handleFifty={gameLogic.handleFifty}
                handleExtraTime={gameLogic.handleExtraTime}
                handleHint={() => {
                  const hint = gameLogic.handleHint();
                  if (hint) alert(`Hint: ${hint}`);
                }}
                lifelines={gameLogic.lifelines}
              />
            </motion.div>

            <Divider />

            {/* Timer */}
            <motion.div
              className="my-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <TimerBar
                timeLeft={Math.max(0, gameLogic.timeLeft)}
                maxTime={gameLogic.INITIAL_TIME}
                progressColor={theme.progressColor}
              />
            </motion.div>

            <Divider />

            {/* Quote & Options */}
            <AnimatePresence mode="wait">
              <motion.div
                key={gameLogic.questionCount}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="mt-5"
              >
                {gameLogic.quote && (
                  <>
                    <motion.div
                      className="mb-7"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <QuoteDisplay quote={gameLogic.quote} revealed={gameLogic.revealed} />
                    </motion.div>

                    <motion.div
                      className="mb-7"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                    >
                      <AnswerOptions
                        options={gameLogic.options}
                        selected={gameLogic.selected}
                        revealed={gameLogic.revealed}
                        correctAnswer={gameLogic.quote.character}
                        onSelect={gameLogic.handleSelect}
                      />
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                      className="flex gap-3 justify-center flex-wrap"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      {!gameLogic.revealed && (
                        <motion.button
                          onClick={handleRevealWithSound}
                          disabled={!gameLogic.selected}
                          whileHover={gameLogic.selected ? { scale: 1.03 } : {}}
                          whileTap={gameLogic.selected ? { scale: 0.97 } : {}}
                          className="px-7 py-3 rounded-xl font-medium text-sm transition-all duration-300"
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            letterSpacing: '0.12em',
                            background: gameLogic.selected
                              ? 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.3))'
                              : 'rgba(255,255,255,0.03)',
                            border: gameLogic.selected
                              ? '1px solid rgba(251,191,36,0.5)'
                              : '1px solid rgba(255,255,255,0.08)',
                            color: gameLogic.selected ? '#fde68a' : 'rgba(255,255,255,0.2)',
                            boxShadow: gameLogic.selected ? '0 0 20px rgba(251,191,36,0.12)' : 'none',
                            cursor: gameLogic.selected ? 'pointer' : 'not-allowed',
                          }}
                        >
                          ✓ REVEAL
                        </motion.button>
                      )}

                      {gameLogic.revealed && (
                        <motion.button
                          onClick={gameLogic.handleNext}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-7 py-3 rounded-xl font-medium text-sm transition-all duration-300"
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            letterSpacing: '0.12em',
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.3))',
                            border: '1px solid rgba(16,185,129,0.45)',
                            color: '#6ee7b7',
                            boxShadow: '0 0 20px rgba(16,185,129,0.1)',
                          }}
                        >
                          → NEXT
                        </motion.button>
                      )}

                      <motion.button
                        onClick={gameLogic.cancelGame}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-7 py-3 rounded-xl font-medium text-sm transition-all duration-300"
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          letterSpacing: '0.12em',
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.25)',
                          color: 'rgba(252,165,165,0.7)',
                        }}
                      >
                        ✕ END
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Game;
