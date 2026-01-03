import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Home, Store, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ExclusiveDivision } from "@/hooks/useExclusiveSubmissions";

const divisions = [
  {
    id: "residential" as ExclusiveDivision,
    title: "Residential",
    description: "Apartments, condos, townhouses, and single-family rentals or sales",
    icon: Home,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    hoverColor: "hover:border-blue-400 hover:bg-blue-500/5",
  },
  {
    id: "investment-sales" as ExclusiveDivision,
    title: "Investment Sales",
    description: "Multi-family buildings, mixed-use properties, and development sites",
    icon: Building2,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    hoverColor: "hover:border-emerald-400 hover:bg-emerald-500/5",
  },
  {
    id: "commercial-leasing" as ExclusiveDivision,
    title: "Commercial Leasing",
    description: "Retail, office, industrial, and flex spaces for lease",
    icon: Store,
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    hoverColor: "hover:border-purple-400 hover:bg-purple-500/5",
  },
];

export default function NewExclusive() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDivision = searchParams.get("division") as ExclusiveDivision | null;
  
  const [selectedDivision, setSelectedDivision] = useState<ExclusiveDivision | null>(preselectedDivision);

  const handleContinue = () => {
    if (selectedDivision) {
      navigate(`/portal/exclusives/new/${selectedDivision}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-3xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/portal/my-exclusives")}
            className="mb-4 -ml-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to My Exclusives
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight">Submit New Exclusive</h1>
          <p className="text-muted-foreground mt-2">
            Complete the questionnaire to submit your exclusive listing for review
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Step 1 of 7</span>
            <span className="text-muted-foreground">Select Division</span>
          </div>
          <Progress value={14} className="h-2" />
        </div>

        {/* Division Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">What type of exclusive is this?</h2>
          
          <div className="grid gap-4">
            <AnimatePresence mode="wait">
              {divisions.map((division, index) => {
                const Icon = division.icon;
                const isSelected = selectedDivision === division.id;
                
                return (
                  <motion.div
                    key={division.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200 border-2",
                        isSelected 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "border-border",
                        division.hoverColor
                      )}
                      onClick={() => setSelectedDivision(division.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-lg border",
                            division.color
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {division.title}
                              {isSelected && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-primary"
                                >
                                  ✓
                                </motion.span>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {division.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Continue Button */}
        <motion.div 
          className="mt-8 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedDivision ? 1 : 0.5 }}
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedDivision}
            className="gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
