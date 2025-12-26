import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInvestorTeam } from "@/hooks/useInvestorData";
import { Users, Mail, Phone, Building2 } from "lucide-react";
import type { TeamMember } from "@/hooks/useInvestorData";

const DIVISIONS = ["all", "Investment Sales", "Commercial Leasing", "Residential", "Capital Advisory"];

const Team = () => {
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { data: team, isLoading } = useInvestorTeam(divisionFilter);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light text-foreground">Team Directory</h1>
          <p className="text-muted-foreground mt-1">
            {team?.length || 0} active team members
          </p>
        </div>
        <Select value={divisionFilter} onValueChange={setDivisionFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by Division" />
          </SelectTrigger>
          <SelectContent>
            {DIVISIONS.map((div) => (
              <SelectItem key={div} value={div}>
                {div === "all" ? "All Divisions" : div}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team?.map((member) => (
          <Card
            key={member.id}
            className="border-border/50 hover:border-sky-400/30 transition-colors cursor-pointer"
            onClick={() => setSelectedMember(member)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarImage src={member.image_url || undefined} alt={member.name} />
                  <AvatarFallback className="bg-sky-400/10 text-sky-400 text-lg">
                    {member.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{member.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{member.title || "Team Member"}</p>
                  {member.category && (
                    <Badge variant="secondary" className="text-xs mt-2">
                      {member.category}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {team?.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No team members found for this division</p>
          </CardContent>
        </Card>
      )}

      {/* Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Team Member</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage src={selectedMember.image_url || undefined} alt={selectedMember.name} />
                  <AvatarFallback className="bg-sky-400/10 text-sky-400 text-2xl">
                    {selectedMember.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium text-foreground">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.title || "Team Member"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Division</p>
                  {selectedMember.category ? (
                    <Badge variant="secondary">{selectedMember.category}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">None assigned</span>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Contact Information</p>
                  {selectedMember.email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mail className="h-4 w-4 text-sky-400" />
                      <a href={`mailto:${selectedMember.email}`} className="text-sm text-foreground hover:underline">
                        {selectedMember.email}
                      </a>
                    </div>
                  )}
                  {selectedMember.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="h-4 w-4 text-sky-400" />
                      <a href={`tel:${selectedMember.phone}`} className="text-sm text-foreground hover:underline">
                        {selectedMember.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
