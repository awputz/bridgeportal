import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFDocumentViewerProps {
  fileUrl: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onNumPagesChange: (numPages: number) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  children?: React.ReactNode;
  className?: string;
}

export const PDFDocumentViewer = ({
  fileUrl,
  currentPage,
  onPageChange,
  onNumPagesChange,
  scale,
  onScaleChange,
  children,
  className,
}: PDFDocumentViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    onNumPagesChange(numPages);
    setIsLoading(false);
    setError(null);
  };

  const handleDocumentLoadError = (err: Error) => {
    console.error("PDF load error:", err);
    setError("Failed to load PDF document");
    setIsLoading(false);
  };

  const handlePageLoadSuccess = (page: { width: number; height: number }) => {
    setPageDimensions({ width: page.width, height: page.height });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  const zoomIn = () => {
    if (scale < 2) {
      onScaleChange(Math.min(2, scale + 0.25));
    }
  };

  const zoomOut = () => {
    if (scale > 0.5) {
      onScaleChange(Math.max(0.5, scale - 0.25));
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[100px] text-center">
            Page {currentPage} of {numPages || "..."}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage >= numPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            disabled={scale <= 0.5 || isLoading}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            disabled={scale >= 2 || isLoading}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-muted/20 flex justify-center p-4"
      >
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-destructive">
              <p className="font-medium">{error}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please try uploading the document again.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative inline-block shadow-lg">
            <Document
              file={fileUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-[600px] w-[500px] bg-background">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                onLoadSuccess={handlePageLoadSuccess}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>

            {/* Field Overlay Container */}
            {children && (
              <div
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                  width: pageDimensions.width * scale,
                  height: pageDimensions.height * scale,
                }}
              >
                <div className="pointer-events-auto">{children}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
