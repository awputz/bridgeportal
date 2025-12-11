import { useState, useEffect, useCallback } from "react";
import { Search, ArrowRight, Users, Building2, FileText, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: "page" | "team" | "service" | "resource";
  path: string;
}

const searchData: SearchResult[] = [
  // Pages
  { id: "home", title: "Home", description: "Main landing page", category: "page", path: "/" },
  { id: "about", title: "About Us", description: "Learn about Bridge Advisory Group", category: "page", path: "/about" },
  { id: "team", title: "Our Team", description: "Meet our expert professionals", category: "team", path: "/team" },
  { id: "careers", title: "Careers", description: "Join our growing team", category: "page", path: "/careers" },
  { id: "contact", title: "Contact", description: "Get in touch with us", category: "page", path: "/contact" },
  { id: "research", title: "Research", description: "Market research and insights", category: "resource", path: "/research" },
  { id: "press", title: "Press", description: "News and press releases", category: "resource", path: "/press" },
  
  // Services
  { id: "investment-sales", title: "Investment Sales", description: "Commercial property transactions", category: "service", path: "/services/investment-sales" },
  { id: "commercial-leasing", title: "Commercial Leasing", description: "Office and retail leasing", category: "service", path: "/services/commercial-leasing" },
  { id: "residential", title: "Residential", description: "Residential property services", category: "service", path: "/services/residential" },
  { id: "capital-advisory", title: "Capital Advisory", description: "Financing and capital solutions", category: "service", path: "/services/capital-advisory" },
  { id: "property-management", title: "Property Management", description: "Asset management services", category: "service", path: "/services/property-management" },
  { id: "marketing", title: "Marketing", description: "Property marketing services", category: "service", path: "/services/marketing" },
  { id: "billboard", title: "Billboard", description: "Outdoor advertising solutions", category: "service", path: "/services/billboard" },
];

const categoryIcons = {
  page: FileText,
  team: Users,
  service: Briefcase,
  resource: Building2,
};

const categoryLabels = {
  page: "Pages",
  team: "Team",
  service: "Services",
  resource: "Resources",
};

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Filter results based on query
  const filteredResults = query.length > 0
    ? searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : searchData.slice(0, 6);

  // Group results by category
  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
        e.preventDefault();
        navigate(filteredResults[selectedIndex].path);
        setOpen(false);
        setQuery("");
      }
    },
    [filteredResults, selectedIndex, navigate]
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery("");
  };

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 bg-card/95 backdrop-blur-xl border-border/50">
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pages, services, team..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent py-4 px-3 text-base outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd className="rounded border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {Object.entries(groupedResults).map(([category, results]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              
              return (
                <div key={category} className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Icon className="h-3 w-3" />
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  
                  {results.map((result, index) => {
                    const globalIndex = filteredResults.indexOf(result);
                    
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result.path)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                          globalIndex === selectedIndex
                            ? "bg-accent/10 text-foreground"
                            : "hover:bg-accent/5 text-foreground/80"
                        )}
                      >
                        <div>
                          <p className="font-medium">{result.title}</p>
                          <p className="text-sm text-muted-foreground">{result.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {query && filteredResults.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <p>No results found for "{query}"</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
