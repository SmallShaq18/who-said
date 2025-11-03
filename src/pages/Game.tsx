import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import fakeNamesData from "../../fakeNames.json";
import { useSound } from '../hooks/useSound';
import HowToPlay from "../components/HowToPlay";

// ============================================================================
// TYPES
// ============================================================================

interface Quote {
  quote: string;
  character: string;
  movie: string;
  source: string;
}

export type Lifelines = {
  fifty: boolean;
  extraTime: boolean;
  hint: boolean;
};

type GameMode = "movie" | "anime" | "";

// ============================================================================
// CONSTANTS
// ============================================================================

const TOTAL_QUESTIONS = 10;
const INITIAL_TIME = 15;
const EXTRA_TIME_BONUS = 5;
const REVEAL_DELAY = 2000;

const THEME_CONFIG = {
  anime: {
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    background: "url('/mei.jpg')",
    progressColor: "bg-pink-400",
  },
  movie: {
    gradient: "from-gray-900 via-blue-900 to-yellow-700",
    background: "url('/it.jpg')",
    progressColor: "bg-yellow-400",
  },
  default: {
    gradient: "from-yellow-500 via-green-500 to-blue-500",
    background: "url('/mizu.jpg')",
    progressColor: "bg-green-400",
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Game = () => {

  // Sound Effects
  const playCorrect = useSound("/sounds/correct.mp3");
  const playWrong = useSound("/sounds/wrong.mp3");
  const playTick = useSound("/sounds/tick (mp3cut).mp3");
  const playNext = useSound("/sounds/click.mp3");

  // Game State
  const [soundOn, setSoundOn] = useState(true);
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
  const [isOpen, setIsOpen] = useState(false);
  const [lifelines, setLifelines] = useState<Lifelines>({
    fifty: false,
    extraTime: false,
    hint: false,
  });

  // ============================================================================
  // THEME
  // ============================================================================

  const theme = mode && mode in THEME_CONFIG 
    ? THEME_CONFIG[mode as keyof typeof THEME_CONFIG]
    : THEME_CONFIG.default;

  // ============================================================================
  // FETCH QUOTE
  // ============================================================================

  const fetchQuote = useCallback(async () => {
    //if (!mode) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://who-said.onrender.com/api/quote${mode ? `?mode=${mode}` : ""}`
      );
      const data = await res.json();

      const newQuote: Quote = {
        quote: data.quote,
        character: data.character,
        movie: data.movie,
        source: data.source,
      };

      // Get appropriate fake names based on category
      const fakeNames =
        data.category === "anime"
          ? fakeNamesData.anime
          : data.category === "movie"
          ? fakeNamesData.movie
          : fakeNamesData.default;

      // Generate 4 options (1 correct + 3 wrong)
      const shuffled = [
        newQuote.character,
        ...fakeNames
          .filter((n) => n !== newQuote.character)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3),
      ].sort(() => 0.5 - Math.random());

      setQuote(newQuote);
      setOptions(shuffled);
      setSelected(null);
      setRevealed(false);
      setTimeLeft(INITIAL_TIME);
    } catch (err) {
      console.error("Error fetching quote:", err);
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
      playNext();
      fetchQuote();
    }
  }, [questionCount, playNext, fetchQuote]);

  const handleSelect = (option: string) => {
    if (!revealed) setSelected(option);
  };

  const handleReveal = () => {
    if (!selected || !quote) return;

    setRevealed(true);

    // Check answer and play sound
    const isCorrect = selected === quote.character;
    if (isCorrect) {
      soundOn && playCorrect();
      setScore((prev) => prev + 1);
    } else {
      soundOn && playWrong();
    }

    // Auto-advance after delay
    setTimeout(handleNext, REVEAL_DELAY);
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

  const handleHint = () => {
    if (lifelines.hint || !quote) return;
    alert(`Hint: The name starts with "${quote.character[0]}"`);
    setLifelines((prev) => ({ ...prev, hint: true }));
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
    fetchQuote();
    setLifelines({ fifty: false, extraTime: false, hint: false });
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

  // Timer Effect
  useEffect(() => {
    if (!revealed && timeLeft > 0 && isPlaying) {
      const timer = setTimeout(() => {
        soundOn && playTick();
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    // Time ran out
    if (timeLeft === 0 && !revealed && isPlaying) {
      setRevealed(true);
      setTimeout(handleNext, REVEAL_DELAY);
    }
  }, [timeLeft, revealed, isPlaying, soundOn, playTick, handleNext]);

  // Fetch quote when mode changes
  useEffect(() => {
    if (mode) fetchQuote();
  }, [mode, fetchQuote]);

  // ============================================================================
  // RENDER: MODE SELECTION
  // ============================================================================

  if (mode === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center p-4">
        <h1 className="text-4xl font-bold mb-6">Who Said It? 🎬</h1>
        <p className="mb-6 text-lg">Choose your mode to start:</p>

        <div className="flex flex-col gap-4 w-64">
          <button
            onClick={() => startGame("movie")}
            className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition text-lg"
          >
            🎬 Movie Mode
          </button>
          <button
            onClick={() => startGame("anime")}
            className="bg-pink-500 hover:bg-pink-600 py-3 rounded-lg transition text-lg"
          >
            🌸 Anime Mode
          </button>
          <button
            onClick={() => startGame("")}
            className="bg-yellow-500 hover:bg-yellow-600 py-3 rounded-lg transition text-lg"
          >
            🎲 Random Mode
          </button>

          {isOpen ? (
            <HowToPlay setIsOpen={setIsOpen} />
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-green-500 hover:bg-green-600 py-3 mt-20 rounded-lg transition text-lg"
            >
              📖 How to Play
            </button>
          )}

          <Link
            to="/"
            className="bg-gray-500 hover:bg-gray-600 py-3 mt-4 rounded-lg transition text-lg"
          >
            🏠 Home
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: GAME OVER
  // ============================================================================

  if (gameOver) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${theme.gradient} text-white p-6 text-center`}
      >
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-6">
          You scored <span className="font-bold text-green-300">{score}</span> /{" "}
          {TOTAL_QUESTIONS} 🎯
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => startGame(mode!)}
            className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded transition"
          >
            🔁 Play Again
          </button>
          <button
            onClick={restartGame}
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded transition"
          >
            Change Mode
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: LOADING
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading...
      </div>
    );
  }

  // ============================================================================
  // RENDER: GAME
  // ============================================================================

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-cover bg-no-repeat bg-gradient-to-br ${theme.gradient} text-white p-4 transition-all duration-500`}
      style={{
        backgroundImage: `${theme.background}, linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.6))`,
        backgroundBlendMode: "overlay",
      }}
    >
      <h1 className="text-3xl font-bold mb-4">Who Said It? 🎬</h1>

      {/* Lifelines */}
      <LifeLines
        handleFifty={handleFifty}
        handleExtraTime={handleExtraTime}
        handleHint={handleHint}
        lifelines={lifelines}
      />

      {/* Score & Progress */}
      <p className="mb-2 text-gray-200">
        Question {questionCount + 1} / {TOTAL_QUESTIONS} • Score: {score}
      </p>

      <div className="w-full max-w-xl bg-gray-300 rounded-full h-3 mt-2 mb-4">
        <div
          className={`${theme.progressColor} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${((questionCount + 1) / TOTAL_QUESTIONS) * 100}%` }}
        ></div>
      </div>

      {/* Timer & Sound */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-yellow-300 text-lg mb-4">⏳ {timeLeft}s left</span>
        <button onClick={() => setSoundOn(!soundOn)} className="mb-3 text-2xl">
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>

      {/* Quote & Options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={questionCount}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl text-center"
        >
          {quote && (
            <>
              <p className="text-xl italic mb-6 bg-black bg-opacity-40 p-4 rounded-lg">
                "{quote.quote}"
              </p>

              <div className="grid grid-cols-1 gap-3 mb-6 w-full">
                {options.map((option, i) => {
                  const isCorrect = option === quote.character;
                  const isSelected = option === selected;

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(option)}
                      disabled={revealed}
                      className={`px-4 py-2 rounded text-lg transition w-full font-semibold ${
                        revealed
                          ? isCorrect
                            ? "bg-green-600"
                            : isSelected
                            ? "bg-red-600"
                            : "bg-gray-700"
                          : isSelected
                          ? "bg-blue-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {option}
                      {revealed && isSelected && (
                        <span className="ml-2">{isCorrect ? "✅" : "❌"}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                {!revealed ? (
                  <button
                    onClick={handleReveal}
                    disabled={!selected}
                    className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Reveal Answer
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-lg mb-4 bg-black bg-opacity-40 p-3 rounded-lg">
                      ✅ <span className="font-semibold">{quote.character}</span> —{" "}
                      <span className="italic">{quote.movie}</span>
                    </p>
                  </div>
                )}

                <button
                  onClick={cancelGame}
                  className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded transition font-semibold"
                >
                  End Game
                </button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Game;

// ============================================================================
// LIFELINES COMPONENT
// ============================================================================

type LifeLinesProps = {
  handleFifty: () => void;
  handleExtraTime: () => void;
  handleHint: () => void;
  lifelines: Lifelines;
};

const LifeLines = ({
  handleFifty,
  handleExtraTime,
  handleHint,
  lifelines,
}: LifeLinesProps) => {
  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={handleFifty}
        disabled={lifelines.fifty}
        className={`px-3 py-2 rounded text-sm font-semibold transition ${
          lifelines.fifty
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        💡 50/50
      </button>

      <button
        onClick={handleExtraTime}
        disabled={lifelines.extraTime}
        className={`px-3 py-2 rounded text-sm font-semibold transition ${
          lifelines.extraTime
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        ⏱ +{EXTRA_TIME_BONUS}s
      </button>

      <button
        onClick={handleHint}
        disabled={lifelines.hint}
        className={`px-3 py-2 rounded text-sm font-semibold transition ${
          lifelines.hint
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        🎯 Hint
      </button>
    </div>
  );
};

/*
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import fakeNamesData from "../../fakeNames.json";
import {useSound} from '../hooks/useSound';
import HowToPlay from "../components/HowToPlay";

interface Quote {
  quote: string;
  character: string;
  movie: string;
  source: string;
}

type Lifelines = {
  fifty: boolean;
  extraTime: boolean;
  hint: boolean;
};

const Game = () => {

  const playCorrect = useSound("/sounds/correct.mp3");
  const playWrong = useSound("/sounds/wrong.mp3");
  const playTick = useSound("/sounds/tick (mp3cut).mp3");
  const playNext = useSound("/sounds/click.mp3");

  const [soundon, setSoundon] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mode, setMode] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [lifelines, setLifelines] = useState<Lifelines>({
    fifty: false,
    extraTime: false,
    hint: false,
  });
  const toggleSound = () => setSoundon(!soundon);
  



  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/quote${mode ? `?mode=${mode}` : ""}`
      );
      const data = await res.json();

      const newQuote: Quote = {
        quote: data.quote,
        character: data.character,
        movie: data.movie,
        source: data.source,
      };

      const fakeNames =
        data.category === "anime"
          ? fakeNamesData.anime
          : data.category === "movie"
          ? fakeNamesData.movie
          : fakeNamesData.default;

      const shuffled = [
        newQuote.character,
        ...fakeNames
          .filter((n) => n !== newQuote.character)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3),
      ].sort(() => 0.5 - Math.random());

      setQuote(newQuote);
      setOptions(shuffled);
      setSelected(null);
      setRevealed(false);
      setTimeLeft(15);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (questionCount + 1 >= 10) {
      setGameOver(true);
    } else {
      setQuestionCount((prev) => prev + 1);
      playNext();
      fetchQuote();
    }
  };

  useEffect(() => {
    if (!revealed && timeLeft > 0 && isPlaying) {
      const timer = setTimeout(() => { 
        soundon && playTick();
        setTimeLeft(timeLeft - 1)}, 1000);

      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && !revealed && isPlaying) {
      setRevealed(true);
      setTimeout(handleNext, 2000);
    }
  }, [timeLeft, revealed, isPlaying]);

  //Sounds handler

  const handleAnswer = (selected: string) => {
    if (selected === quote?.character) {
      playCorrect();
      setScore(score + 1);
    } else {
      playWrong();
    }
   
  };

  // LifeLine Handler
  // 💡 50/50
const handleFifty = () => {
  if (lifelines.fifty || !quote) return;

  const correct = quote.character;
  const wrongs = options.filter((opt) => opt !== correct);
  const keptWrong = wrongs.sort(() => 0.5 - Math.random()).slice(0, 1); // keep 1 wrong + correct
  const newOptions = [correct, ...keptWrong].sort(() => 0.5 - Math.random());

  setOptions(newOptions);
  setLifelines((prev) => ({ ...prev, fifty: true }));
};

// ⏱ +5s
const handleExtraTime = () => {
  if (lifelines.extraTime) return;
  setTimeLeft((prev) => prev + 5);
  setLifelines((prev) => ({ ...prev, extraTime: true }));
};

// 🎯 Hint
const handleHint = () => {
  if (lifelines.hint || !quote) return;
  alert(`Hint: The name starts with "${quote.character[0]}"`);
  setLifelines((prev) => ({ ...prev, hint: true }));
};


  const handleSelect = (option: string) => {
    if (!revealed) setSelected(option);
  };

  const handleReveal = () => {
    if (selected) {
      setRevealed(true);
      if (quote && selected === quote.character) {
        setScore((prev) => prev + 1);
      }
    }
  };

  const startGame = (selectedMode: string) => {
    setFetching(true);
    setMode(selectedMode);
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    setIsPlaying(true);
    fetchQuote();
    setFetching(false);
    setLifelines({ fifty: false, extraTime: false, hint: false });
  };

  const restartGame = () => {
    setMode(null);
    setGameOver(false);
    setQuote(null);
    setLifelines({ fifty: false, extraTime: false, hint: false });
  };

  useEffect(() => {
    if (mode) fetchQuote();
  }, [mode]);

  // 🎨 Dynamic gradient theme per mode
  const themeGradient =
    mode === "anime"
      ? "from-pink-500 via-purple-500 to-indigo-500"
      : mode === "movie"
      ? "from-gray-900 via-blue-900 to-yellow-700"
      : "from-yellow-500 via-green-500 to-blue-500";

  // 🎨 Dynamic background image per mode    
  const backgroundImage =
  mode === "anime"
    ? "url('/mei.jpg')"
    : mode === "movie"
    ? "url('/it.jpg')"
    : "url('/mizu.jpg')";


  const progressColor =
    mode === "anime" ? "bg-pink-400" : mode === "movie" ? "bg-yellow-400" : "bg-green-400";

  // 🟡 Mode Selection Screen
  if (mode === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center p-4">
        <h1 className="text-4xl font-bold mb-6">Who Said It? 🎬</h1>
        <p className="mb-6 text-lg">Choose your mode to start:</p>

        <div className="flex flex-col gap-4 w-64">
          <button
            onClick={() => startGame("movie")}
            className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition text-lg"
          >
            🎬 Movie Mode
          </button>
          <button
            onClick={() => startGame("anime")}
            className="bg-pink-500 hover:bg-pink-600 py-3 rounded-lg transition text-lg"
          >
            🌸 Anime Mode
          </button>
          <button
            onClick={() => startGame("")}
            className="bg-yellow-500 hover:bg-yellow-600 py-3 rounded-lg transition text-lg"
          >
            🎲 Random Mode
          </button>

          {isOpen ? 
          <HowToPlay setIsOpen={setIsOpen} />
          :
          <button onClick={() => setIsOpen(true)} className="bg-green-500 hover:bg-green-600 py-3 mt-20 rounded-lg transition text-lg">
            📖 How to Play
          </button>}
          <Link
            to="/"
            className="bg-gray-500 hover:bg-gray-600 py-3 mt-20 rounded-lg transition text-lg"
          >
            🏠 Home
          </Link>
        </div>
      </div>
    );
  }

  // 🟥 Game Over Screen
  if (gameOver) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${themeGradient} text-white p-6 text-center`}
      >
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-6">
          You scored <span className="font-bold text-green-300">{score}</span> / 10 🎯
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => startGame(mode!)}
            disabled={mode === null}
            className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded"
          >
            🔁 Play Again
          </button>
          <button
            onClick={restartGame}
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded"
          >
            Change Mode / Home
          </button>
        </div>
      </div>
    );
  }

  if (loading)
    return <div className="min-h-screen mt-10 text-white">Loading...</div>;

  if (fetching)
    return <div className="min-h-screen mt-10 text-white">Starting Game...</div>;

  // 🎮 Game Screen
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-cover bg-no-repeat bg-gradient-to-br ${themeGradient} text-white p-4 transition-all duration-500`}
    style={{
    backgroundImage: `${backgroundImage}, linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.6))`,
    backgroundBlendMode: "overlay",
  }}
    >
      <h1 className="text-3xl font-bold mb-4">Who Said It? 🎬</h1>

      <LifeLines
        handleFifty={handleFifty}
        handleExtraTime={handleExtraTime}
        handleHint={handleHint}
        lifelines={lifelines}
      />
      <p className="mb-2 text-gray-200">
        Question {questionCount + 1} / 10 • Score: {score}
      </p>

      {/* 🧭 Progress Bar 
      <div className="w-full max-w-xl bg-gray-300 rounded-full h-3 mt-2 mb-4">
        <div
          className={`${progressColor} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${((questionCount + 1) / 10) * 100}%` }}
        ></div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-yellow-300 text-lg mb-4">⏳ {timeLeft}s left</span>
      <button onClick={toggleSound} className="mb-3">
        {soundon ? "🔊" : "🔇"}
      </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questionCount}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl text-center"
        >
          {quote && (
            <>
              <p className="text-xl italic mb-6">"{quote.quote}"</p>

              <div className="grid grid-cols-1 gap-3 mb-6 w-full">
                {options.map((option, i) => {
                  const isCorrect = option === quote.character;
                  const isSelected = option === selected;
                  const showResult = revealed && isSelected;

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(option)}
                      disabled={revealed}
                      className={`px-4 py-2 rounded text-lg transition w-full
                        ${
                          revealed
                            ? isCorrect
                              ? "bg-green-600"
                              : isSelected
                              ? "bg-red-600"
                              : "bg-gray-700"
                            : isSelected
                            ? "bg-blue-500"
                            : "bg-gray-700 hover:bg-gray-600"
                        }
                      `}
                    >
                      {option}
                      {showResult && (
                        <span className="ml-2">
                          {isCorrect ? "✅" : "❌"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {!revealed ? (
                <button
                  onClick={() => {
                    handleReveal();
                    if (selected) handleAnswer(selected);
                  }}
                  disabled={!selected}
                  className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded transition disabled:opacity-50"
                >
                  Reveal
                </button>
              ) : (
                <div className="mt-4">
                  <p className="text-lg">
                    ✅ <span className="font-semibold">{quote.character}</span> —{" "}
                    <span className="italic">{quote.movie}</span>
                  </p>
                  <button
                    onClick={handleNext}
                    className="my-4 bg-green-500 hover:bg-green-600 px-5 py-2 rounded transition"
                  >
                    Next Quote
                  </button>
                </div>
              )}
              <button
                onClick={() => {setGameOver(true), setIsPlaying(false)}}
                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded transition ml-3"
              >
                Cancel
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Game;

type LifeLinesProps = {
  handleFifty: () => void;
  handleExtraTime: () => void;
  handleHint: () => void;
  lifelines: Lifelines;
};

const LifeLines = ({handleFifty, handleExtraTime, handleHint, lifelines}: LifeLinesProps) => {

  return (
    <div className="flex gap-4 mb-4">
  <button
    onClick={handleFifty}
    disabled={lifelines.fifty}
    className={`px-3 py-2 rounded text-sm ${
      lifelines.fifty ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
    }`}
  >
    💡 50/50
  </button>

  <button
    onClick={handleExtraTime}
    disabled={lifelines.extraTime}
    className={`px-3 py-2 rounded text-sm ${
      lifelines.extraTime ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
    }`}
  >
    ⏱ +5s
  </button>

  <button
    onClick={handleHint}
    disabled={lifelines.hint}
    className={`px-3 py-2 rounded text-sm ${
      lifelines.hint ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
    }`}
  >
    🎯 Hint
  </button>
</div>

  )
}

*/