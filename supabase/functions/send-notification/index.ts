import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, data } = await req.json();

    console.log(`Processing notification type: ${type}`);

    let emailData;
    
    switch (type) {
      case 'new_inquiry':
        emailData = {
          recipient_email: 'info@bridgeinvestmentsales.com',
          recipient_name: 'Bridge Advisory Team',
          subject: `New Inquiry from ${data.name}`,
          body: `
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Type:</strong> ${data.inquiry_type || 'General'}</p>
            ${data.requirements ? `<p><strong>Requirements:</strong><br>${data.requirements}</p>` : ''}
            ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
            ${data.neighborhoods ? `<p><strong>Neighborhoods:</strong> ${data.neighborhoods}</p>` : ''}
            <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
          `,
          template_type: 'new_inquiry',
          metadata: { inquiry_id: data.id }
        };
        break;

      case 'tour_request':
        emailData = {
          recipient_email: 'info@bridgeinvestmentsales.com',
          recipient_name: 'Bridge Advisory Team',
          subject: `Tour Request from ${data.name}`,
          body: `
            <h2>New Tour Request</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Property:</strong> ${data.property_address || 'Property ID: ' + data.property_id}</p>
            ${data.preferred_date ? `<p><strong>Preferred Date:</strong> ${new Date(data.preferred_date).toLocaleDateString()}</p>` : ''}
            ${data.preferred_time ? `<p><strong>Preferred Time:</strong> ${data.preferred_time}</p>` : ''}
            ${data.message ? `<p><strong>Message:</strong><br>${data.message}</p>` : ''}
          `,
          template_type: 'tour_request',
          metadata: { tour_id: data.id }
        };
        break;

      case 'property_matched':
        emailData = {
          recipient_email: data.email,
          recipient_name: data.name,
          subject: 'Properties Matched to Your Requirements',
          body: `
            <h2>We Found Properties for You!</h2>
            <p>Hi ${data.name},</p>
            <p>Great news! We've found ${data.match_count} properties that match your requirements.</p>
            <p>Our team will be reaching out to you shortly to discuss these opportunities.</p>
            <p>Best regards,<br>Bridge Advisory Group</p>
          `,
          template_type: 'property_matched',
          metadata: { inquiry_id: data.inquiry_id }
        };
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    // Insert into email_notifications table
    const { data: notification, error } = await supabaseClient
      .from('email_notifications')
      .insert(emailData)
      .select()
      .single();

    if (error) throw error;

    console.log(`Email notification queued: ${notification.id}`);

    return new Response(
      JSON.stringify({ success: true, notification_id: notification.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-notification:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
