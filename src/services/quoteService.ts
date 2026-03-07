import movieQuotes from '../data/movieQuotes.json';
import animeQuotes from '../data/animeQuotes.json';
import fakeNamesData from '../data/fakeNames.json';

export interface Quote {
  quote: string;
  character: string;
  movie: string;
  source: string;
}

type GameMode = 'movie' | 'anime' | '';

/**
 * Get a random quote based on the selected mode
 * @param mode - 'movie', 'anime', or '' for random
 * @returns A random quote object
 */
export const getRandomQuote = (mode: GameMode): Quote => {
  let quotePool = movieQuotes;

  if (mode === 'anime') {
    quotePool = animeQuotes;
  } else if (mode === 'movie') {
    quotePool = movieQuotes;
  } else if (mode === '') {
    // Random mix of both
    quotePool = Math.random() < 0.5 ? movieQuotes : animeQuotes;
  }

  const randomQuote =
    quotePool[Math.floor(Math.random() * quotePool.length)];

  return {
    quote: randomQuote.quote,
    character: randomQuote.character,
    movie: randomQuote.movie,
    source: mode === 'anime' || (mode === '' && quotePool === animeQuotes) ? 'anime' : 'movie',
  };
};

/**
 * Generate answer options (1 correct + 3 wrong)
 * @param correctCharacter - The correct answer
 * @param mode - Game mode to determine which fake names to use
 * @returns Shuffled array of 4 options
 */
export const generateOptions = (correctCharacter: string, mode: GameMode): string[] => {
  let fakeNames: string[] = [];

  if (mode === 'anime') {
    fakeNames = fakeNamesData.anime;
  } else if (mode === 'movie') {
    fakeNames = fakeNamesData.movie;
  } else {
    fakeNames = fakeNamesData.default;
  }

  // Filter out the correct answer from fake names
  const availableFakes = fakeNames.filter((name) => name !== correctCharacter);

  // Randomly select 3 wrong answers
  const wrongAnswers = [];
  for (let i = 0; i < 3; i++) {
    const randomIdx = Math.floor(Math.random() * availableFakes.length);
    wrongAnswers.push(availableFakes[randomIdx]);
    availableFakes.splice(randomIdx, 1);
  }

  // Combine and shuffle all options
  const allOptions = [correctCharacter, ...wrongAnswers];
  return allOptions.sort(() => Math.random() - 0.5);
};
