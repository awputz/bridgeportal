import { useState, useRef, useEffect } from "react";
import { Pen, Type, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldType: "signature" | "initials";
  onComplete: (signatureData: string) => void;
  recipientName: string;
}

const signatureFonts = [
  { name: "Dancing Script", className: "font-dancing" },
  { name: "Great Vibes", className: "font-vibes" },
  { name: "Pacifico", className: "font-pacifico" },
  { name: "Caveat", className: "font-caveat" },
];

export const SignatureDialog = ({
  open,
  onOpenChange,
  fieldType,
  onComplete,
  recipientName,
}: SignatureDialogProps) => {
  const [activeTab, setActiveTab] = useState<"draw" | "type">("draw");
  const [typedValue, setTypedValue] = useState(
    fieldType === "initials"
      ? recipientName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : recipientName
  );
  const [selectedFont, setSelectedFont] = useState(signatureFonts[0].name);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
    setHasDrawn(false);
  }, [open]);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath();
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const handleConfirm = () => {
    let signatureData = "";

    if (activeTab === "draw" && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL("image/png");
    } else if (activeTab === "type") {
      // Create typed signature as image
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = `${fieldType === "initials" ? "48px" : "36px"} "${selectedFont}", cursive`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(typedValue, canvas.width / 2, canvas.height / 2);
        signatureData = canvas.toDataURL("image/png");
      }
    }

    if (signatureData) {
      onComplete(signatureData);
    }
  };

  const isValid =
    (activeTab === "draw" && hasDrawn) ||
    (activeTab === "type" && typedValue.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {fieldType === "initials" ? "Add Your Initials" : "Add Your Signature"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "draw" | "type")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw" className="gap-2">
              <Pen className="h-4 w-4" />
              Draw
            </TabsTrigger>
            <TabsTrigger value="type" className="gap-2">
              <Type className="h-4 w-4" />
              Type
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full touch-none cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <Eraser className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Draw your {fieldType} using your mouse or touchpad
            </p>
          </TabsContent>

          <TabsContent value="type" className="space-y-4">
            <div className="space-y-2">
              <Label>Your {fieldType === "initials" ? "Initials" : "Name"}</Label>
              <Input
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                placeholder={fieldType === "initials" ? "JD" : "John Doe"}
              />
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {signatureFonts.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    onClick={() => setSelectedFont(font.name)}
                    className={cn(
                      "p-4 border rounded-lg text-center transition-colors bg-white",
                      selectedFont === font.name
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:border-muted-foreground"
                    )}
                  >
                    <span
                      style={{
                        fontFamily: `"${font.name}", cursive`,
                        fontSize: fieldType === "initials" ? "24px" : "18px",
                      }}
                    >
                      {typedValue || (fieldType === "initials" ? "JD" : "Your Name")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Load Google Fonts */}
            <link
              href="https://fonts.googleapis.com/css2?family=Caveat&family=Dancing+Script&family=Great+Vibes&family=Pacifico&display=swap"
              rel="stylesheet"
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            Apply {fieldType === "initials" ? "Initials" : "Signature"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
