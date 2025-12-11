import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface SettingRow {
  id: string;
  key: string;
  value: unknown;
}

const SettingsAdmin = () => {
  const queryClient = useQueryClient();
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-bridge-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_settings")
        .select("*");
      if (error) throw error;
      return data as SettingRow[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Json }) => {
      const { error } = await supabase
        .from("bridge_settings")
        .update({ value })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bridge-settings"] });
      queryClient.invalidateQueries({ queryKey: ["bridge-settings"] });
      toast({ title: "Setting updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update setting", variant: "destructive" });
    },
  });

  const handleSave = (key: string) => {
    const editedValue = editedSettings[key];
    if (editedValue === undefined) return;

    try {
      const parsedValue = JSON.parse(editedValue) as Json;
      updateMutation.mutate({ key, value: parsedValue });
      setEditedSettings((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } catch {
      toast({ title: "Invalid JSON format", variant: "destructive" });
    }
  };

  const getDisplayValue = (setting: SettingRow) => {
    if (editedSettings[setting.key] !== undefined) {
      return editedSettings[setting.key];
    }
    return JSON.stringify(setting.value, null, 2);
  };

  const isEdited = (key: string) => editedSettings[key] !== undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage global company settings</p>
      </div>

      <div className="grid gap-6">
        {settings?.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">
                {setting.key.replace(/_/g, " ")}
              </CardTitle>
              <CardDescription>
                Key: {setting.key}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {typeof setting.value === "string" ? (
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    value={editedSettings[setting.key] ?? (setting.value as string)}
                    onChange={(e) =>
                      setEditedSettings((prev) => ({
                        ...prev,
                        [setting.key]: JSON.stringify(e.target.value),
                      }))
                    }
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Value (JSON)</Label>
                  <Textarea
                    className="font-mono text-sm min-h-[120px]"
                    value={getDisplayValue(setting)}
                    onChange={(e) =>
                      setEditedSettings((prev) => ({
                        ...prev,
                        [setting.key]: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
              
              {isEdited(setting.key) && (
                <Button
                  onClick={() => handleSave(setting.key)}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SettingsAdmin;
