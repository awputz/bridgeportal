import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const FloatingLoginButton = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't show if user is logged in
  if (user) return null;

  return (
    <Button
      onClick={() => navigate("/auth")}
      size="lg"
      className="fixed bottom-8 left-8 z-40 rounded-full h-14 w-14 shadow-xl hover:scale-110 transition-transform"
      aria-label="Login"
    >
      <LogIn size={20} />
    </Button>
  );
};
