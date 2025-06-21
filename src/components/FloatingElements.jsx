import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePerformanceOptimization } from "../hooks/usePerformanceOptimization";

const FloatingElements = () => {
  const [elements, setElements] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { isMobile, isReducedMotion } = usePerformanceOptimization();

  // 生成随机元素
  useEffect(() => {
    const generateElements = () => {
      // 在移动设备上减少元素数量
      const count = isMobile
        ? Math.floor(Math.random() * 3) + 5 // 5-7个元素
        : Math.floor(Math.random() * 5) + 8; // 8-12个元素

      const newElements = [];

      for (let i = 0; i < count; i++) {
        const isCoin = Math.random() > 0.5;
        const size = isCoin
          ? Math.floor(Math.random() * 10) + 15
          : Math.floor(Math.random() * 10) + 20;
        const opacity = 0.6 + Math.random() * 0.2; // 0.6-0.8
        const speed = isReducedMotion
          ? 1.5 // 减少动画速度
          : 0.5 + Math.random() * 1; // 0.5-1.5秒/100px
        const colors = [
          "bg-red-400",
          "bg-blue-400",
          "bg-green-400",
          "bg-yellow-400",
          "bg-purple-400",
          "bg-pink-400",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        newElements.push({
          id: i,
          isCoin,
          size,
          opacity,
          speed,
          color,
          x: Math.random() * (windowSize.width - size),
          y: Math.random() * (windowSize.height - size),
          rotation: Math.random() * 360,
          direction: Math.random() * Math.PI * 2,
          rotationSpeed: isReducedMotion
            ? 0 // 禁用旋转
            : (Math.random() - 0.5) * 0.02,
        });
      }

      return newElements;
    };

    setElements(generateElements());

    // 监听窗口大小变化
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, isReducedMotion]);

  // 更新元素位置
  useEffect(() => {
    if (isReducedMotion) return; // 如果用户启用了减少动画，则不更新位置

    const updatePositions = () => {
      setElements((prevElements) =>
        prevElements.map((element) => {
          // 计算新位置
          let newX = element.x + Math.cos(element.direction) * 0.5;
          let newY = element.y + Math.sin(element.direction) * 0.5;
          let newDirection = element.direction;

          // 边界检测
          if (newX < 0 || newX > windowSize.width - element.size) {
            newDirection = Math.PI - newDirection;
            newX = Math.max(0, Math.min(newX, windowSize.width - element.size));
          }

          if (newY < 0 || newY > windowSize.height - element.size) {
            newDirection = -newDirection;
            newY = Math.max(0, Math.min(newY, windowSize.height - element.size));
          }

          // 随机改变方向
          if (Math.random() < 0.01) {
            newDirection += (Math.random() - 0.5) * 0.5;
          }

          return {
            ...element,
            x: newX,
            y: newY,
            direction: newDirection,
            rotation: element.rotation + element.rotationSpeed,
          };
        })
      );
    };

    const interval = setInterval(updatePositions, 16); // 约60fps
    return () => clearInterval(interval);
  }, [windowSize, isReducedMotion]);

  // 鼠标悬停效果
  const handleMouseEnter = (id) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id
          ? { ...element, opacity: 1, speed: element.speed * 1.5 }
          : element
      )
    );
  };

  const handleMouseLeave = (id) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id
          ? { ...element, opacity: element.opacity - 0.2, speed: element.speed / 1.5 }
          : element
      )
    );
  };

  // 处理元素点击
  const handleElementClick = (id) => {
    setElements((prevElements) => {
      // 找到被点击的元素
      const clickedElement = prevElements.find((element) => element.id === id);
      
      if (clickedElement) {
        // 从数组中移除被点击的元素
        const updatedElements = prevElements.filter((element) => element.id !== id);
        
        // 返回更新后的元素数组
        return updatedElements;
      }
      
      return prevElements;
    });
    
    // 增加计数器
    const event = new CustomEvent('floatingElementCleared', { detail: { id } });
    window.dispatchEvent(event);
  };

  return (
    <div className="fixed inset-0 pointer-events-auto z-10">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute cursor-pointer"
          style={{
            left: element.x,
            top: element.y,
            width: element.size,
            height: element.size,
            opacity: element.opacity,
            transform: `rotate(${element.rotation}deg)`,
          }}
          onMouseEnter={() => handleMouseEnter(element.id)}
          onMouseLeave={() => handleMouseLeave(element.id)}
          onClick={() => handleElementClick(element.id)}
        >
          {element.isCoin ? (
            <div
              className="w-full h-full rounded-full bg-yellow-500 shadow-md"
              style={{
                background: "radial-gradient(circle at 30% 30%, #fde047, #ca8a04)",
                boxShadow: "0 0 10px rgba(253, 224, 71, 0.5)",
              }}
            />
          ) : (
            <div
              className={`w-full h-full rounded-full ${element.color} shadow-md`}
              style={{ opacity: element.opacity }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
