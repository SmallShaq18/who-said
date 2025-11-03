import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QuoteCard from "../components/QuoteCard";


type Quote = {
  quote: string;
  character: string;
  source: string;
  movie: string;
};

function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const getRandomQuote = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://who-said.onrender.com/api/quote");
      
      const data = await res.json();
      //console.log("data", data);
      //console.log("data.result[0]", data.result[0]);
      //const quote = data.result[0];
      setQuote({
        quote: data.quote,
        character: data.character,
        source: data.source,
        movie: data.movie,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <div className="m-5 rounded-lg p-5 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white gap-6">
      <h1 className="text-4xl font-bold text-center mb-4">Who Said That? 🎬</h1>
      {loading ? (
        <p className="text-gray-400">Loading quote...</p>
      ) : (
        quote && (
          <QuoteCard
            quote={quote.quote}
            character={quote.character}
            source={quote.movie || "Unknown"}
          />
        )
      )}
      <button
        onClick={getRandomQuote}
        className="mt-6 bg-red-400 hover:bg-red-500 px-6 py-3 rounded-full font-semibold transition"
      >
        Next Quote 🔁
      </button>

      <Link
        to="/game"
        className="mt-6 bg-red-400 hover:bg-red-500 px-6 py-3 rounded-full font-semibold transition"
      >
        Go to Game Page
      </Link>
    </div>
  );
}

export default Home;
