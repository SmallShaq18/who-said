// hooks/useSound.js
export const useSound = (src: string) => {
  const play = () => {
    const audio = new Audio(src);
    audio.volume = 0.6; // adjust if needed
    audio.play().catch((err) => {
      console.warn("Audio play failed:", err);
    });
  };
  return play;
};
