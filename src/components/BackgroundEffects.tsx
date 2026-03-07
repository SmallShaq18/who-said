import { motion } from 'framer-motion';

type BackgroundEffectsProps = {
  theme: string;
};

type OrbConfig = { x: string; y: string; size: number; color: string; duration: number; delay: number };

const BackgroundEffects = ({ theme }: BackgroundEffectsProps) => {
  const getOrbs = (): OrbConfig[] => {
    switch (theme) {
      case 'movie':
        return [
          { x: '-8%', y: '-5%', size: 500, color: 'rgba(251,191,36,0.07)', duration: 22, delay: 0 },
          { x: '75%', y: '65%', size: 380, color: 'rgba(180,120,20,0.05)', duration: 28, delay: 3 },
          { x: '55%', y: '-10%', size: 260, color: 'rgba(251,191,36,0.04)', duration: 18, delay: 7 },
        ];
      case 'anime':
        return [
          { x: '-5%', y: '-5%', size: 480, color: 'rgba(244,114,182,0.07)', duration: 22, delay: 0 },
          { x: '72%', y: '60%', size: 360, color: 'rgba(167,60,180,0.05)', duration: 26, delay: 4 },
          { x: '50%', y: '-8%', size: 240, color: 'rgba(244,114,182,0.04)', duration: 20, delay: 6 },
        ];
      default:
        return [
          { x: '-5%', y: '-5%', size: 480, color: 'rgba(52,211,153,0.07)', duration: 22, delay: 0 },
          { x: '72%', y: '60%', size: 360, color: 'rgba(16,180,120,0.05)', duration: 26, delay: 4 },
          { x: '50%', y: '-8%', size: 240, color: 'rgba(52,211,153,0.04)', duration: 20, delay: 6 },
        ];
    }
  };

  const orbs = getOrbs();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }}
      />
    </div>
  );
};

export default BackgroundEffects;

