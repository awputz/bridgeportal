import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Bot, User, Sparkles, FileText, Mail, TrendingUp, Loader2, Copy, Check, Trash2, Building2, DollarSign, Users, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useDivision } from "@/contexts/DivisionContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface EnhancedAgentContext {
  name?: string;
  email?: string;
  division?: string;
  stats?: {
    activeDeals: number;
    totalContacts: number;
    pipelineValue: number;
  };
  recentDeals?: Array<{
    property_address: string;
    value: number | null;
    stage_id: string | null;
    expected_close: string | null;
    priority: string | null;
  }>;
  recentTransactions?: Array<{
    property_address: string;
    sale_price: number | null;
    division: string | null;
    closing_date: string | null;
    commission: number | null;
  }>;
  upcomingTasks?: Array<{
    title: string;
    due_date: string | null;
    is_completed: boolean;
  }>;
}

const defaultQuickPrompts = [
  {
    icon: TrendingUp,
    label: "Deal Analysis",
    prompt: "Help me analyze a multifamily property deal. I'll provide the details.",
  },
  {
    icon: Mail,
    label: "Draft Email",
    prompt: "Help me draft a professional email to a potential seller about their property.",
  },
  {
    icon: FileText,
    label: "LOI Summary",
    prompt: "Help me summarize the key terms I should include in a Letter of Intent.",
  },
  {
    icon: Building2,
    label: "Market Analysis",
    prompt: "Help me create a market analysis for a specific NYC neighborhood. I'll provide the details.",
  },
  {
    icon: DollarSign,
    label: "Price Negotiation",
    prompt: "Help me craft a response to a price objection from a seller who thinks their property is worth more.",
  },
  {
    icon: Users,
    label: "Client Follow-up",
    prompt: "Help me write a follow-up email to a client I haven't heard from in 2 weeks.",
  },
];

const STORAGE_KEY = "bridge-ai-chat-history";

