import { useRef, useImperativeHandle, forwardRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface SignaturePadProps {
  onEnd?: () => void;
  className?: string;
}

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onEnd, className }, ref) => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
      clear: () => {
        sigCanvas.current?.clear();
      },
      isEmpty: () => {
        return sigCanvas.current?.isEmpty() ?? true;
      },
      toDataURL: () => {
        return sigCanvas.current?.toDataURL('image/png') || '';
      },
    }));

    const handleClear = () => {
      sigCanvas.current?.clear();
    };

    return (
      <div className={className}>
        <div className="border-2 border-dashed border-border rounded-lg bg-white relative">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              className: "w-full h-48 touch-none",
              style: { width: '100%', height: '192px' }
            }}
            onEnd={onEnd}
          />
          <div className="absolute bottom-4 left-4 right-4 border-t border-gray-300 pointer-events-none">
            <span className="text-xs text-gray-400 absolute -top-3 left-2 bg-white px-1">
              Sign here
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="mt-2"
        >
          <Eraser className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";
