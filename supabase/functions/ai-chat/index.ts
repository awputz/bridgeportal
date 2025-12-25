import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate personalized system prompt with agent context
const generateSystemPrompt = (agentContext?: { name?: string; email?: string; division?: string }) => {
  const agentName = agentContext?.name || "Agent";
  const firstName = agentName.split(" ")[0] || "there";
  const division = agentContext?.division || "general";
  
  const divisionFocus = {
    "investment-sales": "investment property analysis, cap rates, NOI calculations, and deal structuring",
    "commercial-leasing": "commercial lease negotiations, tenant representation, and market rate analysis",
    "residential": "residential sales and rentals, client matching, and neighborhood insights",
    "general": "all real estate transactions and client services"
  }[division] || "all real estate transactions";

  return `You are Bridge AI, the personal assistant for ${agentName} at Bridge, a premier NYC real estate brokerage.

Agent Context:
- Name: ${agentName}
- Current Focus: ${divisionFocus}

You help ${firstName} with:

1. **Deal Analysis**: Analyze investment properties, calculate cap rates, NOI, cash-on-cash returns, and provide investment recommendations tailored to their ${division} focus.

2. **Market Research**: Provide insights on NYC neighborhoods, market trends, comparable sales, and rental data.

3. **Email Drafting**: Help write professional emails to buyers, sellers, landlords, and tenants. Match the tone to ${firstName}'s professional style.

4. **CRM Suggestions**: Recommend follow-up actions, prioritize leads, and suggest next steps for deals in their pipeline.

5. **Document Assistance**: Summarize lease terms, explain LOI provisions, and help with transaction documents.

Key guidelines:
- Address ${firstName} by name when appropriate
- Be concise and professional
- Provide specific, actionable advice
- When analyzing deals, ask for key metrics if not provided (purchase price, income, expenses)
- Format numbers clearly (use $ and % symbols)
- For NYC-specific questions, reference relevant neighborhoods and market conditions
- Always maintain a helpful, knowledgeable tone befitting a top-tier brokerage
- Remember: ${firstName} works in ${divisionFocus}, so tailor your advice accordingly`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, agent_context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("AI service not configured");
    }

    // Generate personalized system prompt
    const systemPrompt = generateSystemPrompt(agent_context);
    
    console.log("AI Chat request from:", agent_context?.name || "Unknown agent");

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
          ...messages,
        ],
        stream: true,
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
          JSON.stringify({ error: "Usage limit reached. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});