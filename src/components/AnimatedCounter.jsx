import { motion, AnimatePresence } from "framer-motion";

/**
 * 动画计数器组件
 * @param {number} count - 当前计数值
 * @returns {JSX.Element} 计数器组件
 */
const AnimatedCounter = ({ count }) => {
  // 根据数字长度动态调整卡片宽度
  const getCardWidth = () => {
    const digitCount = count.toString().length;
    if (digitCount <= 1) return "w-24 md:w-32";
    if (digitCount <= 2) return "w-32 md:w-40";
    if (digitCount <= 3) return "w-40 md:w-48";
    return "w-48 md:w-56";
  };

  return (
    <motion.div
      className={`bg-white bg-opacity-80 rounded-lg p-6 shadow-lg ${getCardWidth()}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <div className="relative h-24 md:h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
            className="absolute text-6xl md:text-8xl font-bold text-center text-red-600"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AnimatedCounter;
