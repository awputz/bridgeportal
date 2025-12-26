import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createLogger } from "../_shared/logger.ts";
import { getCorrelationId, createResponseHeaders, getIpAddress } from "../_shared/context.ts";
import { checkRateLimit, getRateLimitConfig, getRateLimitIdentifier, rateLimitExceededResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-correlation-id",
};

interface EnhancedAgentContext {
  name?: string;
  email?: string;
  division?: string;
  stats?: {
    activeDeals: number;
    totalContacts: number;
    pipelineValue: number;
  };
  recentDeals?: Array<{
    property_address: string;
    value: number | null;
    stage_id: string | null;
    expected_close: string | null;
    priority: string | null;
  }>;
  recentTransactions?: Array<{
    property_address: string;
    sale_price: number | null;
    division: string | null;
    closing_date: string | null;
    commission: number | null;
  }>;
  upcomingTasks?: Array<{
    title: string;
    due_date: string | null;
    is_completed: boolean;
  }>;
}

// Generate personalized system prompt with deep agent context
const generateSystemPrompt = (agentContext?: EnhancedAgentContext) => {
  const agentName = agentContext?.name || "Agent";
  const firstName = agentName.split(" ")[0] || "there";
  const division = agentContext?.division || "general";
  const stats = agentContext?.stats;
  const recentDeals = agentContext?.recentDeals || [];
  const recentTransactions = agentContext?.recentTransactions || [];
  const upcomingTasks = agentContext?.upcomingTasks || [];
  
  const divisionFocus = {
    "investment-sales": "investment property analysis, cap rates, NOI calculations, and deal structuring",
    "commercial-leasing": "commercial lease negotiations, tenant representation, and market rate analysis",
    "residential": "residential sales and rentals, client matching, and neighborhood insights",
    "general": "all real estate transactions and client services"
  }[division] || "all real estate transactions";

  const dealsSummary = recentDeals.length > 0 
    ? recentDeals.map(d => `• ${d.property_address} - $${d.value?.toLocaleString() || 'TBD'} (Priority: ${d.priority || 'medium'})`).join('\n')
    : "No active deals in pipeline";

  const transactionsSummary = recentTransactions.length > 0
    ? recentTransactions.map(t => `• ${t.property_address} - $${t.sale_price?.toLocaleString() || 'N/A'} (${t.division || 'N/A'})`).join('\n')
    : "No recent transactions";

  const tasksSummary = upcomingTasks.length > 0
    ? upcomingTasks.map(t => `• ${t.title}${t.due_date ? ` - Due: ${new Date(t.due_date).toLocaleDateString()}` : ''}`).join('\n')
    : "No upcoming tasks";

  const dealsWithoutValue = recentDeals.filter(d => !d.value).length;
  const missingDataWarning = dealsWithoutValue > 0 
    ? `\n\n⚠️ ${dealsWithoutValue} deal(s) are missing value/commission data. Remind ${firstName} to update these.`
    : "";

  return `You are Bridge AI, the personal assistant for ${agentName} at Bridge, a premier NYC real estate brokerage.

## Agent Profile:
- Name: ${agentName}
- Email: ${agentContext?.email || 'Not provided'}
- Current Division Focus: ${division} (${divisionFocus})

## Current Activity Stats:
- Active Deals: ${stats?.activeDeals || 0}
- Total Contacts: ${stats?.totalContacts || 0}
- Pipeline Value: $${stats?.pipelineValue?.toLocaleString() || 0}

## Active Deals in Pipeline:
${dealsSummary}

## Recent Closed Transactions:
${transactionsSummary}

## Upcoming Tasks:
${tasksSummary}${missingDataWarning}

## Your Role:
You help ${firstName} with:

1. **Deal Analysis**: Analyze investment properties, calculate cap rates, NOI, cash-on-cash returns. When asked about deals, reference ${firstName}'s actual deals listed above.

2. **Market Research**: Provide insights on NYC neighborhoods, market trends, comparable sales, and rental data.

3. **Email Drafting**: Help write professional emails to buyers, sellers, landlords, and tenants. Match the tone to a top NYC brokerage professional.

4. **CRM & Pipeline Guidance**: Recommend follow-up actions, prioritize leads, and suggest next steps for deals. Reference the actual deals and tasks above.

5. **Document Assistance**: Summarize lease terms, explain LOI provisions, and help with transaction documents.

6. **Proactive Suggestions**: If ${firstName} asks about their pipeline or performance, use the real numbers above. Identify gaps (missing commission entries, overdue tasks) and provide actionable recommendations.

## Key Guidelines:
- Always address ${firstName} by name when appropriate
- Reference their actual deals, transactions, and tasks when giving advice
- Be concise and professional with specific, actionable advice
- When analyzing deals, ask for key metrics if not provided (purchase price, income, expenses)
- Format numbers clearly (use $ and % symbols, full numbers for Investment Sales)
- For NYC-specific questions, reference relevant neighborhoods and market conditions
- If a deal is missing value/commission data, gently remind them to update it
- Tailor all advice to ${firstName}'s ${division} focus
- Be proactive: suggest follow-ups for deals approaching expected close dates

Remember: You're ${firstName}'s dedicated AI partner, not a generic assistant. Use their data to provide personalized, actionable guidance.`;
};

serve(async (req) => {
  const correlationId = getCorrelationId(req);
  const logger = createLogger('ai-chat', correlationId);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const endpoint = 'ai-chat';
  const identifier = getRateLimitIdentifier(req);
  
  try {
    logger.requestStart(req.method, '/ai-chat');
    
    // Check rate limit
    const rateLimitResult = await checkRateLimit(identifier, endpoint);
    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { identifier, endpoint });
      return rateLimitExceededResponse(rateLimitResult, getRateLimitConfig(endpoint), correlationId);
    }

    const { messages, agent_context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      logger.error("LOVABLE_API_KEY not configured");
      throw new Error("AI service not configured");
    }

    const systemPrompt = generateSystemPrompt(agent_context);
    
    logger.info("Processing AI chat request", {
      agentName: agent_context?.name,
      messageCount: messages?.length,
      division: agent_context?.division,
    });

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
      logger.error("AI gateway error", new Error(errorText), { status: response.status });
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...createResponseHeaders(correlationId), ...rateLimitHeaders(rateLimitResult, getRateLimitConfig(endpoint)) } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please contact support." }),
          { status: 402, headers: createResponseHeaders(correlationId) }
        );
      }
      
      throw new Error("AI gateway error");
    }

    logger.requestEnd(req.method, '/ai-chat', 200, { streaming: true });

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "X-Correlation-Id": correlationId,
        ...rateLimitHeaders(rateLimitResult, getRateLimitConfig(endpoint)),
      },
    });
  } catch (error) {
    logger.error("AI Chat error", error instanceof Error ? error : new Error(String(error)));
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: createResponseHeaders(correlationId) }
    );
  }
});
