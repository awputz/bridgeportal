import { useState } from "react";
import { Building2, MapPin, ChevronDown, ChevronUp, Download, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExclusiveListing, ListingDocument, groupDocumentsByCategory } from "@/hooks/useAgentExclusives";
import { formatFullCurrency } from "@/lib/formatters";

interface ExclusiveListingCardProps {
  listing: ExclusiveListing;
  documents: ListingDocument[];
  isLoadingDocuments?: boolean;
}

const categoryIcons: Record<string, string> = {
  "Offering Memorandum": "📄",
  "OM": "📄",
  "Rent Roll": "📊",
  "Operating Statement": "💰",
  "Financial": "💵",
  "Floor Plans": "🏗️",
  "Photos": "📷",
  "Flyer": "📰",
  "Setup Sheet": "📋",
  "Marketing": "📣",
  "Comps": "📈",
  "Other": "📁",
};

const getCategoryIcon = (category: string): string => {
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return "📁";
};

export const ExclusiveListingCard = ({ listing, documents, isLoadingDocuments }: ExclusiveListingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const groupedDocs = groupDocumentsByCategory(documents);
  const hasDocuments = documents.length > 0;

  const formatListingValue = () => {
    if (listing.division === "Investment Sales" && listing.asking_price) {
      return formatFullCurrency(listing.asking_price);
    }
    if (listing.division === "Commercial" && listing.asking_rent) {
      return `${formatFullCurrency(listing.asking_rent)}/yr`;
    }
    return "Price Upon Request";
  };

  const getListingMetrics = () => {
    const metrics = [];
    if (listing.units) metrics.push(`${listing.units} Units`);
    if (listing.gross_sf) metrics.push(`${listing.gross_sf.toLocaleString()} SF`);
    if (listing.square_footage) metrics.push(`${listing.square_footage.toLocaleString()} SF`);
    if (listing.cap_rate) metrics.push(`${listing.cap_rate.toFixed(2)}% Cap`);
    return metrics;
  };

  const handleDocumentDownload = (doc: ListingDocument) => {
    if (doc.document_url) {
      window.open(doc.document_url, "_blank");
    }
  };

  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Image */}
        <div className="relative">
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.property_address}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          
          {/* Division Badge */}
          <Badge
            className={`absolute top-3 left-3 ${
              listing.division === "Investment Sales"
                ? "bg-purple-500/90 hover:bg-purple-500"
                : "bg-blue-500/90 hover:bg-blue-500"
            }`}
          >
            {listing.division}
          </Badge>

          {/* Role Badge */}
          {listing.agentRole && (
            <Badge
              variant="outline"
              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm"
            >
              {listing.agentRole === "lead" ? "Lead Agent" : listing.agentRole === "co-list" ? "Co-List" : listing.agentRole}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Address & Location */}
          <div>
            <h3 className="font-medium text-foreground line-clamp-1">
              {listing.property_address}
            </h3>
            {(listing.neighborhood || listing.borough) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                {[listing.neighborhood, listing.borough].filter(Boolean).join(", ")}
              </div>
            )}
          </div>

          {/* Price & Metrics */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary">
              {formatListingValue()}
            </span>
            <div className="flex gap-2">
              {getListingMetrics().slice(0, 2).map((metric, i) => (
                <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">
                  {metric}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {listing.om_url && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => window.open(listing.om_url!, "_blank")}
              >
                <Download className="h-3 w-3 mr-1" />
                OM
              </Button>
            )}
            {listing.flyer_url && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => window.open(listing.flyer_url!, "_blank")}
              >
                <Download className="h-3 w-3 mr-1" />
                Flyer
              </Button>
            )}
          </div>

          {/* Document Center Collapsible */}
          {(hasDocuments || isLoadingDocuments) && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document Center ({documents.length})
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-3">
                {isLoadingDocuments ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Loading documents...
                  </div>
                ) : (
                  Object.entries(groupedDocs).map(([category, docs]) => (
                    <div key={category} className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <span>{getCategoryIcon(category)}</span>
                        {category}
                      </div>
                      <div className="space-y-1 pl-4">
                        {docs.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => handleDocumentDownload(doc)}
                            disabled={!doc.document_url}
                            className="w-full text-left text-sm py-1.5 px-2 rounded hover:bg-white/5 flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="truncate">{doc.document_name}</span>
                            {doc.document_url && (
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
