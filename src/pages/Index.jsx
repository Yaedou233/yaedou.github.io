import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "../components/AnimatedCounter";
import { useRandomPosition } from "../hooks/useRandomPosition";
import ImageCard from "../components/ImageCard";
import FloatingElements from "../components/FloatingElements";
import { usePerformanceOptimization } from "../hooks/usePerformanceOptimization";
import ResponsiveImageCard from "../components/ResponsiveImageCard";

const Index = () => {
  const [count, setCount] = useState(0);
  const [activeImage, setActiveImage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cards, setCards] = useState([
    { id: 1, imageUrl: "https://nocode.meituan.com/photo/search?keyword=cat&width=300&height=200", isVisible: true, description: "这是一只可爱的猫咪" },
    { id: 2, imageUrl: "https://nocode.meituan.com/photo/search?keyword=dog&width=300&height=200", isVisible: true, description: "这是一只忠诚的狗狗" },
    { id: 3, imageUrl: "https://nocode.meituan.com/photo/search?keyword=bird&width=300&height=200", isVisible: true, description: "这是一只自由的小鸟" },
    { id: 4, imageUrl: "https://nocode.meituan.com/photo/search?keyword=fish&width=300&height=200", isVisible: true, description: "这是一条优雅的鱼儿" }
  ]);
  const containerRef = useRef(null);
  const { position: randomPosition, generateRandomPosition } = useRandomPosition();
  const { isMobile, isReducedMotion } = usePerformanceOptimization();

  // 图片URL
  const image1Url = "https://tc.z.wiki/autoupload/ik3uen7HCtYMZXKd6P28-cr8uf3Y1niE9LQ9WvqC5m-yl5f0KlZfm6UsKj-HyTuv/20250621/I9ym/256X256/IMG-4477.png";
  const image2Url = "https://tc.z.wiki/autoupload/ik3uen7HCtYMZXKd6P28-cr8uf3Y1niE9LQ9WvqC5m-yl5f0KlZfm6UsKj-HyTuv/20250621/0q9I/256X256/IMG-4447-removebg-preview.png";
  const backgroundImageUrl = "https://nocode.meituan.com/photo/search?keyword=house&width=1920&height=1080";

  // 音效URL - 请替换为实际的音效链接
  const successSoundUrl = "https://example.com/success-sound.mp3"; // 音效1 - 成功清除元素
  const failSoundUrl = "https://example.com/fail-sound.mp3"; // 音效2 - 没有可清除的元素

  // 创建音频元素
  const successAudioRef = useRef(new Audio(successSoundUrl));
  const failAudioRef = useRef(new Audio(failSoundUrl));

  // 处理点击事件
  const handleClick = (e) => {
    if (isAnimating) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;
    
    const startPosition = generateRandomPosition();
    
    setActiveImage({
      id: Date.now(),
      startX: startPosition.x,
      startY: startPosition.y,
      endX: clickX,
      endY: clickY,
      currentImage: image1Url,
      isFirstPhase: true
    });
    
    setIsAnimating(true);
  };

  // 处理动画完成
  const handleAnimationComplete = (id) => {
    if (activeImage && activeImage.id === id && activeImage.isFirstPhase) {
      // 检查是否点击了卡片区域
      const containerRect = containerRef.current.getBoundingClientRect();
      const clickX = activeImage.endX;
      const clickY = activeImage.endY;
      
      // 查找被点击的卡片
      const clickedCardIndex = cards.findIndex(card => {
        if (!card.isVisible) return false;
        
        // 获取卡片的位置和尺寸
        const cardElement = document.getElementById(`card-${card.id}`);
        if (!cardElement) return false;
        
        const cardRect = cardElement.getBoundingClientRect();
        const cardX = cardRect.left - containerRect.left;
        const cardY = cardRect.top - containerRect.top;
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        
        // 检查点击是否在卡片区域内 (±5px精度)
        return (
          clickX >= cardX - 5 && 
          clickX <= cardX + cardWidth + 5 && 
          clickY >= cardY - 5 && 
          clickY <= cardY + cardHeight + 5
        );
      });
      
      // 如果点击了卡片，隐藏该卡片
      if (clickedCardIndex !== -1) {
        const updatedCards = [...cards];
        updatedCards[clickedCardIndex] = {
          ...updatedCards[clickedCardIndex],
          isVisible: false
        };
        setCards(updatedCards);
        
        // 只有在卡片被清除时才增加计数器
        setCount(prevCount => prevCount + 1);
        
        // 播放成功音效
        successAudioRef.current.currentTime = 0;
        successAudioRef.current.play().catch(e => console.log("音效播放失败:", e));
      } else {
        // 播放失败音效
        failAudioRef.current.currentTime = 0;
        failAudioRef.current.play().catch(e => console.log("音效播放失败:", e));
      }
      
      // 切换到第二张图片
      setActiveImage({
        ...activeImage,
        currentImage: image2Url,
        isFirstPhase: false,
        startX: activeImage.endX,
        startY: activeImage.endY,
        endX: generateRandomPosition().x,
        endY: generateRandomPosition().y
      });
    } else if (activeImage && activeImage.id === id && !activeImage.isFirstPhase) {
      // 动画完全结束
      setIsAnimating(false);
    }
  };

  // 监听小球和金币被清除的事件
  useEffect(() => {
    const handleFloatingElementCleared = () => {
      setCount(prevCount => prevCount + 1);
      
      // 播放成功音效
      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play().catch(e => console.log("音效播放失败:", e));
    };

    window.addEventListener('floatingElementCleared', handleFloatingElementCleared);
    
    return () => {
      window.removeEventListener('floatingElementCleared', handleFloatingElementCleared);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ 
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onClick={handleClick}
    >
      {/* 添加漂浮元素 */}
      <FloatingElements />
      
      {/* 半透明遮罩层，提高文字可读性 */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* 标题 - 调整margin-bottom为更紧凑的间距 */}
      <div className="absolute top-10 left-0 right-0 text-center z-10 mb-1 md:mb-2">
        <h1 className="text-5xl md:text-7xl font-bold text-white">
          赛飞儿来偷你家
        </h1>
        <p className="text-lg md:text-xl text-white mt-1">点击屏幕开始偷家</p>
      </div>
      
      {/* 计数器 */}
      <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <AnimatedCounter count={count} />
      </div>
      
      {/* 图片卡片展示区  */}
      <div className="absolute top-2/3 left-0 right-0 z-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
          {cards.map(card => (
            card.isVisible && (
              <motion.div
                id={`card-${card.id}`}
                key={card.id}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeOut" } }}
                className="w-full"
              >
                <ResponsiveImageCard 
                  imageUrl={card.imageUrl} 
                  title={`卡片 ${card.id}`}
                  description={card.description}
                />
              </motion.div>
            )
          ))}
        </div>
      </div>
      
      {/* 动画图片 */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            key={activeImage.id}
            initial={{ 
              x: activeImage.startX, 
              y: activeImage.startY,
              opacity: 0
            }}
            animate={{ 
              x: activeImage.endX, 
              y: activeImage.endY,
              opacity: 1
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: isReducedMotion ? 0.1 : 0.5,
              ease: "easeOut"
            }}
            onAnimationComplete={() => handleAnimationComplete(activeImage.id)}
            className="absolute z-20"
          >
            <img 
              src={activeImage.currentImage} 
              alt="动画角色" 
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
