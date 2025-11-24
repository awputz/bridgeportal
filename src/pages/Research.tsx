import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useResearchNotes } from "@/hooks/useResearchNotes";
import { FileText, Download } from "lucide-react";

const Research = () => {
  const [category, setCategory] = useState<string>("all");
  const { data: notes = [], isLoading } = useResearchNotes();

  const filteredNotes = notes.filter(note => 
    category === "all" || note.category === category
  );

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Research & Insights</h1>
            <p className="text-xl text-muted-foreground">
              Focused notes on New York investment sales volume, pricing, and capital flows for clients and investors
            </p>
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-64 mb-8">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Multifamily">Multifamily</SelectItem>
            <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Capital Markets">Capital Markets</SelectItem>
            <SelectItem value="Market Analysis">Market Analysis</SelectItem>
          </SelectContent>
        </Select>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="p-6 hover-lift border border-border">
                <FileText className="mb-4 text-accent" size={32} />
                <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                {note.date && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(note.date).toLocaleDateString()}
                  </p>
                )}
                {note.category && (
                  <p className="text-xs text-accent mb-3">{note.category}</p>
                )}
                <p className="text-sm text-muted-foreground mb-4">{note.summary}</p>
                {note.download_link && (
                  <a href={note.download_link} className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent">
                    <Download size={16} />
                    Download
                  </a>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <FileText size={64} className="mx-auto mb-6 opacity-50" />
            <p className="text-muted-foreground">Research notes will be published here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Research;