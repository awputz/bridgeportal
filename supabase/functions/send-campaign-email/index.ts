import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendCampaignRequest {
  campaignId: string;
  testMode?: boolean; // If true, only sends to the first recipient
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { campaignId, testMode = false }: SendCampaignRequest = await req.json();

    if (!campaignId) {
      return new Response(
        JSON.stringify({ error: "Campaign ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("agent_id", user.id)
      .single();

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: "Campaign not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch recipients
    const { data: recipients, error: recipientsError } = await supabase
      .from("email_campaign_recipients")
      .select("*")
      .eq("campaign_id", campaignId)
      .eq("status", "pending");

    if (recipientsError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch recipients" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!recipients || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No pending recipients" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // In test mode, only send to first recipient
    const recipientsToSend = testMode ? [recipients[0]] : recipients;

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Send emails (batch processing)
    for (const recipient of recipientsToSend) {
      try {
        const emailResponse = await resend.emails.send({
          from: campaign.from_email || "Marketing <noreply@resend.dev>",
          to: [recipient.email],
          subject: campaign.subject,
          html: campaign.html_content || `<p>${campaign.content}</p>`,
        });

        if (emailResponse.error) {
          throw new Error(emailResponse.error.message);
        }

        // Update recipient status
        await supabase
          .from("email_campaign_recipients")
          .update({ 
            status: "sent",
            sent_at: new Date().toISOString()
          })
          .eq("id", recipient.id);

        sentCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Failed to send to ${recipient.email}:`, err);
        errors.push(`${recipient.email}: ${errorMessage}`);

        // Update recipient status as failed
        await supabase
          .from("email_campaign_recipients")
          .update({ 
            status: "failed",
            error_message: errorMessage
          })
          .eq("id", recipient.id);

        failedCount++;
      }
    }

    // Update campaign status
    const newStatus = testMode ? campaign.status : "sent";
    await supabase
      .from("email_campaigns")
      .update({
        status: newStatus,
        sent_at: testMode ? null : new Date().toISOString(),
        total_sent: (campaign.total_sent || 0) + sentCount,
      })
      .eq("id", campaignId);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        failed: failedCount,
        errors: errors.length > 0 ? errors : undefined,
        testMode,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-campaign-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
