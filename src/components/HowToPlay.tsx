import React from "react";

const HowToPlay: React.FC<{ setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsOpen }) => {
  return (
    <div className="bg-black/40 backdrop-blur-md text-white p-6 rounded-2xl shadow-lg max-w-md mx-auto text-center border border-white/10">
      <h2 className="text-2xl font-bold mb-3">🧠 How to Play</h2>
      <ul className="text-gray-200 text-base space-y-2">
        <li>🎬 Choose a mode — <span className="font-semibold">Movie</span>, <span className="font-semibold">Anime</span>, or <span className="font-semibold">Random</span>.</li>
        <li>💭 Read the quote and guess who said it.</li>
        <li>⏳ You’ve got <span className="font-semibold">15 seconds</span> to lock in your answer!</li>
        <li>💡 Use lifelines when you’re unsure.</li>
        <li>🏆 Score points for every correct answer. Reach the end to see your final score!</li>
      </ul>

      <button className="mt-4 bg-green-400 hover:bg-green-500 px-4 py-2 rounded-full font-semibold transition"
      onClick={() => setIsOpen(false)}>
        Close
      </button>
    </div>
  );
};

export default HowToPlay;
