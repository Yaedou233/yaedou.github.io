import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * 图片卡片组件
 * @param {string} imageUrl - 图片URL
 * @param {string} description - 图片描述文字
 * @returns {JSX.Element} 图片卡片组件
 */
const ImageCard = ({ imageUrl, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      whileTap={{ scale: 0.98 }}
    >
      {/* 图片区域 - 占卡片高度的60-70% */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">图片加载失败</p>
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt="卡片图片" 
            className="w-full h-full object-cover transition-opacity duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        )}
      </div>
      
      {/* 文字描述区域 */}
      <div className="p-4">
        <div className={`text-base text-gray-800 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {description}
        </div>
        
        {description.length > 100 && (
          <button 
            onClick={toggleExpand}
            className="mt-2 flex items-center text-blue-500 text-sm font-medium"
          >
            {isExpanded ? (
              <>
                收起 <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                展开 <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ImageCard;
