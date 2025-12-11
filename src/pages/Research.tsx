import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Download, Calendar, Tag, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ResearchDocument {
  id: string;
  title: string;
  abstract: string;
  year: number;
  division: string;
  type: string;
  downloadUrl?: string;
}

// Placeholder documents - replace with real data later
const placeholderDocuments: ResearchDocument[] = [
  {
    id: "1",
    title: "2024 Year In Review",
    abstract: "A comprehensive look at Bridge Advisory Group's performance, transactions, and market insights from the past year. Includes analysis of key trends and outlook for 2025.",
    year: 2024,
    division: "Firm Wide",
    type: "Year in Review",
  },
  {
    id: "2",
    title: "Q4 2024 NYC Multifamily Market Review",
    abstract: "Detailed analysis of the New York City multifamily market including cap rates, pricing trends, and transaction volume across all five boroughs.",
    year: 2024,
    division: "Investment Sales",
    type: "Market Review",
  },
  {
    id: "3",
    title: "Manhattan Office Leasing Outlook 2024",
    abstract: "Current state of Manhattan office leasing with insights on tenant demand, rental rates, and emerging neighborhood trends.",
    year: 2024,
    division: "Commercial Leasing",
    type: "Market Review",
  },
  {
    id: "4",
    title: "NYC Residential Rental Market Report - Fall 2024",
    abstract: "Analysis of residential rental trends across Manhattan, Brooklyn, and Queens including median rents, vacancy rates, and neighborhood spotlights.",
    year: 2024,
    division: "Residential",
    type: "Market Review",
  },
  {
    id: "5",
    title: "Capital Markets Update: Lending Landscape Q3 2024",
    abstract: "Overview of current lending conditions, interest rate impacts, and financing strategies for commercial real estate in the current market environment.",
    year: 2024,
    division: "Capital Advisory",
    type: "Research Note",
  },
  {
    id: "6",
    title: "2023 Year In Review",
    abstract: "Bridge Advisory Group's annual review covering major transactions, team growth, and market positioning throughout 2023.",
    year: 2023,
    division: "Firm Wide",
    type: "Year in Review",
  },
  {
    id: "7",
    title: "Brooklyn Investment Sales Annual Report 2023",
    abstract: "Deep dive into Brooklyn's investment sales market with transaction data, emerging neighborhoods, and investor activity analysis.",
    year: 2023,
    division: "Investment Sales",
    type: "Market Review",
  },
  {
    id: "8",
    title: "Real Estate Marketing Best Practices",
    abstract: "Insights on effective property marketing strategies, digital campaigns, and brand positioning in the competitive NYC real estate market.",
    year: 2023,
    division: "Marketing",
    type: "White Paper",
  },
];

export default function Research() {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const heroReveal = useScrollReveal(0.1);
  const documentsReveal = useScrollReveal(0.1);

  const years = [...new Set(placeholderDocuments.map(d => d.year))].sort((a, b) => b - a);
  const divisions = [...new Set(placeholderDocuments.map(d => d.division))].sort();
  const types = [...new Set(placeholderDocuments.map(d => d.type))].sort();

  const filteredDocuments = placeholderDocuments.filter(doc => {
    if (yearFilter !== "all" && doc.year !== parseInt(yearFilter)) return false;
    if (divisionFilter !== "all" && doc.division !== divisionFilter) return false;
    if (typeFilter !== "all" && doc.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20">
      {/* Hero */}
      <section className="pb-16 md:pb-20 border-b border-white/5" ref={heroReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className={`text-center transition-all duration-700 ${
            heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 animate-fade-in">
              Research And Reports
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
              Formal reports, yearly reviews, and market studies from Bridge Advisory Group.
            </p>
            <p className="text-base text-muted-foreground/70 font-light max-w-2xl mx-auto mt-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              These documents are part of how Bridge shares its thinking with clients and the market.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="font-light">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                  {divisions.map(division => (
                    <SelectItem key={division} value={division}>{division}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 md:py-16" ref={documentsReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-light">No documents match your current filters.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredDocuments.map((doc, index) => (
                <div 
                  key={doc.id}
                  className={`group p-6 md:p-8 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 ${
                    documentsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-light bg-white/5 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {doc.year}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-light bg-accent/10 text-accent">
                          <Tag className="h-3 w-3" />
                          {doc.division}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-light bg-white/5 text-muted-foreground">
                          {doc.type}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-light mb-3 group-hover:text-foreground transition-colors">
                        {doc.title}
                      </h3>
                      
                      <p className="text-muted-foreground font-light leading-relaxed mb-4">
                        {doc.abstract}
                      </p>
                      
                      <Button variant="outline" size="sm" className="font-light group/btn" disabled={!doc.downloadUrl}>
                        <Download className="h-4 w-4 mr-2" />
                        {doc.downloadUrl ? "Download PDF" : "Coming Soon"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
          <p className="text-muted-foreground font-light mb-6">
            Looking for specific market data or analysis?
          </p>
          <Button asChild className="font-light">
            <Link to="/contact">
              Contact Our Research Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
