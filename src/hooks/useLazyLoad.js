import { useState, useEffect, useRef } from "react";

/**
 * 自定义钩子，用于实现图片懒加载
 * @param {string} src - 图片URL
 * @param {Object} options - IntersectionObserver选项
 * @returns {Object} 包含加载状态和错误状态的对象
 */
export const useLazyLoad = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  
  useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const img = new Image();
        img.src = src;
        
        img.onload = () => {
          setIsLoaded(true);
          observer.disconnect();
        };
        
        img.onerror = () => {
          setHasError(true);
          observer.disconnect();
        };
      }
    }, { ...options });
    
    observer.observe(imgRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [src, options]);
  
  return { imgRef, isLoaded, hasError };
};
