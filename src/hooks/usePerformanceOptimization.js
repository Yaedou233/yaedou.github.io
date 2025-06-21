import { useState, useEffect } from "react";

/**
 * 自定义钩子，用于性能优化
 * @returns {Object} 包含性能优化状态的对象
 */
export const usePerformanceOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 检测用户是否启用了减少动画
    const checkReducedMotion = () => {
      setIsReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    // 初始检测
    checkMobile();
    checkReducedMotion();

    // 添加事件监听器
    window.addEventListener("resize", checkMobile);
    window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .addEventListener("change", checkReducedMotion);

    // 清理函数
    return () => {
      window.removeEventListener("resize", checkMobile);
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .removeEventListener("change", checkReducedMotion);
    };
  }, []);

  return { isMobile, isReducedMotion };
};
