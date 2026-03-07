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

/*import { motion } from 'framer-motion';

type BackgroundEffectsProps = {
  theme: string;
};

const BackgroundEffects = ({ theme }: BackgroundEffectsProps) => {
  const getBlobColors = () => {
    switch (theme) {
      case 'movie':
        return { blob1: 'from-amber-500 to-orange-600', blob2: 'from-blue-500 to-blue-600' };
      case 'anime':
        return { blob1: 'from-pink-500 to-rose-600', blob2: 'from-purple-500 to-indigo-600' };
      default:
        return { blob1: 'from-green-500 to-emerald-600', blob2: 'from-cyan-500 to-teal-600' };
    }
  };

  const colors = getBlobColors();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Blob 1 *
      <motion.div
        className={`absolute w-96 h-96 bg-gradient-to-br ${colors.blob1} rounded-full blur-3xl opacity-20`}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          top: '-10%',
          left: '-10%',
        }}
      />

      {/* Blob 2 *
      <motion.div
        className={`absolute w-80 h-80 bg-gradient-to-br ${colors.blob2} rounded-full blur-3xl opacity-20`}
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          bottom: '10%',
          right: '-5%',
        }}
      />

      {/* Blob 3 *
      <motion.div
        className={`absolute w-72 h-72 bg-gradient-to-br ${colors.blob1} rounded-full blur-3xl opacity-10`}
        animate={{
          x: [0, 50, -100, 0],
          y: [0, 50, -100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          top: '50%',
          right: '10%',
        }}
      />
    </div>
  );
};

export default BackgroundEffects;*/
