import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import path from "path";
import { readFile } from "fs/promises";
//import movieQuotes from "./movieQuotes.json";

const app = express();
app.use(cors());

let localQuotes = [];

// Load JSON once and cache it in memory
(async () => {
  try {
    const data = await readFile(new URL("./movieQuotes.json", import.meta.url), "utf-8");
    localQuotes = JSON.parse(data);
    console.log(`✅ Loaded ${localQuotes.length} local quotes`);
  } catch (err) {
    console.error("❌ Failed to load local quotes:", err);
  }
})();


/*app.get("/api/quote", async (req, res) => {
  // 50-50 chance between API or local JSON
  const useLocal = Math.random() < 0.5;

  if (useLocal) {
    try {
      const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
      return res.json({
        movie: randomQuote.movie,
        character: randomQuote.character,
        quote: randomQuote.quote,
        source: "local"
      });
    } catch (error) {
      console.error("Local quote fetch failed:", error);
      // fallback to API
    }
  }

  // Fallback to Katanime API
  try {
    const response = await fetch("https://katanime.vercel.app/api/getrandom");
    const data = await response.json();
    
    if (data.sukses && data.result.length > 0) {
        const quoteObj = data.result[0];
        return res.json({
          quote: quoteObj.english,
          movie: quoteObj.anime,
          character: quoteObj.character,
          source: "Katanime"
        });
    }
  } catch (error) {
    console.error("Katanime API failed:", error);
    res.status(500).json({ error: "Katanime API failed." });
  }
});*/
app.get("/api/quote", async (req, res) => {
  let { mode } = req.query;
  // Always normalize mode
  const selectedMode = mode || (Math.random() < 0.5 ? "anime" : "movie");

  // If no mode provided, randomly choose between anime and movie
  if (!selectedMode) {
    selectedMode = Math.random() < 0.5 ? "anime" : "movie";
  }

  try {
    if (selectedMode === "anime") {
      const response = await fetch("https://katanime.vercel.app/api/getrandom");
      const data = await response.json();
      
      if (data.sukses && data.result.length > 0) {
        const quoteObj = data.result[0];
        return res.json({
          quote: quoteObj.english,
          movie: quoteObj.anime,
          character: quoteObj.character,
          source: "Katanime",
          category: "anime",
        });
    }
    }

    if (selectedMode === "movie") {
      const randomQuote =
        localQuotes[Math.floor(Math.random() * localQuotes.length)];
      return res.json({
        ...randomQuote,
        source: "local",
        //mode: "movie",
        category: "movie",
      });
    }

    return res.status(400).json({ error: "Invalid mode", category: selectedMode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quote", category: selectedMode });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
