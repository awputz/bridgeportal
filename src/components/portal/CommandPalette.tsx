import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ListTodo,
  BarChart3,
  Sparkles,
  Calculator,
  FileText,
  Wrench,
  Wand2,
  User,
  Plus,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useCRMContacts, useCRMDeals } from "@/hooks/useCRM";
import { toast } from "sonner";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const { data: contacts } = useCRMContacts();
  const { data: deals } = useCRMDeals();

  const handleSelect = useCallback((action: string) => {
    onOpenChange(false);
    
    // Handle navigation
    if (action.startsWith("/")) {
      navigate(action);
      return;
    }

    // Handle special actions
    switch (action) {
      case "new-deal":
        navigate("/portal/crm/deals/new");
        break;
      case "new-task":
        navigate("/portal/tasks");
        // Could trigger task creation dialog
        break;
      case "sign-out":
        supabase.auth.signOut().then(() => {
          navigate("/login");
        });
        break;
      default:
        if (action.startsWith("contact:")) {
          navigate(`/portal/crm/contacts/${action.replace("contact:", "")}`);
        } else if (action.startsWith("deal:")) {
          navigate(`/portal/crm/deals/${action.replace("deal:", "")}`);
        }
    }
  }, [navigate, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleSelect("/portal")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/portal/crm")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>CRM</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/portal/tasks")}>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Tasks</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/portal/analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/portal/directory")}>
            <Users className="mr-2 h-4 w-4" />
            <span>Directory</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/portal/ai")}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI Assistant</span>
            <CommandShortcut>⌘I</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tools">
          <CommandItem onSelect={() => handleSelect("/portal/generators")}>
            <Wand2 className="mr-2 h-4 w-4" />
            <span>Generators</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/portal/calculators")}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculators</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/portal/templates")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Templates</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/portal/tools")}>
            <Wrench className="mr-2 h-4 w-4" />
            <span>External Tools</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleSelect("new-deal")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Deal</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("new-task")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Task</span>
          </CommandItem>
        </CommandGroup>

        {/* Recent Contacts */}
        {contacts && contacts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Contacts">
              {contacts.slice(0, 5).map((contact) => (
                <CommandItem 
                  key={contact.id}
                  onSelect={() => handleSelect(`contact:${contact.id}`)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{contact.full_name}</span>
                  {contact.company && (
                    <span className="ml-2 text-muted-foreground text-xs">
                      {contact.company}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Recent Deals */}
        {deals && deals.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Deals">
              {deals.slice(0, 5).map((deal) => (
                <CommandItem 
                  key={deal.id}
                  onSelect={() => handleSelect(`deal:${deal.id}`)}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>{deal.property_address}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem onSelect={() => handleSelect("/portal/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("sign-out")}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

// Keyboard shortcut hook
export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open command palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
};
