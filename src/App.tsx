import { Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-red-500 to-purple-600">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;

