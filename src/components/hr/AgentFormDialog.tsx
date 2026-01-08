import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  HRAgent, 
  useCreateHRAgent, 
  useUpdateHRAgent,
  Division,
  RecruitmentStatus,
  divisionLabels,
  statusLabels
} from "@/hooks/hr/useHRAgents";

const agentSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  phone: z.string().optional(),
  photo_url: z.string().url("Invalid URL").optional().or(z.literal('')),
  current_brokerage: z.string().optional(),
  division: z.enum(['investment-sales', 'commercial-leasing', 'residential', 'capital-advisory']).optional().nullable(),
  years_experience: z.coerce.number().min(0).optional().nullable(),
  annual_production: z.coerce.number().min(0).optional().nullable(),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal('')),
  recruitment_status: z.enum(['cold', 'contacted', 'warm', 'qualified', 'hot', 'offer-made', 'hired', 'lost']),
  poachability_score: z.number().min(1).max(100).optional().nullable(),
  source: z.string().optional(),
  next_action: z.string().optional(),
  notes: z.string().optional(),
});

type AgentFormValues = z.infer<typeof agentSchema>;

interface AgentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: HRAgent | null;
}

export function AgentFormDialog({ open, onOpenChange, agent }: AgentFormDialogProps) {
  const isEditing = !!agent;
  const createAgent = useCreateHRAgent();
  const updateAgent = useUpdateHRAgent();

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      photo_url: '',
      current_brokerage: '',
      division: null,
      years_experience: null,
      annual_production: null,
      linkedin_url: '',
      recruitment_status: 'cold',
      poachability_score: 50,
      source: '',
      next_action: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (agent) {
      form.reset({
        full_name: agent.full_name,
        email: agent.email || '',
        phone: agent.phone || '',
        photo_url: agent.photo_url || '',
        current_brokerage: agent.current_brokerage || '',
        division: agent.division as Division | null,
        years_experience: agent.years_experience,
        annual_production: agent.annual_production ? Number(agent.annual_production) : null,
        linkedin_url: agent.linkedin_url || '',
        recruitment_status: agent.recruitment_status as RecruitmentStatus,
        poachability_score: agent.poachability_score || 50,
        source: agent.source || '',
        next_action: agent.next_action || '',
        notes: agent.notes || '',
      });
    } else {
      form.reset({
        full_name: '',
        email: '',
        phone: '',
        photo_url: '',
        current_brokerage: '',
        division: null,
        years_experience: null,
        annual_production: null,
        linkedin_url: '',
        recruitment_status: 'cold',
        poachability_score: 50,
        source: '',
        next_action: '',
        notes: '',
      });
    }
  }, [agent, form]);

  const onSubmit = async (values: AgentFormValues) => {
    const payload = {
      ...values,
      email: values.email || null,
      photo_url: values.photo_url || null,
      linkedin_url: values.linkedin_url || null,
    };

    if (isEditing && agent) {
      await updateAgent.mutateAsync({ id: agent.id, updates: payload });
    } else {
      await createAgent.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const isPending = createAgent.isPending || updateAgent.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-light">
            {isEditing ? 'Edit Agent' : 'Add New Agent'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Smith" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="john@brokerage.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(212) 555-1234" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Professional Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_brokerage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Brokerage</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="CBRE, JLL, etc." />
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
                      <FormLabel>Division</FormLabel>
                      <Select 
                        value={field.value || ''} 
                        onValueChange={(v) => field.onChange(v || null)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(divisionLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="years_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years Experience</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annual_production"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Production ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value ?? ''} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          placeholder="5000000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://linkedin.com/in/..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Recruitment Status */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Recruitment Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recruitment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="LinkedIn, Referral, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="poachability_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poachability Score: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        value={[field.value || 50]}
                        onValueChange={(v) => field.onChange(v[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low (1-30)</span>
                      <span>Medium (31-60)</span>
                      <span>High (61-100)</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="next_action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Action</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Schedule intro call, Send email, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Any additional information about this agent..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Agent'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
