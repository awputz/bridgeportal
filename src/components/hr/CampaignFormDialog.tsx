import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHRCampaign, useUpdateHRCampaign, type HRCampaign } from "@/hooks/hr/useHRCampaigns";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  division: z.string().optional(),
  email_subject: z.string().optional(),
  email_template: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CampaignFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: HRCampaign | null;
}

export function CampaignFormDialog({ open, onOpenChange, campaign }: CampaignFormDialogProps) {
  const createCampaign = useCreateHRCampaign();
  const updateCampaign = useUpdateHRCampaign();
  const isEditing = !!campaign;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name || "",
      division: campaign?.division || "",
      email_subject: campaign?.email_subject || "",
      email_template: campaign?.email_template || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEditing && campaign) {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        ...values,
        division: values.division || null,
      });
    } else {
      await createCampaign.mutateAsync({
        ...values,
        division: values.division || null,
        status: 'draft',
      });
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sidebar border-border/40 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-light">
            {isEditing ? "Edit Campaign" : "New Campaign"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider">
                    Campaign Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Q1 Investment Sales Outreach"
                      className="bg-white/5 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider">
                    Target Division (Optional)
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="All divisions" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="investment-sales">Investment Sales</SelectItem>
                      <SelectItem value="commercial-leasing">Commercial Leasing</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="capital-advisory">Capital Advisory</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email_subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider">
                    Email Subject
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="{{first_name}}, exciting opportunity at Bridge Careers"
                      className="bg-white/5 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider">
                    Email Template
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`Hi {{first_name}},\n\nI noticed your impressive work at {{brokerage}} and wanted to reach out about an exciting opportunity...\n\nBest,\nHR Team`}
                      className="bg-white/5 border-white/10 min-h-[150px]"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Variables: {"{{first_name}}"}, {"{{full_name}}"}, {"{{brokerage}}"}, {"{{division}}"}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={createCampaign.isPending || updateCampaign.isPending}
              >
                {isEditing ? "Save Changes" : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
