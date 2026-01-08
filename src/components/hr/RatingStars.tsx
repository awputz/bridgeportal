import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  onChange?: (rating: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

export function RatingStars({
  rating,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const getRatingColor = (value: number) => {
    if (value >= 4) return 'text-emerald-400';
    if (value >= 3) return 'text-amber-400';
    if (value >= 1) return 'text-orange-400';
    return 'text-muted-foreground/30';
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayRating;
        const isHalf = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            className={cn(
              "transition-colors",
              !readOnly && "cursor-pointer hover:scale-110"
            )}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            onClick={() => !readOnly && onChange?.(starValue)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isFilled || isHalf
                  ? cn(getRatingColor(displayRating), "fill-current")
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className={cn(
          "ml-2 font-medium",
          getRatingColor(rating),
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
