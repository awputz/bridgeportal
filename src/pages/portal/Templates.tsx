import { Link } from "react-router-dom";
import { DivisionSelector } from "@/components/portal/DivisionSelector";

const Templates = () => {
  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Back to Tools */}
        <Link 
          to="/portal/tools" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          ← Back to Tools
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Templates
          </h1>
          <p className="text-muted-foreground font-light">
            Essential documents organized by division
          </p>
        </div>

        {/* Division Selector */}
        <DivisionSelector />
      </div>
    </div>
  );
};

export default Templates;
