import { Pen, Type, Calendar, TextCursor, Check, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ESignFieldType, ESignRecipient, ESignSignerType } from "@/types/esign";

interface FieldPaletteProps {
  recipients: ESignRecipient[];
  selectedRecipientId: string | null;
  onSelectRecipient: (id: string) => void;
  onAddField: (type: ESignFieldType) => void;
}

const fieldTypes: { type: ESignFieldType; label: string; icon: React.ElementType }[] = [
  { type: "signature", label: "Signature", icon: Pen },
  { type: "initials", label: "Initials", icon: Type },
  { type: "date", label: "Date", icon: Calendar },
  { type: "text", label: "Text", icon: TextCursor },
  { type: "checkbox", label: "Checkbox", icon: Check },
  { type: "dropdown", label: "Dropdown", icon: List },
];

const signerColors: Record<ESignSignerType | "default", string> = {
  buyer: "bg-blue-500",
  seller: "bg-green-500",
  agent: "bg-purple-500",
  attorney: "bg-amber-500",
  broker: "bg-pink-500",
  other: "bg-gray-500",
  default: "bg-gray-500",
};

export const FieldPalette = ({
  recipients,
  selectedRecipientId,
  onSelectRecipient,
  onAddField,
}: FieldPaletteProps) => {
  const signers = recipients.filter((r) => r.role === "signer");

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full overflow-y-auto">
      {/* Signer Selection */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">
          Assign Fields To
        </h3>
        <div className="space-y-2">
          {signers.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No signers added yet
            </p>
          ) : (
            signers.map((signer) => (
              <button
                key={signer.id}
                type="button"
                onClick={() => onSelectRecipient(signer.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left",
                  selectedRecipientId === signer.id
                    ? "bg-primary/10 border border-primary"
                    : "hover:bg-muted border border-transparent"
                )}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full shrink-0",
                    signerColors[signer.signer_type || "default"]
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{signer.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {signer.signer_type || "Signer"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Field Types */}
      <div className="p-4 border-b flex-1">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">
          Add Fields
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {fieldTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => onAddField(type)}
              disabled={!selectedRecipientId}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                selectedRecipientId
                  ? "hover:bg-muted hover:border-primary cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>

        {!selectedRecipientId && signers.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Select a signer above to add fields
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 bg-muted/30">
        <h3 className="font-semibold text-sm text-muted-foreground mb-2">Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Drag fields to position them</li>
          <li>• Click a field to select it</li>
          <li>• Use corner handle to resize</li>
          <li>• Click ✕ to remove a field</li>
        </ul>
      </div>
    </div>
  );
};
