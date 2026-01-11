import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ESignField } from "@/types/esign";

interface SignableFieldProps {
  field: ESignField;
  value: string | undefined;
  scale: number;
  onClick: () => void;
  onChange: (value: string) => void;
}

export const SignableField = ({
  field,
  value,
  scale,
  onClick,
  onChange,
}: SignableFieldProps) => {
  const isFilled = !!value;
  const isSignatureType = field.field_type === "signature" || field.field_type === "initials";

  const renderContent = () => {
    if (isSignatureType) {
      if (value) {
        return (
          <img
            src={value}
            alt={field.field_type}
            className="w-full h-full object-contain"
          />
        );
      }
      return (
        <span className="text-xs text-muted-foreground italic">
          Click to {field.field_type === "initials" ? "initial" : "sign"}
        </span>
      );
    }

    if (field.field_type === "checkbox") {
      return (
        <Checkbox
          checked={value === "true"}
          onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
          className="h-full w-full"
        />
      );
    }

    if (field.field_type === "date") {
      return (
        <Input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-full border-0 bg-transparent p-1 text-sm focus-visible:ring-0"
        />
      );
    }

    if (field.field_type === "dropdown" && field.options) {
      return (
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger className="h-full border-0 bg-transparent text-sm">
            <SelectValue placeholder={field.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Text field
    return (
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || field.label || "Enter text"}
        className="h-full border-0 bg-transparent p-1 text-sm focus-visible:ring-0"
      />
    );
  };

  return (
    <div
      className={cn(
        "absolute cursor-pointer rounded transition-all",
        "border-2 flex items-center justify-center",
        isFilled
          ? "border-green-500 bg-green-50/80"
          : field.required
          ? "border-yellow-500 bg-yellow-50/80 border-dashed"
          : "border-blue-400 bg-blue-50/80 border-dashed",
        isSignatureType && "hover:bg-opacity-100"
      )}
      style={{
        left: field.x_position * scale,
        top: field.y_position * scale,
        width: field.width * scale,
        height: field.height * scale,
      }}
      onClick={isSignatureType ? onClick : undefined}
    >
      {renderContent()}
    </div>
  );
};
