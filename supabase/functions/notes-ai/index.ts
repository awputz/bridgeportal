import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { action, content, title } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "summarize") {
      systemPrompt = `You are a helpful assistant that summarizes notes for real estate agents. 
Create a concise 1-2 sentence summary that captures the key points and any action items.
Be direct and professional. Focus on what matters most for the agent's work.`;
      userPrompt = `Summarize this note:

Title: ${title || "Untitled"}
Content: ${content}`;
    } else if (action === "suggest-tags") {
      systemPrompt = `You are a helpful assistant that suggests relevant tags for real estate agent notes.
Suggest 3-5 short, relevant tags based on the note content.
Tags should be lowercase, single words or short phrases (2-3 words max).
Focus on: property types, deal stages, locations, action types, priorities.
Return ONLY a JSON array of strings, nothing else.`;
      userPrompt = `Suggest tags for this note:

Title: ${title || "Untitled"}
Content: ${content || title}

Return only a JSON array like: ["tag1", "tag2", "tag3"]`;
    } else if (action === "action-items") {
      systemPrompt = `You are a helpful assistant that extracts action items from notes for real estate agents.
Identify clear, actionable tasks from the note content.
Format each action item as a brief, actionable statement.
Return ONLY a JSON array of strings, nothing else.`;
      userPrompt = `Extract action items from this note:

Title: ${title || "Untitled"}
Content: ${content}

Return only a JSON array like: ["Call landlord about lease terms", "Schedule property viewing"]`;
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    console.log(`Processing ${action} request for note: ${title}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";

    console.log(`AI response for ${action}:`, aiResponse);

    let result: Record<string, unknown> = {};

    if (action === "summarize") {
      result = { summary: aiResponse.trim() };
    } else if (action === "suggest-tags" || action === "action-items") {
      try {
        // Extract JSON array from response
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          result = action === "suggest-tags" ? { tags: parsed } : { actionItems: parsed };
        } else {
          result = action === "suggest-tags" ? { tags: [] } : { actionItems: [] };
        }
      } catch {
        console.error("Failed to parse AI response as JSON:", aiResponse);
        result = action === "suggest-tags" ? { tags: [] } : { actionItems: [] };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in notes-ai function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
