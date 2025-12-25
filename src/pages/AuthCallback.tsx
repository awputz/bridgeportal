import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing sign-in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session - Supabase handles the OAuth callback automatically
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setStatus("Sign-in failed. Redirecting...");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
          return;
        }

        if (session?.user) {
          setStatus("Storing Google tokens...");
          
          // Check if this is a Google sign-in with provider tokens
          const googleIdentity = session.user.identities?.find(i => i.provider === 'google');
          
          if (googleIdentity && session.provider_token) {
            console.log("Storing Google tokens from OAuth callback...");
            
            // Calculate token expiry
            const expiryDate = new Date();
            expiryDate.setSeconds(expiryDate.getSeconds() + (session.expires_in || 3600));

            // Store tokens in BOTH unified AND service-specific columns
            const { error: tokenError } = await supabase
              .from('user_google_tokens')
              .upsert({
                user_id: session.user.id,
                // Unified columns
                access_token: session.provider_token,
                refresh_token: session.provider_refresh_token || null,
                token_expiry: expiryDate.toISOString(),
                // Service-specific columns (for backwards compatibility)
                gmail_access_token: session.provider_token,
                gmail_refresh_token: session.provider_refresh_token || null,
                calendar_access_token: session.provider_token,
                calendar_refresh_token: session.provider_refresh_token || null,
                drive_access_token: session.provider_token,
                drive_refresh_token: session.provider_refresh_token || null,
                contacts_access_token: session.provider_token,
                contacts_refresh_token: session.provider_refresh_token || null,
                // User info
                google_email: session.user.email,
                google_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                google_avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                // Enable all services
                gmail_enabled: true,
                calendar_enabled: true,
                drive_enabled: true,
                contacts_enabled: true,
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'user_id',
              });

            if (tokenError) {
              console.error("Failed to store Google tokens:", tokenError);
            } else {
              console.log("Google tokens stored successfully");
            }
          }

          setStatus("Success! Redirecting to portal...");
          navigate("/portal", { replace: true });
        } else {
          setStatus("No session found. Redirecting...");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
        }
      } catch (err) {
        console.error("Auth callback exception:", err);
        setStatus("An error occurred. Redirecting...");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback;