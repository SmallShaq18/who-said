import { motion } from "framer-motion";

interface IntroProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black text-white relative overflow-hidden">

      {/* animated background glow */}
      <div className="absolute w-96 h-96 bg-purple-500 opacity-30 blur-3xl rounded-full animate-pulse top-20 left-10"></div>
      <div className="absolute w-96 h-96 bg-pink-500 opacity-30 blur-3xl rounded-full animate-pulse bottom-20 right-10"></div>

      <motion.div
        className="text-center space-y-8 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Who Said It?
        </motion.h1>

        <motion.p
          className="text-lg text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          The ultimate movie & anime quote challenge
        </motion.p>

        <motion.button
          onClick={onStart}
          className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg hover:bg-white/20 transition text-lg"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Enter
        </motion.button>
      </motion.div>
    </div>
  );
}