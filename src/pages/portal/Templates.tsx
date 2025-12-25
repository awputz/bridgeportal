import { DivisionSelector } from "@/components/portal/DivisionSelector";

const Templates = () => {
  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10 md:mb-14">
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
