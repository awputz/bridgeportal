import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PropertyMatchDisplay } from "./PropertyMatchDisplay";
import { Property } from "@/hooks/useProperties";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface Message {
  role: "assistant" | "user";
  content: string;
  properties?: (Property & { match_score?: number; match_reason?: string })[];
}
type UserType = "owner" | "investor" | "team" | null;
type ConversationStep = "initial" | "propertyAddress" | "assetType" | "unitDetails" | "currentSituation" | "timing" | "targetAssetType" | "targetBoroughs" | "budgetRange" | "name" | "email" | "phone" | "notes" | "summary" | "complete";
interface FormData {
  userType: UserType;
  propertyAddress?: string;
  assetType?: string;
  unitDetails?: string;
  currentSituation?: string;
  timing?: string;
  targetAssetType?: string;
  targetBoroughs?: string;
  budgetRange?: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}
interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChatMode = "inquiry" | "assistant";

const AIChat = ({
  isOpen,
  onClose
}: AIChatProps) => {
  const [mode, setMode] = useState<ChatMode>("inquiry");
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "How can we help?"
  }]);
  const [assistantMessages, setAssistantMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationStep, setConversationStep] = useState<ConversationStep>("initial");
  const [formData, setFormData] = useState<FormData>({
    userType: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMatchingProperties, setIsMatchingProperties] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  const addMessage = (role: "assistant" | "user", content: string, properties?: (Property & { match_score?: number; match_reason?: string })[]) => {
    setMessages(prev => [...prev, {
      role,
      content,
      properties
    }]);
  };
  const handleUserTypeSelection = (type: UserType) => {
    setFormData({
      ...formData,
      userType: type
    });
    let userMessage = "";
    if (type === "owner") userMessage = "I own a property and want to discuss options";
    else if (type === "investor") userMessage = "I am looking to buy an investment property";
    else if (type === "team") userMessage = "I want to speak with the investment sales team";
    
    addMessage("user", userMessage);
    setTimeout(() => {
      if (type === "owner") {
        addMessage("assistant", "What is the property address?");
        setConversationStep("propertyAddress");
      } else if (type === "investor") {
        addMessage("assistant", "What type of assets are you targeting?");
        setConversationStep("targetAssetType");
      } else if (type === "team") {
        addMessage("assistant", "What is your name?");
        setConversationStep("name");
      }
    }, 500);
  };
  const getNextStep = (current: ConversationStep, userType: UserType): ConversationStep => {
    if (userType === "owner") {
      const ownerFlow: ConversationStep[] = ["propertyAddress", "assetType", "unitDetails", "currentSituation", "timing", "name", "email", "phone", "summary"];
      const currentIndex = ownerFlow.indexOf(current);
      return ownerFlow[currentIndex + 1] || "complete";
    } else if (userType === "investor") {
      const investorFlow: ConversationStep[] = ["targetAssetType", "targetBoroughs", "budgetRange", "timing", "name", "email", "phone", "summary"];
      const currentIndex = investorFlow.indexOf(current);
      return investorFlow[currentIndex + 1] || "complete";
    } else if (userType === "team") {
      const teamFlow: ConversationStep[] = ["name", "email", "phone", "notes", "summary"];
      const currentIndex = teamFlow.indexOf(current);
      return teamFlow[currentIndex + 1] || "complete";
    }
    return "complete";
  };
  const getQuestionForStep = (step: ConversationStep, userType: UserType): string => {
    switch (step) {
      case "propertyAddress":
        return "What is the property address?";
      case "assetType":
        return "What type of asset is it?";
      case "unitDetails":
        return "How many units or approximate square footage?";
      case "currentSituation":
        return "What is your current situation? (e.g., partner buyout, estate planning, 1031 exchange)";
      case "targetAssetType":
        return "What type of assets are you targeting? (e.g., multifamily, mixed-use, retail, office, development, land)";
      case "targetBoroughs":
        return "Which boroughs or neighborhoods are you interested in?";
      case "budgetRange":
        return "What is your budget range?";
      case "timing":
        if (userType === "owner") return "What is your timeline? (e.g., immediate, 3-6 months, 6-18 months)";
        if (userType === "investor") return "What is your investment timeline?";
        return "What is your timeline?";
      case "name":
        return "What is your name?";
      case "email":
        return "What is your email address?";
      case "phone":
        return "What is your phone number? (optional)";
      case "notes":
        return "Brief description of your request?";
      default:
        return "";
    }
  };
  const generateSummary = (): string => {
    const { userType, propertyAddress, assetType, unitDetails, currentSituation, timing, targetAssetType, targetBoroughs, budgetRange, notes } = formData;
    
    if (userType === "owner") {
      return `You own a property at ${propertyAddress || "the specified location"} (${assetType || "asset type specified"}). The property has ${unitDetails || "the units described"}. Your situation: ${currentSituation || "as discussed"}. Timeline: ${timing || "as discussed"}.`;
    } else if (userType === "investor") {
      return `You are looking to invest in ${targetAssetType || "investment properties"} in ${targetBoroughs || "specified areas"} with a budget of ${budgetRange || "your stated range"}. Timeline: ${timing || "as discussed"}.`;
    } else if (userType === "team") {
      return `Request: ${notes || "General inquiry for the investment sales team"}.`;
    }
    return "";
  };
  const handleInput = async (value: string) => {
    if (!value.trim() && conversationStep !== "phone") return;
    addMessage("user", value || "(skipped)");
    setInputValue("");
    const updatedFormData = {
      ...formData
    };
    switch (conversationStep) {
      case "propertyAddress":
        updatedFormData.propertyAddress = value;
        break;
      case "assetType":
        updatedFormData.assetType = value;
        break;
      case "unitDetails":
        updatedFormData.unitDetails = value;
        break;
      case "currentSituation":
        updatedFormData.currentSituation = value;
        break;
      case "targetAssetType":
        updatedFormData.targetAssetType = value;
        break;
      case "targetBoroughs":
        updatedFormData.targetBoroughs = value;
        break;
      case "budgetRange":
        updatedFormData.budgetRange = value;
        break;
      case "timing":
        updatedFormData.timing = value;
        break;
      case "name":
        updatedFormData.name = value;
        break;
      case "email":
        updatedFormData.email = value;
        break;
      case "phone":
        updatedFormData.phone = value || undefined;
        break;
      case "notes":
        updatedFormData.notes = value;
        break;
    }
    setFormData(updatedFormData);
      setTimeout(() => {
        const summary = generateSummary();
        addMessage("assistant", summary);
        setTimeout(() => {
          addMessage("assistant", "Does this look correct?");
          setConversationStep("summary");
        }, 300);
      }, 500);
    } else if (nextStep === "complete") {
      setConversationStep("complete");
    } else {
      setTimeout(() => {
        const question = getQuestionForStep(nextStep, formData.userType!);
        addMessage("assistant", question);
        setConversationStep(nextStep);
      }, 500);
    }
  };
  const handleSummaryConfirmation = async (confirmed: boolean) => {
    if (confirmed) {
      addMessage("user", "Yes");
      await submitEnquiry();
    } else {
      addMessage("user", "Edit");
      setTimeout(() => {
        addMessage("assistant", "Please provide your updated information:");
        const firstStep = formData.userType === "owner" ? "propertyAddress" : formData.userType === "investor" ? "targetAssetType" : "name";
        const question = getQuestionForStep(firstStep, formData.userType!);
        setTimeout(() => {
          addMessage("assistant", question);
          setConversationStep(firstStep);
        }, 300);
      }, 500);
    }
  };
  const submitEnquiry = async () => {
    setIsSubmitting(true);
    try {
      const inquiryData = {
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone,
        user_type: formData.userType,
        inquiry_type: "Investment Sales",
        property_address: formData.propertyAddress,
        target_asset_type: formData.assetType || formData.targetAssetType,
        target_boroughs: formData.targetBoroughs,
        budget_range: formData.budgetRange,
        unit_count: formData.unitDetails,
        current_situation: formData.currentSituation,
        timing: formData.timing,
        notes: formData.notes
      };
      
      const { data: inquiryResponse, error } = await supabase.functions.invoke("submit-inquiry", {
        body: inquiryData
      });
      
      if (error) throw error;
      
      const inquiryId = inquiryResponse?.inquiryId;
      
      setTimeout(() => {
        addMessage("assistant", "Thank you. Let me find the best matches for you...");
      }, 500);
      
      setTimeout(() => {
        addMessage("assistant", "Thank you. A member of the BRIDGE Investment Sales team will follow up shortly to discuss your requirements.");
        setConversationStep("complete");
      }, 1000);
      
      toast({
        title: "Inquiry submitted",
        description: "We'll be in touch soon."
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
      setTimeout(() => {
        addMessage("assistant", "Sorry, there was an error. Please try again or contact us directly.");
        setConversationStep("complete");
      }, 500);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "assistant") {
      handleAssistantMessage();
    } else if (conversationStep === "phone") {
      handleInput(inputValue);
    } else if (inputValue.trim()) {
      handleInput(inputValue);
    }
  };

  const handleAssistantMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue("");
    
    setAssistantMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsAIThinking(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/area-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...assistantMessages, { role: "user", content: userMessage }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      let textBuffer = "";

      // Add placeholder assistant message
      setAssistantMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;

        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              aiResponse += content;
              // Update the last assistant message
              setAssistantMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: aiResponse };
                return updated;
              });
            }
          } catch {
            continue;
          }
        }
      }
    } catch (error) {
      console.error("AI assistant error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      // Remove the placeholder message
      setAssistantMessages(prev => prev.slice(0, -1));
    } finally {
      setIsAIThinking(false);
    }
  };

  const switchMode = (newMode: ChatMode) => {
    setMode(newMode);
    if (newMode === "inquiry") {
      setMessages([{ role: "assistant", content: "How can we help?" }]);
      setConversationStep("initial");
    } else {
      setAssistantMessages([]);
    }
  };
  if (!isOpen) return null;
  
  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  return <div className={cn(
    "fixed z-50",
    isMobileDevice ? "bottom-0 left-0 right-0" : "bottom-0 right-0 md:bottom-8 md:right-8"
  )}>
      <div className={cn(
        "absolute inset-0",
        isMobileDevice ? "bg-black/10" : "bg-black/20 backdrop-blur-sm"
      )} onClick={onClose} />
      
      <div className={cn(
        "relative bg-white flex flex-col",
        isMobileDevice ? "w-full h-[85vh] rounded-t-3xl" : "w-full md:h-[520px] md:w-[380px] md:rounded-2xl shadow-2xl"
      )}>
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-neutral-200 rounded-t-3xl md:rounded-t-2xl">
          <div className="flex-1">
            <h2 className="text-sm md:text-base font-semibold text-black tracking-wide">BRIDGE Assistant</h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              {mode === "inquiry" ? "Tell us what you're looking for" : "Ask about NYC neighborhoods"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors" aria-label="Close">
            <X size={isMobileDevice ? 22 : 18} className="text-black" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 p-2 bg-neutral-50 border-b border-neutral-200">
          <Button
            onClick={() => switchMode("inquiry")}
            variant={mode === "inquiry" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex-1 text-xs h-7",
              mode === "inquiry" ? "bg-black text-white" : "text-neutral-600"
            )}
          >
            <MessageSquare size={13} className="mr-1" />
            Get Started
          </Button>
          <Button
            onClick={() => switchMode("assistant")}
            variant={mode === "assistant" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex-1 text-xs h-7",
              mode === "assistant" ? "bg-black text-white" : "text-neutral-600"
            )}
          >
            <Sparkles size={13} className="mr-1" />
            Ask AI
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
          {mode === "inquiry" ? (
            <>
              {messages.map((message, index) => (
                <div key={index}>
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {index === 0 && message.role === "assistant" ? (
                      <p className="text-xs md:text-sm text-black underline">{message.content}</p>
                    ) : (
                      <div className={cn(
                        "max-w-[85%] p-3 md:p-4 rounded-lg",
                        message.role === "user" 
                          ? "bg-black text-white" 
                          : "bg-white border border-neutral-200 text-black"
                      )}>
                        <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    )}
                  </div>
                  {message.properties && message.properties.length > 0 && (
                    <div className="mt-3 md:mt-4">
                      <PropertyMatchDisplay properties={message.properties} />
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              {assistantMessages.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Sparkles size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Ask me anything about NYC neighborhoods</p>
                  <p className="text-xs mt-2 text-neutral-400">Safety, schools, commute, amenities & more</p>
                </div>
              )}
              {assistantMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={cn(
                    "max-w-[85%] p-3 md:p-4 rounded-lg",
                    msg.role === "user" 
                      ? "bg-black text-white" 
                      : "bg-white border border-neutral-200 text-black"
                  )}>
                    <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAIThinking && (
                <div className="flex justify-start">
                  <div className="bg-white border border-neutral-200 p-3 md:p-4 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {mode === "inquiry" && conversationStep === "initial" && <div className="flex flex-col gap-2">
              <button onClick={() => handleUserTypeSelection("owner")} className="w-full p-3 md:p-4 text-left bg-white border border-neutral-200 hover:bg-black hover:text-white hover:border-black rounded-lg transition-colors text-xs md:text-sm text-black">
                I own a property and want to discuss options
              </button>
              <button onClick={() => handleUserTypeSelection("investor")} className="w-full p-3 md:p-4 text-left bg-white border border-neutral-200 hover:bg-black hover:text-white hover:border-black rounded-lg transition-colors text-xs md:text-sm text-black">
                I am looking to buy an investment property
              </button>
              <button onClick={() => handleUserTypeSelection("team")} className="w-full p-3 md:p-4 text-left bg-white border border-neutral-200 hover:bg-black hover:text-white hover:border-black rounded-lg transition-colors text-xs md:text-sm text-black">
                I want to speak with the investment sales team
              </button>
            </div>}

          {mode === "inquiry" && conversationStep === "summary" && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleSummaryConfirmation(true)} 
                disabled={isSubmitting || isMatchingProperties}
                className="w-full p-4 bg-black text-white hover:bg-neutral-800 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {isSubmitting || isMatchingProperties ? "Processing..." : "Yes"}
              </button>
              <button 
                onClick={() => handleSummaryConfirmation(false)} 
                disabled={isSubmitting || isMatchingProperties}
                className="w-full p-4 bg-white border border-neutral-200 hover:bg-black hover:text-white hover:border-black rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                Edit
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {((mode === "inquiry" && conversationStep !== "initial" && conversationStep !== "summary" && conversationStep !== "complete") || mode === "assistant") && (
          <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t border-neutral-200 bg-white">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={mode === "assistant" ? "Ask about neighborhoods..." : conversationStep === "phone" ? "Optional" : "Type your answer..."}
                className="flex-1 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-black text-sm"
                disabled={isSubmitting || isMatchingProperties || isAIThinking}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="bg-black hover:bg-neutral-800 text-white flex-shrink-0"
                disabled={isSubmitting || isMatchingProperties || isAIThinking}
              >
                <Send size={16} />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>;
};
export default AIChat;