import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ListingCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-border">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full" />
      
      {/* Content skeleton */}
      <div className="p-4 md:p-6 space-y-3">
        {/* Address */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Neighborhood */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Price */}
        <Skeleton className="h-6 w-2/3" />
        
        {/* Bed/Bath */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
};

export const ListingCardSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
};
