import { motion } from 'framer-motion';

type TimerBarProps = {
  timeLeft: number;
  maxTime: number;
  progressColor: string;
};

const TimerBar = ({ timeLeft, maxTime, progressColor }: TimerBarProps) => {
  const percentage = (timeLeft / maxTime) * 100;
  const isLow = timeLeft <= 5;
  const isVeryLow = timeLeft <= 3;

  const barColor = isVeryLow
    ? 'rgba(239,68,68,1)'
    : isLow
    ? 'rgba(251,191,36,1)'
    : 'rgba(52,211,153,1)';

  const barColorDim = isVeryLow
    ? 'rgba(239,68,68,0.15)'
    : isLow
    ? 'rgba(251,191,36,0.15)'
    : 'rgba(52,211,153,0.15)';

  const barGlow = isVeryLow
    ? 'rgba(239,68,68,0.5)'
    : isLow
    ? 'rgba(251,191,36,0.5)'
    : 'rgba(52,211,153,0.3)';

    const getProgressColor = () => {
    if (isVeryLow) return 'bg-red-500';
    if (isLow) return 'bg-yellow-400';
    return progressColor;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        {/* Numeric countdown */}
        <motion.div
          className="flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{
            width: 52,
            height: 40,
            background: barColorDim,
            border: `1px solid ${barColor}33`,
            boxShadow: isVeryLow ? `0 0 16px ${barGlow}` : 'none',
          }}
          animate={isVeryLow ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '1rem',
              fontWeight: 600,
              color: barColor,
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}
          >
            {timeLeft}
          </span>
        </motion.div>

        {/* Bar track */}
        <div className="flex-1 flex flex-col gap-1">
          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: 6,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${barColor}99, ${barColor})`,
                boxShadow: `0 0 8px ${barGlow}`,
              }}
              initial={false}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3, ease: 'linear' }}
            />
          </div>

          {/* Tick marks */}
          <div className="flex justify-between px-0.5">
            {Array.from({ length: maxTime + 1 }).map((_, i) => (
              <div
                key={i}
                className="w-px"
                style={{
                  height: i % 5 === 0 ? 5 : 3,
                  background: i <= timeLeft ? `${barColor}50` : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Label */}
        <div
          className="flex-shrink-0 text-right"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', lineHeight: 1.4 }}
        >
          <div>TIME</div>
          <div>LEFT</div>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-lg rounded-full h-2 border border-white/20 overflow-hidden">
        <motion.div
          className={`${getProgressColor()} h-2 rounded-full shadow-lg ${getProgressColor().includes('red') ? 'shadow-red-500/50' : getProgressColor().includes('yellow') ? 'shadow-yellow-400/50' : progressColor.includes('amber') ? 'shadow-amber-400/50' : 'shadow-green-400/50'}`}
          initial={false}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>
      </div>
    </div>
  );
};

export default TimerBar;
