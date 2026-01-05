import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Phone, Mail, Users, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCRMContacts, useCreateActivity } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
const activityTypes = [{
  value: "call",
  label: "Call",
  icon: Phone
}, {
  value: "email",
  label: "Email",
  icon: Mail
}, {
  value: "meeting",
  label: "Meeting",
  icon: Users
}, {
  value: "note",
  label: "Note",
  icon: FileText
}];
export const QuickActivityLogger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activityType, setActivityType] = useState("call");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactId, setContactId] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const location = useLocation();
  const {
    division
  } = useDivision();
  const {
    user
  } = useAuth();
  const {
    data: contacts
  } = useCRMContacts(division);
  const createActivity = useCreateActivity();

  // Pre-fill contact if on a contact page
  useEffect(() => {
    const match = location.pathname.match(/\/portal\/crm\/contacts\/([^/]+)/);
    if (match && match[1]) {
      setContactId(match[1]);
    }
  }, [location.pathname]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!user?.id) {
      toast.error("You must be logged in");
      return;
    }
    try {
      await createActivity.mutateAsync({
        agent_id: user.id,
        activity_type: activityType,
        title: title.trim(),
        description: description.trim() || null,
        contact_id: contactId || null,
        deal_id: null,
        due_date: dueDate || null,
        is_completed: false,
        completed_at: null,
        division: 'investment-sales',
        priority: 'medium',
        reminder_at: null,
        recurring_pattern: null,
        is_all_day: false,
        category: activityType,
      });
      toast.success("Activity logged successfully");
      handleClose();
    } catch (error) {
      toast.error("Failed to log activity");
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    setTitle("");
    setDescription("");
    setDueDate("");
    setActivityType("call");
  };
  return <>
      {/* Floating Action Button */}
      

      {/* Activity Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Log Activity
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activity Type Selection */}
            <div className="grid grid-cols-4 gap-2">
              {activityTypes.map(type => {
              const Icon = type.icon;
              return <button key={type.value} type="button" onClick={() => setActivityType(type.value)} className={cn("flex flex-col items-center gap-1 p-3 rounded-lg border transition-all", activityType === type.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground")}>
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{type.label}</span>
                  </button>;
            })}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder={`e.g., ${activityType === "call" ? "Follow-up call with John" : "Quick meeting notes"}`} autoFocus />
            </div>

            {/* Contact Selection */}
            <div className="space-y-2">
              <Label htmlFor="contact">Contact (optional)</Label>
              <Select value={contactId} onValueChange={setContactId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No contact</SelectItem>
                  {contacts?.map(contact => <SelectItem key={contact.id} value={contact.id}>
                      {contact.full_name}
                      {contact.company && ` - ${contact.company}`}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (optional)</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="description">Notes (optional)</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Add any relevant details..." rows={3} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={createActivity.isPending}>
                {createActivity.isPending ? "Saving..." : "Log Activity"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>;
};