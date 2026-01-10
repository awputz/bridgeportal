import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Image, Star, Search, Grid3X3, List } from "lucide-react";
import { useMarketingTemplates, useFeaturedTemplates } from "@/hooks/marketing";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

const MediaLibrary = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { data: allTemplates, isLoading } = useMarketingTemplates();
  const { data: featuredTemplates } = useFeaturedTemplates();
  
  // Get category-filtered templates
  const categoryTemplates = useMemo(() => {
    if (!allTemplates) return [];
    if (categoryFilter === "all") return allTemplates;
    return allTemplates.filter(t => t.category === categoryFilter);
  }, [allTemplates, categoryFilter]);
  
  // Apply search filter
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return categoryTemplates;
    const query = searchQuery.toLowerCase();
    return categoryTemplates.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query)
    );
  }, [categoryTemplates, searchQuery]);
  
  // Calculate category counts
  const categoryCounts = useMemo(() => {
    if (!allTemplates) return { all: 0, digital: 0, print: 0, pitch: 0, email: 0 };
    return {
      all: allTemplates.length,
      digital: allTemplates.filter(t => t.category === "digital").length,
      print: allTemplates.filter(t => t.category === "print").length,
      pitch: allTemplates.filter(t => t.category === "pitch").length,
      email: allTemplates.filter(t => t.category === "email").length,
    };
  }, [allTemplates]);

  return (
    <MarketingLayout breadcrumbs={[{ label: "Media Library" }]}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20">
            <Image className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">Media Library</h1>
            <p className="text-sm text-muted-foreground font-normal">
              Browse templates and manage your assets
            </p>
          </div>
        </div>
        
        {/* Search and View Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px] sm:w-[250px]"
            />
          </div>
          <div className="flex border rounded-lg overflow-hidden">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Templates */}
      {!searchQuery && categoryFilter === "all" && featuredTemplates && featuredTemplates.length > 0 && (
        <section>
          <h2 className="text-xl font-light tracking-tight text-foreground mb-3 flex items-center gap-2">
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
                    <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center relative overflow-hidden">
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
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary">
                          Use Template
                        </Button>
                      </div>
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
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="gap-1">
            All
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
              {categoryCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="digital" className="gap-1">
            Digital
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
              {categoryCounts.digital}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="print" className="gap-1">
            Print
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
              {categoryCounts.print}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pitch" className="gap-1">
            Pitch
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
              {categoryCounts.pitch}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-1">
            Email
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
              {categoryCounts.email}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Results Info */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found for "{searchQuery}"
        </p>
      )}

      {/* Templates Grid/List */}
      {isLoading ? (
        <LoadingState variant="card" message="Loading templates..." />
      ) : filteredTemplates && filteredTemplates.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <Link 
                key={template.id} 
                to={`/portal/marketing/create?template=${template.id}`}
              >
                <Card className="overflow-hidden cursor-pointer group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                      {template.thumbnail_url ? (
                        <img 
                          src={template.thumbnail_url} 
                          alt={template.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <Image className="h-8 w-8 text-muted-foreground/50" />
                      )}
                      {template.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-amber-500/90 text-xs">
                          <Star className="h-3 w-3" />
                        </Badge>
                      )}
                      {template.is_premium && (
                        <Badge className="absolute top-2 left-2 bg-violet-500/90 text-xs">
                          Premium
                        </Badge>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary">
                          Use Template
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors duration-300">
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
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <Link 
                key={template.id} 
                to={`/portal/marketing/create?template=${template.id}`}
              >
                <Card className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/50">
                  <CardContent className="p-0 flex items-center">
                    <div className="w-32 h-20 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      {template.thumbnail_url ? (
                        <img 
                          src={template.thumbnail_url} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image className="h-6 w-6 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground truncate">
                            {template.name}
                          </h3>
                          {template.is_featured && (
                            <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400 flex-shrink-0">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {template.is_premium && (
                            <Badge variant="secondary" className="text-xs bg-violet-500/20 text-violet-400 flex-shrink-0">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {template.category} • {template.type.replace('-', ' ')}
                        </p>
                        {template.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {template.description}
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        <EmptyState
          icon={Image}
          title="No templates found"
          description={searchQuery 
            ? `No templates match "${searchQuery}". Try a different search.`
            : categoryFilter === "all" 
            ? "Templates will appear here once they are added."
            : `No ${categoryFilter} templates available.`}
        />
      )}
    </MarketingLayout>
  );
};

export default MediaLibrary;