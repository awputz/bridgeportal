import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Image, Star, ArrowRight } from "lucide-react";
import { useMarketingTemplates, useFeaturedTemplates } from "@/hooks/marketing";

const MediaLibrary = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { data: templates, isLoading } = useMarketingTemplates(
    categoryFilter === "all" ? undefined : categoryFilter
  );
  const { data: featuredTemplates } = useFeaturedTemplates();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/20">
          <Image className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extralight text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            Browse templates and manage your assets
          </p>
        </div>
      </div>

      {/* Featured Templates */}
      {featuredTemplates && featuredTemplates.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            Featured Templates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTemplates.slice(0, 4).map((template) => (
              <Link 
                key={template.id} 
                to={`/portal/marketing/create?template=${template.id}`}
              >
                <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center relative">
                      {template.thumbnail_url ? (
                        <img 
                          src={template.thumbnail_url} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image className="h-8 w-8 text-muted-foreground/50" />
                      )}
                      <Badge className="absolute top-2 right-2 bg-amber-500/90">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-foreground text-sm truncate">
                        {template.name}
                      </h3>
                      <p className="text-xs text-muted-foreground capitalize">
                        {template.category}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Tabs */}
      <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="print">Print</TabsTrigger>
          <TabsTrigger value="pitch">Pitch</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Link 
              key={template.id} 
              to={`/portal/marketing/create?template=${template.id}`}
            >
              <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    {template.thumbnail_url ? (
                      <img 
                        src={template.thumbnail_url} 
                        alt={template.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-foreground text-sm truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {template.category} • {template.type.replace('-', ' ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Image className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground max-w-sm">
              {categoryFilter === "all" 
                ? "Templates will appear here once they are added."
                : `No ${categoryFilter} templates available.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaLibrary;