const AI = () => {
  const [searchParams] = useSearchParams();
  const { division } = useDivision();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [agentContext, setAgentContext] = useState<EnhancedAgentContext | null>(null);
  const [quickPrompts, setQuickPrompts] = useState(defaultQuickPrompts);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialPromptSent = useRef(false);

  // Fetch enhanced agent context on mount
  useEffect(() => {
    const fetchEnhancedAgentContext = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      // Fetch active CRM deals
      const { data: deals } = await supabase
        .from("crm_deals")
        .select("id, property_address, value, division, stage_id, expected_close, priority")
        .eq("agent_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch contact count
      const { count: contactCount } = await supabase
        .from("crm_contacts")
        .select("id", { count: "exact", head: true })
        .eq("agent_id", user.id)
        .eq("is_active", true);

      // Fetch recent transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("property_address, sale_price, division, closing_date, commission")
        .order("closing_date", { ascending: false })
        .limit(5);

      // Fetch upcoming tasks
      const { data: tasks } = await supabase
        .from("crm_activities")
        .select("title, due_date, is_completed")
        .eq("agent_id", user.id)
        .eq("is_completed", false)
        .order("due_date", { ascending: true })
        .limit(5);

      const pipelineValue = deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0;

      const enhancedContext: EnhancedAgentContext = {
        name: profile?.full_name || user.email?.split("@")[0] || "Agent",
        email: profile?.email || user.email,
        division: division,
        stats: {
          activeDeals: deals?.length || 0,
          totalContacts: contactCount || 0,
          pipelineValue,
        },
        recentDeals: deals?.slice(0, 5) || [],
        recentTransactions: transactions || [],
        upcomingTasks: tasks || [],
      };

      setAgentContext(enhancedContext);

      // Generate dynamic quick prompts based on agent's data
      const dynamicPrompts = [];
      
      if (deals && deals.length > 0) {
        const topDeal = deals[0];
        dynamicPrompts.push({
          icon: Building2,
          label: `Analyze ${topDeal.property_address.substring(0, 20)}...`,
          prompt: `Help me analyze my deal at ${topDeal.property_address}. Current value: $${topDeal.value?.toLocaleString() || 'TBD'}. What should I focus on next?`,
        });
      }

      if (tasks && tasks.length > 0) {
        dynamicPrompts.push({
          icon: Calendar,
          label: "Review My Tasks",
          prompt: "Review my upcoming tasks and help me prioritize them for maximum productivity.",
        });
      }

      if (pipelineValue > 0) {
        dynamicPrompts.push({
          icon: Target,
          label: "Pipeline Strategy",
          prompt: `I have ${deals?.length || 0} active deals worth $${pipelineValue.toLocaleString()} in my pipeline. Help me develop a strategy to close more deals this month.`,
        });
      }

      // Combine dynamic prompts with defaults, prioritizing dynamic ones
      setQuickPrompts([...dynamicPrompts, ...defaultQuickPrompts.slice(0, 6 - dynamicPrompts.length)]);
    };

    fetchEnhancedAgentContext();
  }, [division]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Handle initial prompt from URL
  useEffect(() => {
    const promptFromUrl = searchParams.get("prompt");
    if (promptFromUrl && !initialPromptSent.current && messages.length === 0) {
      initialPromptSent.current = true;
      sendMessage(promptFromUrl);
    }
  }, [searchParams]);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Chat cleared");
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            agent_context: agentContext,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
        if (response.status === 402) {
          throw new Error("Usage limit reached. Please contact support.");
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: assistantContent,
                    };
                    return updated;
                  });
                }
              } catch {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("AI Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error instanceof Error 
            ? error.message 
            : "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const firstName = agentContext?.name?.split(" ")[0] || "there";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col w-full min-h-0">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extralight text-foreground">
                Bridge AI
              </h1>
            </div>
            <p className="text-muted-foreground font-light">
              {agentContext?.name ? `Hi ${firstName}! ` : ""}Your intelligent assistant for deal analysis, emails, and market research
            </p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Agent Stats Badge */}
        {agentContext?.stats && agentContext.stats.activeDeals > 0 && messages.length === 0 && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-muted-foreground mb-2">Your current activity:</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-foreground">
                <strong>{agentContext.stats.activeDeals}</strong> active deals
              </span>
              <span className="text-foreground">
                <strong>{agentContext.stats.totalContacts}</strong> contacts
              </span>
              <span className="text-foreground">
                <strong>${agentContext.stats.pipelineValue.toLocaleString()}</strong> pipeline
              </span>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
                <h3 className="text-xl font-light text-foreground mb-2">
                  How can I help you today{firstName !== "there" ? `, ${firstName}` : ""}?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {agentContext?.recentDeals?.length 
                    ? `I can see you have ${agentContext.recentDeals.length} active deals. Ask me about deal analysis, market research, or let me help you draft professional emails.`
                    : "Ask me about deal analysis, market research, or let me help you draft professional emails."}
                </p>

                {/* Quick Prompts */}
                <div className="flex flex-wrap justify-center gap-3">
                  {quickPrompts.map((prompt, index) => {
                    const Icon = prompt.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => sendMessage(prompt.prompt)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm text-foreground/80 hover:text-foreground transition-all"
                      >
                        <Icon className="h-4 w-4" />
                        {prompt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-foreground/70" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 relative group",
                      message.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-white/5 text-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                      {isLoading && index === messages.length - 1 && message.role === "assistant" && !message.content && (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Thinking...
                        </span>
                      )}
                    </p>
                    {message.role === "assistant" && message.content && (
                      <button
                        onClick={() => copyToClipboard(message.content, index)}
                        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-white/10 hover:bg-white/20"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-foreground/70" />
                        )}
                      </button>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-background" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="glass-card p-2">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Bridge AI anything..."
                  className="flex-1 min-h-[44px] max-h-[200px] bg-transparent border-0 focus-visible:ring-0 resize-none text-foreground placeholder:text-muted-foreground"
                  rows={1}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/50 text-center mt-2">
              Bridge AI can make mistakes. Verify important information.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AI;
