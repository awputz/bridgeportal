import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inquiryId } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Matching properties for inquiry:", inquiryId);

    // Fetch inquiry details
    const { data: inquiry, error: inquiryError } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", inquiryId)
      .single();

    if (inquiryError) throw inquiryError;

    // Fetch all active properties
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active");

    if (propertiesError) throw propertiesError;

    console.log(`Found ${properties.length} active properties`);

    // Use AI to match properties
    const prompt = `You are a real estate matching expert. Based on the user's requirements, score each property from 0-100 on how well it matches.

User Requirements:
- User Type: ${inquiry.user_type}
- Budget: ${inquiry.budget || "Not specified"}
- Bedrooms/Bathrooms: ${inquiry.requirements || "Not specified"}
- Neighborhoods: ${inquiry.neighborhoods || "Any"}
- Timeline: ${inquiry.timeline || "Not specified"}
- Notes: ${inquiry.notes || "None"}

Available Properties:
${properties.map((p, i) => `
Property ${i + 1}:
- Title: ${p.title}
- Address: ${p.address}, ${p.city}
- Price: $${p.price}${p.listing_type === 'rent' ? '/month' : ''}
- Type: ${p.listing_type} ${p.property_type}
- Bedrooms: ${p.bedrooms}, Bathrooms: ${p.bathrooms}
- Square Feet: ${p.square_feet}
- Amenities: ${p.amenities?.join(", ") || "None listed"}
`).join("\n")}

Return ONLY a JSON array with this exact structure, no other text:
[{"property_index": 0, "score": 95, "reason": "Perfect match because..."}, ...]

Include only properties with score >= 60. Sort by score descending.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON in AI response");
    }
    
    const matches = JSON.parse(jsonMatch[0]);
    console.log(`AI found ${matches.length} matching properties`);

    // Map matches to full property data
    const matchedProperties = matches.map((match: any) => ({
      ...properties[match.property_index],
      match_score: match.score,
      match_reason: match.reason,
    }));

    return new Response(
      JSON.stringify({ matches: matchedProperties }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Match properties error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
