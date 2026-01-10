import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormField } from "@/types/templates";

interface DynamicFormFieldProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export const DynamicFormField = ({
  field,
  value,
  onChange,
  error,
}: DynamicFormFieldProps) => {
  const renderField = () => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        );

      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        );

      case "currency":
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder || "0.00"}
              value={(value as string) || ""}
              onChange={(e) => onChange(e.target.value)}
              className={`pl-7 ${error ? "border-destructive" : ""}`}
            />
          </div>
        );

      case "number":
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            className={error ? "border-destructive" : ""}
          />
        );

      case "email":
        return (
          <Input
            id={field.id}
            type="email"
            placeholder={field.placeholder || "email@example.com"}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        );

      case "phone":
        return (
          <Input
            id={field.id}
            type="tel"
            placeholder={field.placeholder || "(555) 555-5555"}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        );

      case "select":
        return (
          <Select value={(value as string) || ""} onValueChange={onChange}>
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={Boolean(value)}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.id} className="font-normal cursor-pointer">
              {field.placeholder || field.label}
            </Label>
          </div>
        );

      default: // text
        return (
          <Input
            id={field.id}
            type="text"
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.id} className="text-sm font-medium">
          {field.label}
          {field.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </Label>
      )}

      {renderField()}

      {field.helpText && !error && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
