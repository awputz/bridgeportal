import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DealForMatching {
  id: string;
  property_address: string;
  borough: string | null;
  neighborhood: string | null;
  property_type: string | null;
  value: number | null;
  gross_sf: number | null;
  cap_rate: number | null;
  asking_rent_psf: number | null;
  deal_type: string;
  division: string;
}

interface ContactForMatching {
  id: string;
  full_name: string;
  contact_type: string;
  preferred_asset_types: string[] | null;
  target_markets: string[] | null;
  investment_criteria: Record<string, unknown> | null;
  portfolio_size: number | null;
  investor_profile: string | null;
}

interface MatchResult {
  contact_id: string;
  match_score: number;
  match_reasons: string[];
  ai_summary: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { deal_id } = await req.json();

    if (!deal_id) {
      return new Response(
        JSON.stringify({ error: "deal_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the deal
    const { data: deal, error: dealError } = await supabase
      .from("crm_deals")
      .select("id, property_address, borough, neighborhood, property_type, value, gross_sf, cap_rate, asking_rent_psf, deal_type, division")
      .eq("id", deal_id)
      .single();

    if (dealError || !deal) {
      console.error("Deal not found:", dealError);
      return new Response(
        JSON.stringify({ error: "Deal not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch potential matching contacts (buyers, investors, tenants)
    const { data: contacts, error: contactsError } = await supabase
      .from("crm_contacts")
      .select("id, full_name, contact_type, preferred_asset_types, target_markets, investment_criteria, portfolio_size, investor_profile")
      .in("contact_type", ["buyer", "investor", "tenant"])
      .eq("is_active", true)
      .is("deleted_at", null)
      .limit(100);

    if (contactsError) {
      console.error("Error fetching contacts:", contactsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch contacts" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ matches: [], message: "No potential matching contacts found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build AI prompt
    const dealDescription = `
Property: ${deal.property_address}
Borough: ${deal.borough || "N/A"}
Neighborhood: ${deal.neighborhood || "N/A"}
Property Type: ${deal.property_type || "N/A"}
Value: ${deal.value ? `$${deal.value.toLocaleString()}` : "N/A"}
Size: ${deal.gross_sf ? `${deal.gross_sf.toLocaleString()} SF` : "N/A"}
Cap Rate: ${deal.cap_rate ? `${deal.cap_rate}%` : "N/A"}
Asking Rent PSF: ${deal.asking_rent_psf ? `$${deal.asking_rent_psf}/SF` : "N/A"}
Deal Type: ${deal.deal_type}
Division: ${deal.division}
    `.trim();

    const contactsList = contacts.map((c: ContactForMatching) => {
      const criteria = c.investment_criteria || {};
      return `
Contact ID: ${c.id}
Name: ${c.full_name}
Type: ${c.contact_type}
Preferred Asset Types: ${c.preferred_asset_types?.join(", ") || "Not specified"}
Target Markets: ${c.target_markets?.join(", ") || "Not specified"}
Investment Criteria: ${JSON.stringify(criteria)}
Portfolio Size: ${c.portfolio_size ? `$${c.portfolio_size.toLocaleString()}` : "Not specified"}
Investor Profile: ${c.investor_profile || "Not specified"}
      `.trim();
    }).join("\n\n---\n\n");

    const systemPrompt = `You are a commercial real estate deal matching expert. Your job is to analyze a property listing and a list of potential buyers/investors/tenants to find the best matches.

For each contact, evaluate how well the property matches their criteria based on:
1. Asset type preference (property type alignment)
2. Location preference (target markets, borough, neighborhood)
3. Budget/value alignment (based on investment_criteria if available)
4. Profile fit (investor profile, portfolio size)

Return matches with scores above 50. Be specific about why each contact is a good match.`;

    const userPrompt = `Here is the property listing:

${dealDescription}

Here are the potential contacts to evaluate:

${contactsList}

Analyze each contact and return matches with scores above 50.`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_matches",
              description: "Return the list of matching contacts with scores and reasons",
              parameters: {
                type: "object",
                properties: {
                  matches: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        contact_id: { type: "string", description: "The UUID of the matching contact" },
                        match_score: { type: "integer", description: "Match score from 0-100" },
                        match_reasons: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "List of specific reasons why this is a good match" 
                        },
                        ai_summary: { type: "string", description: "One sentence recommendation" }
                      },
                      required: ["contact_id", "match_score", "match_reasons", "ai_summary"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["matches"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_matches" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    console.log("AI response:", JSON.stringify(aiData, null, 2));

    // Extract matches from tool call response
    let matches: MatchResult[] = [];
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        matches = parsed.matches || [];
      } catch (e) {
        console.error("Failed to parse AI response:", e);
      }
    }

    // Filter and validate matches
    const validContactIds = new Set(contacts.map((c: ContactForMatching) => c.id));
    const validMatches = matches.filter(
      (m) => validContactIds.has(m.contact_id) && m.match_score >= 50
    );

    console.log(`Found ${validMatches.length} valid matches for deal ${deal_id}`);

    // Upsert matches into database
    if (validMatches.length > 0) {
      const matchRecords = validMatches.map((m) => ({
        deal_id,
        contact_id: m.contact_id,
        match_score: m.match_score,
        match_reasons: m.match_reasons,
        ai_summary: m.ai_summary,
        is_dismissed: false,
        is_contacted: false,
      }));

      const { error: upsertError } = await supabase
        .from("deal_matches")
        .upsert(matchRecords, { 
          onConflict: "deal_id,contact_id",
          ignoreDuplicates: false 
        });

      if (upsertError) {
        console.error("Error upserting matches:", upsertError);
      }
    }

    return new Response(
      JSON.stringify({ 
        matches: validMatches, 
        total_contacts_analyzed: contacts.length,
        matches_found: validMatches.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("match-deals error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
