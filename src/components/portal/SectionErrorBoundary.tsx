import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
  className?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.sectionName || 'section'}:`, error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className={cn(
          "glass-card p-6 flex flex-col items-center justify-center text-center min-h-[120px]",
          this.props.className
        )}>
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {this.props.sectionName ? `${this.props.sectionName} failed to load` : "Something went wrong"}
          </p>
          <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">
            There was an error loading this section.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={this.handleRetry}
            className="gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for convenience with hooks
interface SectionErrorWrapperProps {
  children: ReactNode;
  sectionName?: string;
  className?: string;
}

export const SectionErrorWrapper = ({ children, sectionName, className }: SectionErrorWrapperProps) => (
  <SectionErrorBoundary sectionName={sectionName} className={className}>
    {children}
  </SectionErrorBoundary>
);
