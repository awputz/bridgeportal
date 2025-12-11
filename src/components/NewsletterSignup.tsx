import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface NewsletterSignupProps {
  variant?: "default" | "compact";
  className?: string;
}

export const NewsletterSignup = ({ variant = "default", className = "" }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate submission - in production this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Successfully subscribed to our newsletter!");
    setEmail("");
    setIsLoading(false);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-white/10 font-light"
          required
        />
        <Button type="submit" disabled={isLoading} className="font-light">
          {isLoading ? "..." : <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    );
  }

  return (
    <div className={`p-8 rounded-lg border border-white/10 bg-white/[0.02] ${className}`}>
      <h3 className="text-2xl font-light mb-3">Stay Informed</h3>
      <p className="text-muted-foreground font-light mb-6">
        Subscribe to receive market insights, research reports, and exclusive listings.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-white/10 font-light flex-1"
          required
        />
        <Button type="submit" disabled={isLoading} className="font-light">
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-4 font-light">
        By subscribing, you agree to receive emails from Bridge Advisory Group. Unsubscribe anytime.
      </p>
    </div>
  );
};