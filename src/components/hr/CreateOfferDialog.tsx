import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format, addWeeks } from "date-fns";
import { CalendarIcon, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useHRAgents, divisionLabels, Division } from "@/hooks/hr/useHRAgents";
import { useCreateHROffer } from "@/hooks/hr/useHROffers";
import { CommissionSplitInput } from "./CommissionSplitInput";
import { toast } from "sonner";

interface CreateOfferDialogProps {
  children?: React.ReactNode;
  defaultAgentId?: string;
  defaultDivision?: string;
}

interface FormData {
  agent_id: string;
  division: string;
  commission_split: string;
  signing_bonus: string;
  start_date: Date | undefined;
  special_terms: string;
}

const TEMPLATES = [
  { name: 'Standard', split: '60/40', bonus: 0 },
  { name: 'Competitive', split: '65/35', bonus: 5000 },
  { name: 'Premium', split: '70/30', bonus: 15000 },
];

export function CreateOfferDialog({ children, defaultAgentId, defaultDivision }: CreateOfferDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: agents } = useHRAgents();
  const createOffer = useCreateHROffer();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      agent_id: defaultAgentId || '',
      division: defaultDivision || '',
      commission_split: '60/40',
      signing_bonus: '',
      start_date: addWeeks(new Date(), 2),
      special_terms: '',
    },
  });

  // Update form when defaults change
  useEffect(() => {
    if (defaultAgentId) {
      setValue('agent_id', defaultAgentId);
    }
    if (defaultDivision) {
      setValue('division', defaultDivision);
    }
  }, [defaultAgentId, defaultDivision, setValue]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        agent_id: defaultAgentId || '',
        division: defaultDivision || '',
        commission_split: '60/40',
        signing_bonus: '',
        start_date: addWeeks(new Date(), 2),
        special_terms: '',
      });
    }
  }, [open, defaultAgentId, defaultDivision, reset]);

  const selectedAgentId = watch('agent_id');
  const commissionSplit = watch('commission_split');
  const startDate = watch('start_date');

  // Filter agents to those in qualified/hot/offer-made stages
  const eligibleAgents = agents?.filter(a => 
    ['qualified', 'hot', 'offer-made'].includes(a.recruitment_status || '')
  ) || [];

  // Auto-set division when agent is selected
  const handleAgentChange = (agentId: string) => {
    setValue('agent_id', agentId);
    const agent = agents?.find(a => a.id === agentId);
    if (agent?.division) {
      setValue('division', agent.division);
    }
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setValue('commission_split', template.split);
    setValue('signing_bonus', template.bonus > 0 ? template.bonus.toString() : '');
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createOffer.mutateAsync({
        agent_id: data.agent_id,
        division: data.division,
        commission_split: data.commission_split,
        signing_bonus: data.signing_bonus ? parseFloat(data.signing_bonus) : null,
        start_date: data.start_date?.toISOString().split('T')[0],
        special_terms: data.special_terms || null,
      });
      toast.success("Offer created successfully");
      setOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to create offer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <FileText className="h-4 w-4 mr-2" />
            Create Offer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
            <DialogDescription>
              Generate a compensation offer for a recruitment candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Agent Selection */}
            <div className="space-y-2">
              <Label htmlFor="agent">Agent *</Label>
              <Select
                value={selectedAgentId}
                onValueChange={handleAgentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex flex-col">
                        <span>{agent.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {agent.current_brokerage} • {divisionLabels[agent.division as Division]}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {eligibleAgents.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No agents in qualified/hot/offer-made stages
                </p>
              )}
            </div>

            {/* Division */}
            <div className="space-y-2">
              <Label htmlFor="division">Division *</Label>
              <Select
                value={watch('division')}
                onValueChange={(v) => setValue('division', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(divisionLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Templates */}
            <div className="space-y-2">
              <Label>Quick Templates</Label>
              <div className="flex gap-2">
                {TEMPLATES.map((template) => (
                  <Button
                    key={template.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Commission Split */}
            <div className="space-y-2">
              <Label>Commission Split *</Label>
              <CommissionSplitInput
                value={commissionSplit}
                onChange={(v) => setValue('commission_split', v)}
              />
            </div>

            {/* Signing Bonus */}
            <div className="space-y-2">
              <Label htmlFor="signing_bonus">Signing Bonus</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  {...register('signing_bonus')}
                  type="number"
                  placeholder="0"
                  className="pl-7"
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Proposed Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => setValue('start_date', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Special Terms */}
            <div className="space-y-2">
              <Label htmlFor="special_terms">Special Terms</Label>
              <Textarea
                {...register('special_terms')}
                placeholder="Any additional terms or conditions..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOffer.isPending || !selectedAgentId || !watch('division') || !commissionSplit}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {createOffer.isPending ? "Creating..." : "Create Offer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
