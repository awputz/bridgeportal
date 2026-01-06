import { useState, useEffect } from "react";
import { X, Send, Paperclip, Clock, PenLine, Trash2, Minimize2, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendEmail } from "@/hooks/useGmail";
import { RichTextEditor } from "./RichTextEditor";
import { EmailSignatureEditor, getStoredSignature } from "./EmailSignatureEditor";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MailComposeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyTo?: {
    to: string;
    subject: string;
    threadId?: string;
    messageId?: string;
  };
}

const DRAFT_STORAGE_KEY = "bridge_email_draft";
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function MailCompose({ open, onOpenChange, replyTo }: MailComposeProps) {
  const [to, setTo] = useState(replyTo?.to || "");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState(replyTo?.subject ? `Re: ${replyTo.subject}` : "");
  const [body, setBody] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [showSignatureEditor, setShowSignatureEditor] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const sendEmail = useSendEmail();

  // Load signature on mount
  useEffect(() => {
    const storedSig = getStoredSignature();
    if (storedSig) {
      setSignature(storedSig);
    }
  }, []);

  // Auto-add signature when composing new email
  useEffect(() => {
    if (open && signature && !body && !replyTo) {
      setBody(`<br><br>${signature}`);
    }
  }, [open, signature, replyTo]);

  // Load draft on open
  useEffect(() => {
    if (open) {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draft && !replyTo) {
        try {
          const parsed = JSON.parse(draft);
          setTo(parsed.to || "");
          setCc(parsed.cc || "");
          setBcc(parsed.bcc || "");
          setSubject(parsed.subject || "");
          setBody(parsed.body || "");
          setHasDraft(true);
          toast.info("Draft restored");
        } catch {
          // Invalid draft, ignore
        }
      } else if (replyTo) {
        setTo(replyTo.to || "");
        setSubject(replyTo.subject ? `Re: ${replyTo.subject}` : "");
        // Add signature for replies too
        if (signature) {
          setBody(`<br><br>${signature}`);
        }
      }
    }
  }, [open, replyTo]);

  // Auto-save draft
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      if (to || subject || body) {
        saveDraft();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [open, to, cc, bcc, subject, body]);

  const saveDraft = () => {
    const draft = { to, cc, bcc, subject, body };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setLastSaved(new Date());
    setHasDraft(true);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
    setLastSaved(null);
  };

  const handleSend = () => {
    if (!to || !subject) {
      toast.error("Please fill in recipient and subject");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      toast.error("Please enter a valid email address");
      return;
    }

    sendEmail.mutate(
      {
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        body,
        threadId: replyTo?.threadId,
        replyToMessageId: replyTo?.messageId,
      },
      {
        onSuccess: () => {
          clearDraft();
          onOpenChange(false);
          resetForm();
          toast.success("Email sent successfully");
        },
        onError: (error) => {
          toast.error(`Failed to send: ${error.message}`);
        },
      }
    );
  };

  const handleDiscard = () => {
    if (to || subject || body) {
      if (window.confirm("Discard this draft?")) {
        clearDraft();
        resetForm();
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setBody("");
    setShowCcBcc(false);
    setIsMinimized(false);
  };

  const handleSignatureSave = (newSignature: string) => {
    setSignature(newSignature);
    // Replace old signature with new one in body
    if (body.includes("</div>") && signature) {
      // Try to replace existing signature
      const bodyWithoutSig = body.replace(/<div style="font-family: Arial.*<\/div>/s, "");
      setBody(`${bodyWithoutSig}${newSignature}`);
    } else if (!body.includes("font-family: Arial")) {
      // Add signature if not present
      setBody(`${body}<br><br>${newSignature}`);
    }
  };

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 w-72 bg-card border rounded-t-lg shadow-lg cursor-pointer"
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center justify-between p-3 bg-gmail-red text-white rounded-t-lg">
          <span className="font-medium truncate">
            {subject || "New Message"}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                handleDiscard();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleDiscard}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
          {/* Gmail-style Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <DialogTitle className="text-base font-medium">
              {replyTo ? "Reply" : "New Message"}
            </DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDiscard}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Recipients */}
            <div className="px-4 py-2 border-b list-gap-xs">
              {/* To field */}
              <div className="flex items-center gap-2">
                <Label htmlFor="to" className="w-12 text-sm text-muted-foreground">To</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0"
                />
                {!showCcBcc && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={() => setShowCcBcc(true)}
                  >
                    Cc Bcc
                  </Button>
                )}
              </div>

              {/* Cc/Bcc fields */}
              {showCcBcc && (
                <>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="cc" className="w-12 text-sm text-muted-foreground">Cc</Label>
                    <Input
                      id="cc"
                      type="email"
                      placeholder="cc@example.com"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bcc" className="w-12 text-sm text-muted-foreground">Bcc</Label>
                    <Input
                      id="bcc"
                      type="email"
                      placeholder="bcc@example.com"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0"
                    />
                  </div>
                </>
              )}

              {/* Subject */}
              <div className="flex items-center gap-2">
                <Label htmlFor="subject" className="w-12 text-sm text-muted-foreground">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="flex-1 overflow-auto">
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Compose your message..."
                className="border-0 rounded-none"
                minHeight="300px"
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/10">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                disabled={!to || !subject || sendEmail.isPending}
                className="bg-gmail-red hover:bg-gmail-red/90 text-white gap-2"
              >
                {sendEmail.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send
                  </>
                )}
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button variant="ghost" size="icon" disabled className="text-muted-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowSignatureEditor(true)}
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled
                className="text-muted-foreground"
                title="Schedule send (coming soon)"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Draft saved
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDiscard}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EmailSignatureEditor
        open={showSignatureEditor}
        onOpenChange={setShowSignatureEditor}
        onSave={handleSignatureSave}
      />
    </>
  );
}
