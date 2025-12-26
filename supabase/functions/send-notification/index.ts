import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createLogger } from "../_shared/logger.ts";
import { getCorrelationId, createResponseHeaders } from "../_shared/context.ts";
import { checkRateLimit, getRateLimitConfig, getRateLimitIdentifier, rateLimitExceededResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-correlation-id",
};

interface NotificationRequest {
  type: string;
  data: {
    id?: string;
    name?: string;
    email?: string;
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
    agent_name?: string;
    agent_email?: string;
    status?: string;
    commission_amount?: number;
    closing_date?: string;
    deal_type?: string;
    admin_notes?: string;
    request_type?: string;
    client_name?: string;
    title?: string;
    content?: string;
    announcement_type?: string;
    recipients?: string[];
  };
}

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
    <!DOCTYPE html><html><head><meta charset="utf-8"><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><div class="logo">Bridge Advisory Group</div></div>
      <div style="text-align: center; margin-bottom: 30px;">
        ${statusBadge}
        <h1 style="margin: 20px 0 10px; font-size: 24px;">${status === 'paid' ? 'Paid!' : status.charAt(0).toUpperCase() + status.slice(1)}</h1>
        <p style="color: #666;">${message}</p>
      </div>
      <div class="section">
        <h3>Request Details</h3>
        <p><strong>Property:</strong> ${data.property_address || 'N/A'}</p>
        <p><strong>Deal Type:</strong> ${data.deal_type || 'N/A'}</p>
        <p><strong>Closing Date:</strong> ${data.closing_date ? formatDate(data.closing_date) : 'N/A'}</p>
        <p class="highlight">${data.commission_amount ? formatCurrency(data.commission_amount) : 'N/A'}</p>
      </div>
      ${data.admin_notes ? `<div class="section" style="background: #fff3cd;"><h3>Admin Notes</h3><p>${data.admin_notes}</p></div>` : ''}
      <div style="text-align: center;"><a href="https://bridgenyre.com/portal/my-commission-requests" class="cta">View Requests</a></div>
    </div><div class="footer"><p>Bridge Advisory Group</p></div></body></html>
  `;

  const subject = {
    approved: `✅ Commission Approved - ${data.property_address}`,
    paid: `💰 Commission Paid - ${data.property_address}`,
    rejected: `⚠️ Commission Needs Revision - ${data.property_address}`,
    under_review: `📋 Under Review - ${data.property_address}`,
    pending: `📩 Request Received - ${data.property_address}`,
  }[status] || `Commission Update - ${data.property_address}`;

  return { html, subject };
};

const formatRequestCompletedEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><div class="logo">Bridge Advisory Group</div></div>
      <div style="text-align: center; margin-bottom: 30px;">
        <span class="badge badge-approved">COMPLETED</span>
        <h1 style="margin: 20px 0 10px;">Your Request is Complete!</h1>
      </div>
      <div class="section">
        <h3>Request Details</h3>
        <p><strong>Type:</strong> ${data.request_type || 'N/A'}</p>
        ${data.property_address ? `<p><strong>Property:</strong> ${data.property_address}</p>` : ''}
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
      </div>
      <div style="text-align: center;"><a href="https://bridgenyre.com/portal/requests" class="cta">View Requests</a></div>
    </div></body></html>
  `;
  return { html, subject: `✅ Request Completed: ${data.request_type}` };
};

const formatAnnouncementEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><div class="logo">Bridge Advisory Group</div></div>
      <h1 style="text-align: center;">${data.title || 'Announcement'}</h1>
      <div class="section" style="background: white; border: 1px solid #e5e7eb;">
        <div style="white-space: pre-wrap;">${data.content || ''}</div>
      </div>
      <div style="text-align: center;"><a href="https://bridgenyre.com/portal/announcements" class="cta">View All</a></div>
    </div></body></html>
  `;
  return { html, subject: `📢 ${data.title || 'Announcement'}` };
};

const formatWelcomeEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"><style>${emailStyles}</style></head>
    <body><div class="container">
      <div class="header"><div class="logo">Bridge Advisory Group</div></div>
      <h1 style="text-align: center;">Welcome to Bridge! 🎉</h1>
      <p style="text-align: center;">Hi ${data.name}, we're excited to have you on the team.</p>
      <div class="section">
        <h3>Getting Started</h3>
        <ul><li>Complete your profile</li><li>Connect Google Workspace</li><li>Explore the CRM</li></ul>
      </div>
      <div style="text-align: center;"><a href="https://bridgenyre.com/portal" class="cta">Go to Portal</a></div>
    </div></body></html>
  `;
  return { html, subject: `Welcome to Bridge, ${data.name}! 🎉` };
};

const formatInquiryEmail = (data: NotificationRequest['data']): { html: string; subject: string } => {
  const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>New Inquiry from ${data.name}</h2>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.inquiry_type ? `<p><strong>Division:</strong> ${data.inquiry_type}</p>` : ''}
        ${data.user_type ? `<p><strong>Type:</strong> ${data.user_type}</p>` : ''}
        ${data.property_address ? `<p><strong>Property:</strong> ${data.property_address}</p>` : ''}
        ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
        ${data.notes ? `<p><strong>Message:</strong> ${data.notes}</p>` : ''}
      </div>
    </body></html>
  `;
  return { html, subject: `New ${data.inquiry_type || 'General'} Inquiry from ${data.name}` };
};

serve(async (req) => {
  const correlationId = getCorrelationId(req);
  const logger = createLogger('send-notification', correlationId);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const endpoint = 'send-notification';
  const identifier = getRateLimitIdentifier(req);

  try {
    logger.requestStart(req.method, '/send-notification');

    const rateLimitResult = await checkRateLimit(identifier, endpoint);
    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { identifier, endpoint });
      return rateLimitExceededResponse(rateLimitResult, getRateLimitConfig(endpoint), correlationId);
    }

    const { type, data }: NotificationRequest = await req.json();
    
    logger.info(`Processing notification`, { type, recipientEmail: data.email });

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
        logger.info(`Unknown notification type: ${type}`);
        return new Response(
          JSON.stringify({ success: true, message: 'Type not handled' }),
          { headers: createResponseHeaders(correlationId) }
        );
    }

    if (recipients.length === 0) {
      logger.info('No recipients specified');
      return new Response(
        JSON.stringify({ success: true, message: 'No recipients' }),
        { headers: createResponseHeaders(correlationId) }
      );
    }

    logger.info(`Sending email`, { recipients, subject });

    const emailResponse = await resend.emails.send({
      from: "Bridge Advisory Group <noreply@bridgenyre.com>",
      to: recipients,
      subject: subject,
      html: html,
      reply_to: data.email || undefined,
    });

    logger.requestEnd(req.method, '/send-notification', 200, { emailId: emailResponse.data?.id });

    return new Response(
      JSON.stringify({ success: true, emailResponse, correlationId }),
      { 
        headers: { 
          ...createResponseHeaders(correlationId),
          ...rateLimitHeaders(rateLimitResult, getRateLimitConfig(endpoint)),
        } 
      }
    );
  } catch (error) {
    logger.error("Send notification error", error instanceof Error ? error : new Error(String(error)));
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: createResponseHeaders(correlationId) }
    );
  }
});
