import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileSignature, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContractTemplates, useParseTemplate } from "@/hooks/hr/useContractTemplates";
import { useCreateContract } from "@/hooks/hr/useContracts";
import { useHRAgents, divisionLabels, Division } from "@/hooks/hr/useHRAgents";
import { parseContractTemplate } from "@/lib/contract-utils";

const formSchema = z.object({
  agent_id: z.string().min(1, "Please select an agent"),
  template_id: z.string().min(1, "Please select a template"),
  division: z.string().min(1, "Please select a division"),
  commission_split: z.string().min(1, "Commission split is required"),
  start_date: z.string().min(1, "Start date is required"),
  signing_bonus: z.string().optional(),
  special_terms: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ContractGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId?: string;
  division?: string;
}

export function ContractGenerator({ 
  open, 
  onOpenChange, 
  agentId, 
  division 
}: ContractGeneratorProps) {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  
  const { data: templates, isLoading: templatesLoading } = useContractTemplates();
  const { data: agents, isLoading: agentsLoading } = useHRAgents();
  const createContract = useCreateContract();
  const { parse } = useParseTemplate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent_id: agentId || "",
      template_id: "",
      division: division || "",
      commission_split: "",
      start_date: "",
      signing_bonus: "",
      special_terms: "",
    },
  });

  // Set defaults when props change
  useEffect(() => {
    if (agentId) form.setValue('agent_id', agentId);
    if (division) form.setValue('division', division);
  }, [agentId, division, form]);

  // Auto-select default template
  useEffect(() => {
    if (templates && templates.length > 0 && !form.getValues('template_id')) {
      const defaultTemplate = templates.find(t => t.is_default) || templates[0];
      form.setValue('template_id', defaultTemplate.id);
    }
  }, [templates, form]);

  // Auto-fill agent details when selected
  const watchAgentId = form.watch('agent_id');
  useEffect(() => {
    if (watchAgentId && agents) {
      const agent = agents.find(a => a.id === watchAgentId);
      if (agent && agent.division && !form.getValues('division')) {
        form.setValue('division', agent.division);
      }
    }
  }, [watchAgentId, agents, form]);

  const onSubmit = async (data: FormData) => {
    const template = templates?.find(t => t.id === data.template_id);
    const agent = agents?.find(a => a.id === data.agent_id);
    
    if (!template || !agent) return;

    // Parse template with variables
    const variables = {
      agent_name: agent.full_name,
      agent_email: agent.email || '',
      division: divisionLabels[data.division as Division] || data.division,
      commission_split: data.commission_split,
      start_date: data.start_date,
      signing_bonus: data.signing_bonus || '',
      special_terms: data.special_terms || '',
      company_name: 'Bridge Real Estate',
      effective_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    const contentHtml = parseContractTemplate(template.content_html || '', variables);

    await createContract.mutateAsync({
      agent_id: data.agent_id,
      template_id: data.template_id,
      template_version: template.version || '1.0',
      agent_name: agent.full_name,
      agent_email: agent.email || '',
      division: data.division,
      contract_type: template.contract_type || 'independent_contractor',
      commission_split: data.commission_split,
      start_date: data.start_date,
      signing_bonus: data.signing_bonus ? parseFloat(data.signing_bonus) : null,
      special_terms: data.special_terms || null,
      content_html: contentHtml,
      status: 'draft',
    });

    form.reset();
    onOpenChange(false);
  };

  const handlePreview = () => {
    const data = form.getValues();
    const template = templates?.find(t => t.id === data.template_id);
    const agent = agents?.find(a => a.id === data.agent_id);
    
    if (!template) return;

    const variables = {
      agent_name: agent?.full_name || '[Agent Name]',
      agent_email: agent?.email || '[Agent Email]',
      division: divisionLabels[data.division as Division] || data.division || '[Division]',
      commission_split: data.commission_split || '[Commission Split]',
      start_date: data.start_date || '[Start Date]',
      signing_bonus: data.signing_bonus || '',
      special_terms: data.special_terms || '',
      company_name: 'Bridge Real Estate',
      effective_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    setPreviewHtml(parseContractTemplate(template.content_html || '', variables));
  };

  // Filter agents to only show those that can receive contracts
  const eligibleAgents = agents?.filter(a => 
    a.recruitment_status === 'offer_extended' || 
    a.recruitment_status === 'negotiating' ||
    a.recruitment_status === 'hired'
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-emerald-400" />
            Generate Contract
          </DialogTitle>
          <DialogDescription>
            Create a new contract from a template. The agent will receive an email to sign.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {agentsLoading ? (
                          <SelectItem value="" disabled>Loading...</SelectItem>
                        ) : eligibleAgents.length === 0 ? (
                          <SelectItem value="" disabled>No eligible agents</SelectItem>
                        ) : (
                          eligibleAgents.map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.full_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="template_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templatesLoading ? (
                          <SelectItem value="" disabled>Loading...</SelectItem>
                        ) : (
                          templates?.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name} {template.is_default && '(Default)'}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name="commission_split"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Split</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 70/30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signing_bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signing Bonus (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="special_terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Terms (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional terms or conditions..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePreview}
                disabled={!form.getValues('template_id')}
              >
                Preview
              </Button>
              <Button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={createContract.isPending}
              >
                {createContract.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Draft
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* Preview Section */}
        {previewHtml && (
          <div className="mt-6 border-t pt-6">
            <h4 className="text-sm font-medium mb-3">Preview</h4>
            <div 
              className="bg-white text-black p-6 rounded-lg max-h-96 overflow-y-auto prose prose-sm"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
