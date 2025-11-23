import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PropertyDetailSkeleton = () => {
  return (
    <div className="min-h-screen pt-28 md:pt-40 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Skeleton className="h-9 w-24 mb-4 md:mb-6" />

        {/* Hero Image */}
        <Skeleton className="aspect-video md:aspect-[21/9] w-full rounded-lg mb-6 md:mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <Skeleton className="h-8 md:h-10 w-3/4 mb-3" />
              <Skeleton className="h-5 md:h-6 w-2/3 mb-4" />
              <Skeleton className="h-10 w-48 mb-4" />
              
              {/* Key Facts */}
              <div className="flex gap-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>

            {/* Description */}
            <div>
              <Skeleton className="h-7 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Skeleton className="h-7 w-32 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 md:p-6 space-y-4">
              <Skeleton className="h-6 w-32 mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
