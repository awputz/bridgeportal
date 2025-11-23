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
type UserType = "renter" | "buyer" | "seller" | null;
type ConversationStep = "initial" | "location" | "timing" | "bedrooms" | "propertyType" | "budget" | "mustHaves" | "financing" | "propertyAddress" | "assignmentType" | "unitDetails" | "pricing" | "name" | "email" | "phone" | "summary" | "complete";
interface FormData {
  userType: UserType;
  location?: string;
  timing?: string;
  bedrooms?: string;
  propertyType?: string;
  budget?: string;
  mustHaves?: string;
  financing?: string;
  propertyAddress?: string;
  assignmentType?: string;
  unitDetails?: string;
  pricing?: string;
  name?: string;
  email?: string;
  phone?: string;
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
    if (type === "renter") userMessage = "I am looking to rent";else if (type === "buyer") userMessage = "I am looking to buy";else if (type === "seller") userMessage = "I want to sell or lease my property";
    addMessage("user", userMessage);
    setTimeout(() => {
      if (type === "buyer") {
        addMessage("assistant", "Which neighborhoods or areas are you considering buying in?");
      } else if (type === "seller") {
        addMessage("assistant", "What is the property address or building name?");
      } else {
        addMessage("assistant", "Which neighborhoods or areas are you considering?");
      }
      setConversationStep(type === "seller" ? "propertyAddress" : "location");
    }, 500);
  };
  const getNextStep = (current: ConversationStep, userType: UserType): ConversationStep => {
    if (userType === "renter") {
      const renterFlow: ConversationStep[] = ["location", "timing", "bedrooms", "budget", "mustHaves", "name", "email", "phone", "summary"];
      const currentIndex = renterFlow.indexOf(current);
      return renterFlow[currentIndex + 1] || "complete";
    } else if (userType === "buyer") {
      const buyerFlow: ConversationStep[] = ["location", "timing", "propertyType", "budget", "financing", "name", "email", "phone", "summary"];
      const currentIndex = buyerFlow.indexOf(current);
      return buyerFlow[currentIndex + 1] || "complete";
    } else if (userType === "seller") {
      const sellerFlow: ConversationStep[] = ["propertyAddress", "assignmentType", "unitDetails", "pricing", "timing", "name", "email", "phone", "summary"];
      const currentIndex = sellerFlow.indexOf(current);
      return sellerFlow[currentIndex + 1] || "complete";
    }
    return "complete";
  };
  const getQuestionForStep = (step: ConversationStep, userType: UserType): string => {
    switch (step) {
      case "location":
        return userType === "buyer" ? "Which neighborhoods or areas are you considering buying in?" : "Which neighborhoods or areas are you considering?";
      case "timing":
        if (userType === "renter") return "What is your ideal move in date?";
        if (userType === "buyer") return "What is your ideal timeline to purchase?";
        if (userType === "seller") return "When would you like to bring this to market?";
        return "";
      case "bedrooms":
        return "How many bedrooms do you need and how many people will live in the apartment?";
      case "propertyType":
        return "Are you focused on condo, co-op, townhouse, or are you open to options?";
      case "budget":
        if (userType === "renter") return "What is your monthly budget range? For example, two thousand five hundred to three thousand per month.";
        if (userType === "buyer") return "What is your total purchase budget range? For example, one million to one point two million.";
        return "";
      case "mustHaves":
        return "Any non-negotiables such as elevator, doorman, pets, or outdoor space?";
      case "financing":
        return "Will you be financing the purchase or buying in cash?";
      case "propertyAddress":
        return "What is the property address or building name?";
      case "assignmentType":
        return "Are you looking to sell the property, lease individual units, or run a full building leasing program?";
      case "unitDetails":
        return "How many units or what type of property is it?";
      case "pricing":
        if (formData.assignmentType?.toLowerCase().includes("sell")) {
          return "What is your target sale price range?";
        }
        return "What is your target monthly rent range per unit or for key unit types?";
      case "name":
        return "What is your name?";
      case "email":
        return "What is your email address?";
      case "phone":
        return "What is your phone number? (optional)";
      default:
        return "";
    }
  };
  const generateSummary = (): string => {
    const {
      userType,
      location,
      timing,
      bedrooms,
      budget,
      mustHaves,
      propertyType,
      financing,
      propertyAddress,
      assignmentType,
      unitDetails,
      pricing
    } = formData;
    if (userType === "renter") {
      return `You are looking to rent in ${location || "specified areas"} with a budget of ${budget || "your stated range"} per month and a move-in around ${timing || "your preferred date"}. You need ${bedrooms || "the specified number of bedrooms"}${mustHaves ? ` and must have ${mustHaves}` : ""}.`;
    } else if (userType === "buyer") {
      return `You are looking to buy in ${location || "specified areas"} with a budget of ${budget || "your stated range"}. Your timeline is ${timing || "as discussed"} and you are interested in ${propertyType || "various property types"}. You plan to ${financing || "finance as discussed"}.`;
    } else if (userType === "seller") {
      return `You want to ${assignmentType || "market"} your property at ${propertyAddress || "the specified location"}. The property consists of ${unitDetails || "the units described"} with a target ${pricing || "price as discussed"}. Your timeline is ${timing || "as discussed"}.`;
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
      case "location":
        updatedFormData.location = value;
        break;
      case "timing":
        updatedFormData.timing = value;
        break;
      case "bedrooms":
        updatedFormData.bedrooms = value;
        break;
      case "propertyType":
        updatedFormData.propertyType = value;
        break;
      case "budget":
        updatedFormData.budget = value;
        break;
      case "mustHaves":
        updatedFormData.mustHaves = value;
        break;
      case "financing":
        updatedFormData.financing = value;
        break;
      case "propertyAddress":
        updatedFormData.propertyAddress = value;
        break;
      case "assignmentType":
        updatedFormData.assignmentType = value;
        break;
      case "unitDetails":
        updatedFormData.unitDetails = value;
        break;
      case "pricing":
        updatedFormData.pricing = value;
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
    }
    setFormData(updatedFormData);
    const nextStep = getNextStep(conversationStep, formData.userType!);
    if (nextStep === "summary") {
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
        const firstStep = formData.userType === "seller" ? "propertyAddress" : "location";
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
        neighborhoods: formData.location,
        timing: formData.timing,
        requirements: formData.bedrooms || formData.propertyType || formData.unitDetails,
        budget: formData.budget || formData.pricing,
        property_address: formData.propertyAddress,
        assignment_type: formData.assignmentType,
        notes: [formData.mustHaves && `Must-haves: ${formData.mustHaves}`, formData.financing && `Financing: ${formData.financing}`].filter(Boolean).join("; ")
      };
      
      const { data: inquiryResponse, error } = await supabase.functions.invoke("submit-inquiry", {
        body: inquiryData
      });
      
      if (error) throw error;
      
      const inquiryId = inquiryResponse?.inquiryId;
      
      setTimeout(() => {
        addMessage("assistant", "Thank you. Let me find the best matches for you...");
      }, 500);
      
      // Match properties for renters and buyers
      if ((formData.userType === "renter" || formData.userType === "buyer") && inquiryId) {
        setIsMatchingProperties(true);
        try {
          const { data: matchData, error: matchError } = await supabase.functions.invoke("match-properties", {
            body: { inquiryId }
          });
          
          if (matchError) throw matchError;
          
          setTimeout(() => {
            if (matchData?.matches && matchData.matches.length > 0) {
              addMessage("assistant", "Here are properties that match your requirements:", matchData.matches);
            } else {
              addMessage("assistant", "We don't have exact matches in our current inventory, but our team will personally reach out with recommendations tailored to your needs.");
            }
            setTimeout(() => {
              addMessage("assistant", "A member of the BRIDGE Residential team will follow up shortly to discuss these options and answer any questions.");
              setConversationStep("complete");
            }, 500);
          }, 1000);
        } catch (matchError) {
          console.error("Error matching properties:", matchError);
          setTimeout(() => {
            addMessage("assistant", "A member of the BRIDGE Residential team will follow up shortly with personalized recommendations.");
            setConversationStep("complete");
          }, 500);
        } finally {
          setIsMatchingProperties(false);
        }
      } else {
        setTimeout(() => {
          addMessage("assistant", "A member of the BRIDGE Residential team will follow up shortly.");
          setConversationStep("complete");
        }, 1000);
      }
      
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
              <button onClick={() => handleUserTypeSelection("renter")} className="w-full p-3 md:p-4 text-left bg-white border border-neutral-200 hover:bg-black hover:text-white hover:border-black rounded-lg transition-colors text-xs md:text-sm text-black">
                I am looking to rent
              </button>
              <button onClick={() => handleUserTypeSelection("buyer")} className="w-full p-3 md:p-4 text-left bg-white border border-neutral-200 hover:bg-black hover:text-white hover:border-black rounded-lg transition-colors text-xs md:text-sm text-black">
                I am looking to buy
              </button>
              <button onClick={() => handleUserTypeSelection("seller")} className="w-full p-3 md:p-4 text-left bg-white border border-neutral-200 hover:bg-black hover:text-white hover:border-black rounded-lg transition-colors text-xs md:text-sm text-black">
                I want to sell or lease my property
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