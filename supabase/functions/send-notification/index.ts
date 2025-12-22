import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: string;
  data: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    inquiry_type?: string;
    user_type?: string;
    property_address?: string;
    neighborhoods?: string;
    requirements?: string;
    budget?: string;
    timeline?: string;
    timing?: string;
    assignment_type?: string;
    unit_count?: string;
    notes?: string;
    created_at?: string;
  };
}

const formatInquiryEmail = (data: NotificationRequest['data']): string => {
  const sections: string[] = [];
  
  sections.push(`<h2 style="color: #1a1a1a; margin-bottom: 20px;">New Inquiry from ${data.name}</h2>`);
  
  // Contact Info Section
  sections.push(`
    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #333;">Contact Information</h3>
      <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
      <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      ${data.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
    </div>
  `);
  
  // Inquiry Details Section
  const details: string[] = [];
  if (data.inquiry_type) details.push(`<p style="margin: 5px 0;"><strong>Division:</strong> ${data.inquiry_type}</p>`);
  if (data.user_type) details.push(`<p style="margin: 5px 0;"><strong>User Type:</strong> ${data.user_type}</p>`);
  if (data.property_address) details.push(`<p style="margin: 5px 0;"><strong>Property Address:</strong> ${data.property_address}</p>`);
  if (data.neighborhoods) details.push(`<p style="margin: 5px 0;"><strong>Neighborhoods:</strong> ${data.neighborhoods}</p>`);
  if (data.budget) details.push(`<p style="margin: 5px 0;"><strong>Budget:</strong> ${data.budget}</p>`);
  if (data.timeline) details.push(`<p style="margin: 5px 0;"><strong>Timeline:</strong> ${data.timeline}</p>`);
  if (data.timing) details.push(`<p style="margin: 5px 0;"><strong>Timing:</strong> ${data.timing}</p>`);
  if (data.assignment_type) details.push(`<p style="margin: 5px 0;"><strong>Assignment Type:</strong> ${data.assignment_type}</p>`);
  if (data.unit_count) details.push(`<p style="margin: 5px 0;"><strong>Unit Count:</strong> ${data.unit_count}</p>`);
  if (data.requirements) details.push(`<p style="margin: 5px 0;"><strong>Requirements:</strong> ${data.requirements}</p>`);
  
  if (details.length > 0) {
    sections.push(`
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Inquiry Details</h3>
        ${details.join('')}
      </div>
    `);
  }
  
  // Notes Section
  if (data.notes) {
    sections.push(`
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Message</h3>
        <p style="margin: 0; white-space: pre-wrap;">${data.notes}</p>
      </div>
    `);
  }
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        ${sections.join('')}
        <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          This inquiry was submitted via the Bridge Advisory Group website on ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST.
        </p>
      </body>
    </html>
  `;
};

const getSubjectLine = (data: NotificationRequest['data']): string => {
  const division = data.inquiry_type || 'General';
  return `New ${division} Inquiry from ${data.name}`;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    
    console.log(`Processing notification type: ${type}`);
    console.log(`Inquiry from: ${data.name} (${data.email})`);

    if (type !== 'new_inquiry') {
      console.log(`Unknown notification type: ${type}, skipping`);
      return new Response(
        JSON.stringify({ success: true, message: 'Notification type not handled' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const html = formatInquiryEmail(data);
    const subject = getSubjectLine(data);

    console.log(`Sending email to office@bridgenyre.com with subject: ${subject}`);

    const emailResponse = await resend.emails.send({
      from: "Bridge Advisory Group <noreply@bridgenyre.com>",
      to: ["office@bridgenyre.com"],
      subject: subject,
      html: html,
      reply_to: data.email,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
