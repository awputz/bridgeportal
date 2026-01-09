import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAgentOnboarding,
  useUpdateOnboardingItem,
  calculateOnboardingProgress,
  onboardingItems,
  type AgentOnboarding,
} from "@/hooks/hr/useAgentOnboarding";
import { format } from "date-fns";
import { CheckCircle2, Circle, Loader2, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingChecklistProps {
  activeAgentId: string;
  compact?: boolean;
}

export function OnboardingChecklist({ activeAgentId, compact = false }: OnboardingChecklistProps) {
  const { data: onboarding, isLoading } = useAgentOnboarding(activeAgentId);
  const updateItem = useUpdateOnboardingItem();
  const [dialogItem, setDialogItem] = useState<typeof onboardingItems[0] | null>(null);
  const [additionalData, setAdditionalData] = useState<Record<string, string>>({});

  const progress = calculateOnboardingProgress(onboarding);
  const isComplete = progress === 100;

  const handleToggle = (item: typeof onboardingItems[0]) => {
    if (!onboarding) return;
    
    const currentValue = onboarding[item.key] as boolean;
    
    // If completing and item has additional data field, show dialog
    if (!currentValue && item.dataKey) {
      setDialogItem(item);
      return;
    }

    updateItem.mutate({
      activeAgentId,
      itemKey: item.key as string,
      value: !currentValue,
    });
  };

  const handleDialogSubmit = () => {
    if (!dialogItem) return;

    updateItem.mutate({
      activeAgentId,
      itemKey: dialogItem.key as string,
      value: true,
      additionalData: dialogItem.dataKey ? { [dialogItem.dataKey]: additionalData[dialogItem.dataKey as string] } : undefined,
    });

    setDialogItem(null);
    setAdditionalData({});
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!onboarding) {
    return (
      <Card className="bg-card/50">
        <CardContent className="p-6 text-center text-muted-foreground">
          No onboarding record found.
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Onboarding Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {onboardingItems.filter((item) => onboarding[item.key]).length} of {onboardingItems.length} items complete
        </p>
      </div>
    );
  }

  return (
    <>
      <Card className="bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Onboarding Checklist</CardTitle>
            {isComplete && (
              <div className="flex items-center gap-2 text-emerald-500">
                <PartyPopper className="h-5 w-5" />
                <span className="text-sm font-medium">Complete!</span>
              </div>
            )}
          </div>
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {onboardingItems.map((item) => {
            const isChecked = onboarding[item.key] as boolean;
            const timestamp = onboarding[item.timestampKey] as string | null;
            const dataValue = item.dataKey ? (onboarding[item.dataKey] as string | null) : null;

            return (
              <div
                key={item.key as string}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-colors",
                  isChecked ? "bg-emerald-500/5" : "hover:bg-muted/50"
                )}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(item)}
                  disabled={updateItem.isPending}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isChecked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn("text-sm", isChecked && "line-through text-muted-foreground")}>
                      {item.label}
                    </span>
                  </div>
                  {isChecked && timestamp && (
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      Completed {format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a")}
                      {dataValue && item.dataLabel && (
                        <span className="ml-2">
                          • {item.dataLabel}: {dataValue}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional Data Dialog */}
      <Dialog open={!!dialogItem} onOpenChange={() => setDialogItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete: {dialogItem?.label}</DialogTitle>
            <DialogDescription>
              Please provide the required information.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {dialogItem?.dataKey && (
              <div className="space-y-2">
                <Label htmlFor={dialogItem.dataKey as string}>{dialogItem.dataLabel}</Label>
                <Input
                  id={dialogItem.dataKey as string}
                  value={additionalData[dialogItem.dataKey as string] || ""}
                  onChange={(e) =>
                    setAdditionalData((prev) => ({
                      ...prev,
                      [dialogItem.dataKey as string]: e.target.value,
                    }))
                  }
                  placeholder={`Enter ${dialogItem.dataLabel?.toLowerCase()}`}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit} disabled={updateItem.isPending}>
              {updateItem.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
