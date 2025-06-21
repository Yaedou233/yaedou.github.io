import { useState, useEffect } from "react";

/**
 * 自定义钩子，用于生成随机位置
 * @param {number} width - 容器宽度
 * @param {number} height - 容器高度
 * @returns {Object} 包含随机x和y坐标的对象
 */
export const useRandomPosition = (width = 1920, height = 1080) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const generateRandomPosition = () => {
    const edges = ["top", "right", "bottom", "left"];
    const randomEdge = edges[Math.floor(Math.random() * edges.length)];
    
    switch(randomEdge) {
      case "top":
        return { x: Math.random() * width, y: -100 };
      case "right":
        return { x: width + 100, y: Math.random() * height };
      case "bottom":
        return { x: Math.random() * width, y: height + 100 };
      case "left":
        return { x: -100, y: Math.random() * height };
      default:
        return { x: 0, y: 0 };
    }
  };

  useEffect(() => {
    setPosition(generateRandomPosition());
  }, [width, height]);

  return { position, generateRandomPosition };
};
