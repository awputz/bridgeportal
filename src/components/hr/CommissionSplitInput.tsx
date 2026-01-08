import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommissionSplitInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PRESETS = ['50/50', '55/45', '60/40', '65/35', '70/30'];

export function CommissionSplitInput({ value, onChange, disabled }: CommissionSplitInputProps) {
  const [isValid, setIsValid] = useState(true);

  const validateSplit = (val: string): boolean => {
    const pattern = /^\d{1,2}\/\d{1,2}$/;
    if (!pattern.test(val)) return false;
    
    const [agent, company] = val.split('/').map(Number);
    return agent + company === 100 && agent >= 0 && agent <= 100;
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (newValue) {
      setIsValid(validateSplit(newValue));
    } else {
      setIsValid(true);
    }
  };

  const parseSplit = (val: string): { agent: number; company: number } | null => {
    if (!validateSplit(val)) return null;
    const [agent, company] = val.split('/').map(Number);
    return { agent, company };
  };

  const split = parseSplit(value);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="70/30"
          disabled={disabled}
          className={cn(
            "font-mono",
            !isValid && "border-red-500 focus-visible:ring-red-500"
          )}
        />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={value === preset ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleChange(preset)}
            disabled={disabled}
            className="text-xs h-7"
          >
            {preset}
          </Button>
        ))}
      </div>

      {/* Visual Bar */}
      {split && (
        <div className="space-y-1">
          <div className="flex h-3 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 transition-all"
              style={{ width: `${split.agent}%` }}
            />
            <div 
              className="bg-slate-600 transition-all"
              style={{ width: `${split.company}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Agent: {split.agent}%</span>
            <span>Company: {split.company}%</span>
          </div>
        </div>
      )}

      {!isValid && value && (
        <p className="text-xs text-red-400">
          Invalid format. Use XX/XX format (e.g., 70/30) totaling 100.
        </p>
      )}
    </div>
  );
}
