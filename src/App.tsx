import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./index.css";
import Home from "./pages/Home";
import Game from "./pages/Game";
import IntroScreen from "./components/IntroScreen";
import { useState } from "react";

function App() {
  const [started, setStarted] = useState(false);
  const location = useLocation();

  if (!started) {
    return <IntroScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;


/*import { Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Game from "./pages/Game";
import IntroScreen from "./components/IntroScreen";
import { useState } from "react";

function App() {

  const [started, setStarted] = useState(false);

  if (!started) {
    return <IntroScreen onStart={() => setStarted(true)} />;
  }
  
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-red-500 to-purple-600">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;*/

