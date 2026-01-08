import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, referenceDate } = await req.json();
    
    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const today = referenceDate || new Date().toISOString().split("T")[0];
    
    const systemPrompt = `You are an AI that parses natural language event descriptions into structured data.
Given a text input, extract the following:
- title: The event title (remove date/time parts)
- date: The date in YYYY-MM-DD format (use ${today} as reference for "today", "tomorrow", etc.)
- time: The start time in HH:MM 24-hour format (e.g., "14:00" for 2pm)
- duration: Duration in minutes (default 60 if not specified)
- all_day: Boolean if this is an all-day event
- location: Location if mentioned
- recurrence: "none", "daily", "weekly", "monthly" if mentioned

Examples:
- "Lunch with John tomorrow at noon" → title: "Lunch with John", date: tomorrow's date, time: "12:00", duration: 60
- "Team meeting every Monday at 9am for 30 minutes" → title: "Team meeting", time: "09:00", duration: 30, recurrence: "weekly"
- "All day conference on January 15" → title: "All day conference", date: "2026-01-15", all_day: true

Return ONLY valid JSON, no other text.`;

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
          { role: "user", content: `Parse this event description: "${text}"` },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, content];
      parsed = JSON.parse(jsonMatch[1] || content);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify({
        success: true,
        parsed: {
          title: parsed.title || text,
          date: parsed.date || null,
          time: parsed.time || null,
          duration: parsed.duration || 60,
          all_day: parsed.all_day || false,
          location: parsed.location || null,
          recurrence: parsed.recurrence || "none",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error parsing event:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
