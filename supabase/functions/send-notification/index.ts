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
    // Common fields
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    
    // Inquiry fields
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
    
    // Commission request fields
    agent_name?: string;
    agent_email?: string;
    status?: string;
    commission_amount?: number;
    closing_date?: string;
    deal_type?: string;
    admin_notes?: string;
    
    // Agent request fields
    request_type?: string;
    client_name?: string;
    
    // Announcement fields
    title?: string;
    content?: string;
    announcement_type?: string;
    
    // Recipients for bulk email
    recipients?: string[];
  };
}

// Email template styles
const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #f9f9f9; }
  .container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .header { text-align: center; margin-bottom: 30px; }
  .logo { font-size: 24px; font-weight: bold; color: #1a1a1a; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .badge-approved { background: #dcfce7; color: #166534; }
  .badge-paid { background: #dbeafe; color: #1e40af; }
  .badge-rejected { background: #fee2e2; color: #991b1b; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .section { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
  .section h3 { margin: 0 0 15px 0; color: #333; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
  .section p { margin: 8px 0; font-size: 14px; }
  .highlight { font-size: 28px; font-weight: bold; color: #1a1a1a; }
  .cta { display: inline-block; padding: 12px 24px; background: #1a1a1a; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  .footer { color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; }
`;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Commission Status Change Email
const formatCommissionStatusEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const status = data.status || 'updated';
  const statusBadge = {
    approved: '<span class="badge badge-approved">APPROVED</span>',
    paid: '<span class="badge badge-paid">PAID</span>',
    rejected: '<span class="badge badge-rejected">NEEDS REVISION</span>',
    under_review: '<span class="badge badge-pending">UNDER REVIEW</span>',
    pending: '<span class="badge badge-pending">PENDING</span>',
  }[status] || '<span class="badge badge-pending">UPDATED</span>';

  const message = {
    approved: 'Great news! Your commission request has been approved and is being processed for payment.',
    paid: 'Your commission has been paid! The funds should appear in your account within 1-3 business days.',
    rejected: 'Your commission request needs some revisions. Please check the admin notes below and resubmit.',
    under_review: 'Your commission request is now being reviewed by our team.',
    pending: 'Your commission request has been received and is awaiting review.',
  }[status] || 'Your commission request status has been updated.';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Bridge Advisory Group</div>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            ${statusBadge}
            <h1 style="margin: 20px 0 10px; font-size: 24px; font-weight: 500;">Commission Request ${status === 'paid' ? 'Paid!' : status.charAt(0).toUpperCase() + status.slice(1)}</h1>
            <p style="color: #666; margin: 0;">${message}</p>
          </div>
          
          <div class="section">
            <h3>Request Details</h3>
            <p><strong>Property:</strong> ${data.property_address || 'N/A'}</p>
            <p><strong>Deal Type:</strong> ${data.deal_type || 'N/A'}</p>
            <p><strong>Closing Date:</strong> ${data.closing_date ? formatDate(data.closing_date) : 'N/A'}</p>
            <p style="margin-top: 15px;"><strong>Commission Amount:</strong></p>
            <p class="highlight">${data.commission_amount ? formatCurrency(data.commission_amount) : 'N/A'}</p>
          </div>
          
          ${data.admin_notes ? `
          <div class="section" style="background: #fff3cd; border: 1px solid #ffc107;">
            <h3>Admin Notes</h3>
            <p style="white-space: pre-wrap;">${data.admin_notes}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="https://bridgenyre.com/portal/my-commission-requests" class="cta">View My Commission Requests</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from Bridge Advisory Group.</p>
          <p>If you have questions, please contact the office.</p>
        </div>
      </body>
    </html>
  `;

  const subject = {
    approved: `✅ Commission Approved - ${data.property_address}`,
    paid: `💰 Commission Paid - ${data.property_address}`,
    rejected: `⚠️ Commission Request Needs Revision - ${data.property_address}`,
    under_review: `📋 Commission Under Review - ${data.property_address}`,
    pending: `📩 Commission Request Received - ${data.property_address}`,
  }[status] || `Commission Update - ${data.property_address}`;

  return { html, subject };
};

// Agent Request Completion Email
const formatRequestCompletedEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Bridge Advisory Group</div>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <span class="badge badge-approved">COMPLETED</span>
            <h1 style="margin: 20px 0 10px; font-size: 24px; font-weight: 500;">Your Request is Complete!</h1>
            <p style="color: #666; margin: 0;">Your ${data.request_type} request has been completed.</p>
          </div>
          
          <div class="section">
            <h3>Request Details</h3>
            <p><strong>Request Type:</strong> ${data.request_type || 'N/A'}</p>
            ${data.property_address ? `<p><strong>Property:</strong> ${data.property_address}</p>` : ''}
            ${data.client_name ? `<p><strong>Client:</strong> ${data.client_name}</p>` : ''}
          </div>
          
          ${data.notes ? `
          <div class="section">
            <h3>Notes</h3>
            <p style="white-space: pre-wrap;">${data.notes}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="https://bridgenyre.com/portal/requests" class="cta">View My Requests</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from Bridge Advisory Group.</p>
        </div>
      </body>
    </html>
  `;

  const subject = `✅ Request Completed: ${data.request_type}`;

  return { html, subject };
};

// Company Announcement Email
const formatAnnouncementEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Bridge Advisory Group</div>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <span class="badge" style="background: #e0e7ff; color: #3730a3;">${(data.announcement_type || 'General').toUpperCase()}</span>
            <h1 style="margin: 20px 0 10px; font-size: 24px; font-weight: 500;">${data.title || 'Company Announcement'}</h1>
          </div>
          
          <div class="section" style="background: white; border: 1px solid #e5e7eb;">
            <div style="white-space: pre-wrap; line-height: 1.6;">${data.content || ''}</div>
          </div>
          
          <div style="text-align: center;">
            <a href="https://bridgenyre.com/portal/announcements" class="cta">View All Announcements</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from Bridge Advisory Group.</p>
        </div>
      </body>
    </html>
  `;

  const subject = `📢 ${data.title || 'Company Announcement'}`;

  return { html, subject };
};

// Welcome Email for New Agents
const formatWelcomeEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Bridge Advisory Group</div>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 20px 0 10px; font-size: 28px; font-weight: 500;">Welcome to Bridge! 🎉</h1>
            <p style="color: #666; margin: 0; font-size: 16px;">Hi ${data.name}, we're excited to have you on the team.</p>
          </div>
          
          <div class="section">
            <h3>Getting Started</h3>
            <p>Your account is ready! Here's what you can do:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li style="margin: 8px 0;">Complete your profile with photo and contact info</li>
              <li style="margin: 8px 0;">Connect your Google Workspace for email, calendar & contacts</li>
              <li style="margin: 8px 0;">Explore the CRM to manage your deals and contacts</li>
              <li style="margin: 8px 0;">Check out the templates and calculators</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="https://bridgenyre.com/portal" class="cta">Go to Agent Portal</a>
          </div>
        </div>
        <div class="footer">
          <p>Need help? Contact the office or check the Resources section in your portal.</p>
        </div>
      </body>
    </html>
  `;

  const subject = `Welcome to Bridge Advisory Group, ${data.name}! 🎉`;

  return { html, subject };
};

// Original Inquiry Email
const formatInquiryEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const sections: string[] = [];
  
  sections.push(`<h2 style="color: #1a1a1a; margin-bottom: 20px;">New Inquiry from ${data.name}</h2>`);
  
  sections.push(`
    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #333;">Contact Information</h3>
      <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
      <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      ${data.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
    </div>
  `);
  
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
  
  if (data.notes) {
    sections.push(`
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Message</h3>
        <p style="margin: 0; white-space: pre-wrap;">${data.notes}</p>
      </div>
    `);
  }
  
  const html = `
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

  const division = data.inquiry_type || 'General';
  const subject = `New ${division} Inquiry from ${data.name}`;

  return { html, subject };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    
    console.log(`Processing notification type: ${type}`);
    console.log(`Data:`, JSON.stringify(data, null, 2));

    let html: string;
    let subject: string;
    let recipients: string[] = [];

    switch (type) {
      case 'new_inquiry':
        ({ html, subject } = formatInquiryEmail(data));
        recipients = ['office@bridgenyre.com'];
        break;
        
      case 'commission_status_change':
        ({ html, subject } = formatCommissionStatusEmail(data));
        recipients = data.agent_email ? [data.agent_email] : [];
        break;
        
      case 'request_completed':
        ({ html, subject } = formatRequestCompletedEmail(data));
        recipients = data.email ? [data.email] : [];
        break;
        
      case 'new_announcement':
        ({ html, subject } = formatAnnouncementEmail(data));
        recipients = data.recipients || [];
        break;
        
      case 'welcome_agent':
        ({ html, subject } = formatWelcomeEmail(data));
        recipients = data.email ? [data.email] : [];
        break;
        
      default:
        console.log(`Unknown notification type: ${type}, skipping`);
        return new Response(
          JSON.stringify({ success: true, message: 'Notification type not handled' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (recipients.length === 0) {
      console.log('No recipients specified, skipping email');
      return new Response(
        JSON.stringify({ success: true, message: 'No recipients' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending email to ${recipients.join(', ')} with subject: ${subject}`);

    const emailResponse = await resend.emails.send({
      from: "Bridge Advisory Group <noreply@bridgenyre.com>",
      to: recipients,
      subject: subject,
      html: html,
      reply_to: data.email || undefined,
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