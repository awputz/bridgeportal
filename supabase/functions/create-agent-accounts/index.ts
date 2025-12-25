import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AgentAccount {
  email: string;
  password: string;
  role: "admin" | "agent";
  name: string;
}

const agentAccounts: AgentAccount[] = [
  // Office account - Admin role
  { email: "office@bridgenyre.com", password: "BridgeOffice2025!", role: "admin", name: "Bridge Office" },
  // Leadership - Admin role
  { email: "alex@bridgenyre.com", password: "BridgeAlex2025!", role: "admin", name: "Alex W. Putzer" },
  { email: "joshua@bridgenyre.com", password: "BridgeJosh2025!", role: "admin", name: "Joshua S. Malekan" },
  { email: "jn@bridgenyre.com", password: "BridgeJacob2025!", role: "admin", name: "Jacob Neiderfer" },
  { email: "eric@bridgenyre.com", password: "BridgeEric2025!", role: "admin", name: "Eric Delafraz" },
  // Investment Sales - Agent role
  { email: "roy@bridgenyre.com", password: "BridgeRoy2025!", role: "agent", name: "Roy I. Oskar" },
  { email: "brandon@bridgenyre.com", password: "BridgeBrandon2025!", role: "agent", name: "Brandon Khankhanian" },
  { email: "matt@bridgenyre.com", password: "BridgeMatt2025!", role: "agent", name: "Matt Dowling" },
  { email: "emanuel@bridgenyre.com", password: "BridgeEmanuel2025!", role: "agent", name: "Emanuel Hakami" },
  { email: "asher@bridgenyre.com", password: "BridgeAsher2025!", role: "agent", name: "Asher Nazar" },
  { email: "quinn@bridgenyre.com", password: "BridgeQuinn2025!", role: "agent", name: "Quinn Hukee" },
  { email: "noah@bridgenyre.com", password: "BridgeNoah2025!", role: "agent", name: "Noah Kaplan" },
  // Residential - Agent role
  { email: "henny@bridgenyre.com", password: "BridgeHenny2025!", role: "agent", name: "Henny Sherman" },
  { email: "coco@bridgenyre.com", password: "BridgeCoco2025!", role: "agent", name: "Coco Campbell" },
  // Operations - Agent role
  { email: "david@bridgenyre.com", password: "BridgeDavid2025!", role: "agent", name: "David Nass" },
  { email: "arezu@bridgenyre.com", password: "BridgeArezu2025!", role: "agent", name: "Arezu Bedar" },
  // Marketing - Agent role
  { email: "manuel@bridgenyre.com", password: "BridgeManuel2025!", role: "agent", name: "Manuel Rupert" },
  // Advisory - Agent role
  { email: "matt.simon@bridgenyre.com", password: "BridgeMatthew2025!", role: "agent", name: "Matthew Simon ESQ" },
  { email: "evan@bridgenyre.com", password: "BridgeEvan2025!", role: "agent", name: "Evan Nehmadi" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results: { email: string; success: boolean; error?: string; userId?: string }[] = [];

    for (const agent of agentAccounts) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === agent.email);

        let userId: string;

        if (existingUser) {
          userId = existingUser.id;
          // Update password for existing user
          await supabase.auth.admin.updateUserById(userId, {
            password: agent.password,
            email_confirm: true,
          });
          results.push({ email: agent.email, success: true, userId, error: "Updated existing user" });
        } else {
          // Create new user
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: agent.email,
            password: agent.password,
            email_confirm: true,
            user_metadata: { full_name: agent.name },
          });

          if (createError) {
            results.push({ email: agent.email, success: false, error: createError.message });
            continue;
          }

          userId = newUser.user.id;
          results.push({ email: agent.email, success: true, userId });
        }

        // Check if role already exists
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (!existingRole) {
          // Insert role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({ user_id: userId, role: agent.role });

          if (roleError) {
            console.error(`Error assigning role for ${agent.email}:`, roleError);
          }
        } else {
          // Update existing role
          await supabase
            .from("user_roles")
            .update({ role: agent.role })
            .eq("user_id", userId);
        }

        // Update profile if it exists
        await supabase
          .from("profiles")
          .upsert({
            id: userId,
            email: agent.email,
            full_name: agent.name,
          }, { onConflict: "id" });

      } catch (err) {
        results.push({ email: agent.email, success: false, error: String(err) });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error creating agent accounts:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
