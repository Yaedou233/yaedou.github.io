import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const ResponsiveImageCard = ({ imageUrl, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card
          className={`overflow-hidden transition-all duration-300 ${
            isHovered ? "shadow-lg -translate-y-1" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative pb-[56.25%]"> {/* 16:9 比例 */}
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full mx-auto object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-sm">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ResponsiveImageCard;
