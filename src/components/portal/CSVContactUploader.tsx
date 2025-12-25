import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDivision } from "@/contexts/DivisionContext";

interface ParsedContact {
  full_name: string;
  email?: string;
  phone?: string;
  company?: string;
  contact_type?: string;
  source?: string;
  notes?: string;
}

interface CSVContactUploaderProps {
  onSuccess?: () => void;
}

export const CSVContactUploader = ({ onSuccess }: CSVContactUploaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { division } = useDivision();

  const contactFields = [
    { key: "full_name", label: "Name", required: true },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "company", label: "Company" },
    { key: "contact_type", label: "Type" },
    { key: "source", label: "Source" },
    { key: "notes", label: "Notes" },
  ];

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return { headers: [], rows: [] };
    
    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
    
    const rows = lines.slice(1).map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i] || '';
        return obj;
      }, {} as Record<string, string>);
    });
    
    return { headers, rows };
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({ title: "Invalid file", description: "Please upload a CSV file", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);
      
      setHeaders(headers);
      
      // Auto-map columns
      const autoMapping: Record<string, string> = {};
      headers.forEach(h => {
        const lower = h.toLowerCase();
        if (lower.includes('name')) autoMapping[h] = 'full_name';
        else if (lower.includes('email')) autoMapping[h] = 'email';
        else if (lower.includes('phone') || lower.includes('tel')) autoMapping[h] = 'phone';
        else if (lower.includes('company') || lower.includes('org')) autoMapping[h] = 'company';
        else if (lower.includes('type')) autoMapping[h] = 'contact_type';
        else if (lower.includes('source')) autoMapping[h] = 'source';
        else if (lower.includes('note')) autoMapping[h] = 'notes';
      });
      setColumnMapping(autoMapping);
      
      // Convert rows to contacts using mapping
      const contacts = rows.map(row => {
        const contact: ParsedContact = { full_name: '' };
        Object.entries(autoMapping).forEach(([csvCol, field]) => {
          (contact as any)[field] = row[csvCol];
        });
        return contact;
      }).filter(c => c.full_name);
      
      setParsedContacts(contacts);
      setIsOpen(true);
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const contactsToInsert = parsedContacts.map(c => ({
        ...c,
        agent_id: user.id,
        division: division,
        contact_type: c.contact_type || 'prospect',
      }));

      const { error } = await supabase.from('crm_contacts').insert(contactsToInsert);
      if (error) throw error;

      toast({ title: "Success!", description: `${contactsToInsert.length} contacts imported` });
      setIsOpen(false);
      setParsedContacts([]);
      onSuccess?.();
    } catch (error: any) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('csv-upload')?.click()}
      >
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-light mb-1">Drop CSV to import contacts</p>
        <p className="text-sm text-muted-foreground">or click to browse</p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Import {parsedContacts.length} Contacts
            </DialogTitle>
            <DialogDescription>
              Review and confirm the contacts to import
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedContacts.slice(0, 10).map((contact, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{contact.full_name}</TableCell>
                    <TableCell>{contact.email || '-'}</TableCell>
                    <TableCell>{contact.phone || '-'}</TableCell>
                    <TableCell>{contact.company || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {parsedContacts.length > 10 && (
              <p className="text-center text-sm text-muted-foreground py-2">
                ... and {parsedContacts.length - 10} more contacts
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleImport} disabled={isImporting || parsedContacts.length === 0}>
              {isImporting ? 'Importing...' : `Import ${parsedContacts.length} Contacts`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
