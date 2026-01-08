import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users } from "lucide-react";
import { useHRAgents, divisionLabels, divisionColors, type Division } from "@/hooks/hr/useHRAgents";
import { useCampaignAgents, useAddAgentsToCampaign } from "@/hooks/hr/useHRCampaigns";

interface AddAgentsToCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
}

export function AddAgentsToCampaignDialog({ 
  open, 
  onOpenChange, 
  campaignId 
}: AddAgentsToCampaignDialogProps) {
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: allAgents = [], isLoading: loadingAgents } = useHRAgents();
  const { data: campaignAgents = [], isLoading: loadingCampaign } = useCampaignAgents(campaignId);
  const addAgents = useAddAgentsToCampaign();

  // Get IDs of agents already in campaign
  const existingAgentIds = useMemo(() => 
    new Set(campaignAgents.map(ca => ca.agent_id)),
    [campaignAgents]
  );

  // Filter available agents
  const filteredAgents = useMemo(() => {
    return allAgents.filter(agent => {
      const matchesSearch = agent.full_name.toLowerCase().includes(search.toLowerCase()) ||
        agent.current_brokerage?.toLowerCase().includes(search.toLowerCase());
      const matchesDivision = divisionFilter === "all" || agent.division === divisionFilter;
      return matchesSearch && matchesDivision;
    });
  }, [allAgents, search, divisionFilter]);

  const toggleAgent = (agentId: string) => {
    if (existingAgentIds.has(agentId)) return; // Already in campaign
    
    const newSelected = new Set(selectedIds);
    if (newSelected.has(agentId)) {
      newSelected.delete(agentId);
    } else {
      newSelected.add(agentId);
    }
    setSelectedIds(newSelected);
  };

  const handleAdd = async () => {
    if (selectedIds.size === 0) return;
    
    await addAgents.mutateAsync({
      campaignId,
      agentIds: Array.from(selectedIds),
    });
    
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  const isLoading = loadingAgents || loadingCampaign;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sidebar border-border/40 max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-light flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            Add Agents to Campaign
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <Select value={divisionFilter} onValueChange={setDivisionFilter}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
              <SelectValue placeholder="All divisions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              <SelectItem value="investment-sales">Investment Sales</SelectItem>
              <SelectItem value="commercial-leasing">Commercial Leasing</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="capital-advisory">Capital Advisory</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agent List */}
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading agents...
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No agents found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAgents.map((agent) => {
                const isInCampaign = existingAgentIds.has(agent.id);
                const isSelected = selectedIds.has(agent.id);
                
                return (
                  <div
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                      ${isInCampaign 
                        ? 'bg-white/5 border-emerald-500/30 opacity-60 cursor-not-allowed' 
                        : isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    <Checkbox
                      checked={isInCampaign || isSelected}
                      disabled={isInCampaign}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                    
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={agent.photo_url || undefined} />
                      <AvatarFallback className="bg-white/10 text-xs">
                        {agent.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{agent.full_name}</span>
                        {isInCampaign && (
                          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                            Added
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.current_brokerage || 'Unknown brokerage'}
                      </p>
                    </div>

                    <Badge 
                      variant="outline" 
                      className={`text-xs ${divisionColors[agent.division as Division] || ''}`}
                    >
                      {divisionLabels[agent.division as Division] || agent.division}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground">
            {selectedIds.size} agent{selectedIds.size !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={selectedIds.size === 0 || addAgents.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Add Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
