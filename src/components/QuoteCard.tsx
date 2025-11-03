type QuoteCardProps = {
  quote: string;
  character: string;
  source: string;
};

const QuoteCard = ({ quote, character, source }: QuoteCardProps) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-full max-w-lg text-center border border-gray-700">
      <p className="text-xl italic mb-4">“{quote}”</p>
      <h2 className="text-lg font-semibold text-red-400">— {character}</h2>
      <p className="text-sm text-gray-400 mt-1">{source}</p>
    </div>
  );
};

export default QuoteCard;
