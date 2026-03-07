import { useEffect, useState, useCallback } from 'react';
import { getRandomQuote, generateOptions } from '../services/quoteService';
import type { Quote } from '../services/quoteService';

export type Lifelines = {
  fifty: boolean;
  extraTime: boolean;
  hint: boolean;
};

type GameMode = 'movie' | 'anime' | '';

const TOTAL_QUESTIONS = 10;
const INITIAL_TIME = 15;
const EXTRA_TIME_BONUS = 5;
const REVEAL_DELAY = 2000;

export const useGameLogic = () => {
  // Game State
  const [quote, setQuote] = useState<Quote | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mode, setMode] = useState<GameMode | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lifelines, setLifelines] = useState<Lifelines>({
    fifty: false,
    extraTime: false,
    hint: false,
  });

  // ============================================================================
  // FETCH QUOTE
  // ============================================================================

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const newQuote = getRandomQuote(mode || '');
      const shuffledOptions = generateOptions(newQuote.character, mode || '');

      setQuote(newQuote);
      setOptions(shuffledOptions);
      setSelected(null);
      setRevealed(false);
      setTimeLeft(INITIAL_TIME);
    } catch (err) {
      console.error('Error fetching quote:', err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  // ============================================================================
  // GAME HANDLERS
  // ============================================================================

  const handleNext = useCallback(() => {
    if (questionCount + 1 >= TOTAL_QUESTIONS) {
      setGameOver(true);
      setIsPlaying(false);
    } else {
      setQuestionCount((prev) => prev + 1);
      fetchQuote();
    }
  }, [questionCount, fetchQuote]);

  const handleSelect = (option: string) => {
    if (!revealed) setSelected(option);
  };

  const handleReveal = (): boolean => {
    if (!selected || !quote) return false;

    setRevealed(true);

    // Check answer
    const isCorrect = selected === quote.character;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Auto-advance after delay
    setTimeout(handleNext, REVEAL_DELAY);
    return isCorrect;
  };

  // ============================================================================
  // LIFELINE HANDLERS
  // ============================================================================

  const handleFifty = () => {
    if (lifelines.fifty || !quote) return;

    const correct = quote.character;
    const wrongs = options.filter((opt) => opt !== correct);
    const keptWrong = wrongs.sort(() => 0.5 - Math.random()).slice(0, 1);
    const newOptions = [correct, ...keptWrong].sort(() => 0.5 - Math.random());

    setOptions(newOptions);
    setLifelines((prev) => ({ ...prev, fifty: true }));
  };

  const handleExtraTime = () => {
    if (lifelines.extraTime) return;
    setTimeLeft((prev) => prev + EXTRA_TIME_BONUS);
    setLifelines((prev) => ({ ...prev, extraTime: true }));
  };

  const handleHint = (): string | null => {
    if (lifelines.hint || !quote) return null;
    const hint = `The name starts with "${quote.character[0]}"`;
    setLifelines((prev) => ({ ...prev, hint: true }));
    return hint;
  };

  // ============================================================================
  // GAME FLOW
  // ============================================================================

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    setIsPlaying(true);
    setLifelines({ fifty: false, extraTime: false, hint: false });
    fetchQuote();
  };

  const restartGame = () => {
    setMode(null);
    setGameOver(false);
    setQuote(null);
    setIsPlaying(false);
    setLifelines({ fifty: false, extraTime: false, hint: false });
  };

  const cancelGame = () => {
    setGameOver(true);
    setIsPlaying(false);
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Fetch quote when mode changes
  useEffect(() => {
    if (mode && isPlaying) fetchQuote();
  }, [mode, isPlaying, fetchQuote]);

  return {
    // Game state
    quote,
    options,
    selected,
    revealed,
    loading,
    score,
    questionCount,
    mode,
    gameOver,
    timeLeft,
    isPlaying,
    lifelines,
    TOTAL_QUESTIONS,
    INITIAL_TIME,
    EXTRA_TIME_BONUS,
    REVEAL_DELAY,

    // Handlers
    handleSelect,
    handleReveal,
    handleNext,
    handleFifty,
    handleExtraTime,
    handleHint,
    startGame,
    restartGame,
    cancelGame,
    setTimeLeft,

    // Utilities
    fetchQuote,
  };
};
