import type { SocialPostFormData } from "@/components/marketing/forms/SocialPostForm";
import type { FlyerFormData } from "@/components/marketing/forms/FlyerForm";
import type { EmailFormData } from "@/components/marketing/forms/EmailForm";
import type { PresentationFormData } from "@/components/marketing/forms/PresentationForm";

// Platform-specific character limits and style guides
const platformGuides = {
  instagram: {
    maxLength: 2200,
    style: "engaging, emoji-friendly, with strategic line breaks for readability",
    hashtagCount: "8-15 relevant hashtags",
  },
  facebook: {
    maxLength: 500,
    style: "conversational and community-focused",
    hashtagCount: "2-5 hashtags",
  },
  linkedin: {
    maxLength: 700,
    style: "professional and value-driven",
    hashtagCount: "3-5 industry hashtags",
  },
  twitter: {
    maxLength: 280,
    style: "concise and punchy with urgency",
    hashtagCount: "1-2 hashtags",
  },
};

export const buildSocialPostPrompt = (data: SocialPostFormData): string => {
  const platform = data.platform as keyof typeof platformGuides;
  const guide = platformGuides[platform] || platformGuides.instagram;

  return `Create a compelling ${data.platform} post for a real estate listing.

PROPERTY DETAILS:
- Address: ${data.address}
- Price: ${data.price}
- Bedrooms: ${data.bedrooms || "Not specified"}
- Bathrooms: ${data.bathrooms || "Not specified"}
- Key Features: ${data.highlights || "Not specified"}

PLATFORM REQUIREMENTS:
- Style: ${guide.style}
- Max length: ${guide.maxLength} characters
- Include ${guide.hashtagCount}
${data.hashtags ? `- Include these custom hashtags: ${data.hashtags}` : ""}

Create an attention-grabbing post that:
1. Opens with a hook that stops scrollers
2. Highlights the most compelling features
3. Creates urgency or exclusivity
4. Ends with a clear call-to-action
5. Includes appropriate emojis for ${data.platform}

Write ONLY the post content, ready to copy and paste.`;
};

export const buildFlyerPrompt = (data: FlyerFormData): string => {
  const flyerTypeLabels: Record<string, string> = {
    "just-listed": "Just Listed",
    "open-house": "Open House",
    "price-reduced": "Price Reduced",
    "just-sold": "Just Sold",
  };

  const flyerLabel = flyerTypeLabels[data.flyerType] || data.flyerType;

  return `Create compelling copy for a "${flyerLabel}" real estate flyer.

PROPERTY DETAILS:
- Address: ${data.address}
- Price: ${data.price}
- Bedrooms: ${data.bedrooms || "Not specified"}
- Bathrooms: ${data.bathrooms || "Not specified"}
- Square Feet: ${data.squareFeet || "Not specified"}
- Key Features: ${data.features || "Not specified"}

${data.flyerType === "open-house" ? `
OPEN HOUSE DETAILS:
- Date: ${data.openHouseDate || "TBD"}
- Time: ${data.openHouseTime || "TBD"}
` : ""}

AGENT INFORMATION:
- Name: ${data.agentName || "Not specified"}
- Phone: ${data.agentPhone || "Not specified"}
- Email: ${data.agentEmail || "Not specified"}

Generate the following sections for the flyer:
1. HEADLINE: A bold, attention-grabbing headline (max 8 words)
2. SUBHEADLINE: Supporting text that adds urgency or value (max 15 words)
3. PROPERTY DESCRIPTION: 2-3 sentences highlighting the best features
4. KEY FEATURES: 4-6 bullet points of standout features
5. CALL TO ACTION: Compelling reason to contact the agent

Format the output clearly with section labels.`;
};

export const buildEmailPrompt = (data: EmailFormData): string => {
  const emailTypeLabels: Record<string, string> = {
    "just-listed": "new listing announcement",
    "open-house": "open house invitation",
    "price-reduced": "price reduction alert",
    "market-update": "market update newsletter",
    "follow-up": "client follow-up",
    "newsletter": "monthly newsletter",
  };

  const recipientLabels: Record<string, string> = {
    buyers: "potential home buyers",
    sellers: "potential home sellers",
    investors: "real estate investors",
    "past-clients": "past clients and referrals",
    brokers: "fellow real estate professionals",
  };

  const ctaLabels: Record<string, string> = {
    "schedule-showing": "schedule a private showing",
    "contact-agent": "reach out for more information",
    "view-listing": "view the full listing online",
    "request-info": "request additional details",
    "attend-open-house": "RSVP for the open house",
  };

  return `Write a professional real estate email for a ${emailTypeLabels[data.emailType] || data.emailType}.

TARGET AUDIENCE: ${recipientLabels[data.recipientType] || data.recipientType}
${data.subject ? `SUBJECT LINE TO USE: ${data.subject}` : "GENERATE A COMPELLING SUBJECT LINE"}

CONTENT TO INCLUDE:
- Property Address: ${data.propertyAddress || "Not specified"}
- Key Points: ${data.keyPoints || "Not specified"}
- Primary CTA: Encourage readers to ${ctaLabels[data.callToAction] || data.callToAction}
- Sender Name: ${data.senderName || "Not specified"}

EMAIL REQUIREMENTS:
1. Subject line (if not provided): Compelling, under 50 characters, creates curiosity
2. Opening: Personal greeting and immediate value hook
3. Body: 2-3 short paragraphs with key information
4. Call to Action: Clear, specific next step
5. Signature: Professional sign-off with contact info placeholder

TONE: Professional yet personable, appropriate for ${recipientLabels[data.recipientType] || "the audience"}

Format output as:
SUBJECT: [subject line]
---
[Email body]`;
};

export const buildPresentationPrompt = (data: PresentationFormData): string => {
  const presentationTypeLabels: Record<string, string> = {
    listing: "Listing Presentation",
    buyer: "Buyer Consultation",
    investor: "Investor Pitch",
    "market-report": "Market Analysis Report",
  };

  return `Create a structured outline for a ${presentationTypeLabels[data.presentationType] || data.presentationType}.

CLIENT: ${data.clientName || "Prospective Client"}
PROPERTY: ${data.propertyAddress || "To be determined"}
PRICE POINT: ${data.askingPrice || "To be discussed"}

MARKET CONTEXT:
${data.marketAnalysis || "General market conditions apply"}

COMPETITIVE ADVANTAGES:
${data.competitiveAdvantages || "Standard professional services"}

AGENT EXPERIENCE:
${data.agentExperience || "Experienced real estate professional"}

TIMELINE:
${data.timeline || "Standard transaction timeline"}

Create a presentation outline with the following sections:

1. OPENING SLIDE: Hook and introduction
2. ABOUT [AGENT]: Credentials and track record
3. MARKET ANALYSIS: Current conditions and trends
4. PROPERTY STRATEGY: ${data.presentationType === "listing" ? "Pricing and marketing plan" : "Search criteria and approach"}
5. VALUE PROPOSITION: Why choose this agent
6. PROCESS OVERVIEW: Step-by-step timeline
7. CASE STUDIES: 2-3 relevant success stories (suggest topics)
8. NEXT STEPS: Clear action items
9. Q&A: Anticipated questions with suggested responses

For each section, provide:
- Slide title
- Key talking points (3-5 bullets)
- Suggested visuals or data to include`;
};

// Master function to get the right prompt based on project type
export const getPromptForProjectType = (type: string, formData: Record<string, unknown>): string => {
  switch (type) {
    case "social-post":
      return buildSocialPostPrompt(formData as unknown as SocialPostFormData);
    case "flyer":
      return buildFlyerPrompt(formData as unknown as FlyerFormData);
    case "email":
      return buildEmailPrompt(formData as unknown as EmailFormData);
    case "presentation":
      return buildPresentationPrompt(formData as unknown as PresentationFormData);
    default:
      return `Generate professional real estate marketing content based on the following information:\n\n${JSON.stringify(formData, null, 2)}`;
  }
};

// System prompt for all marketing content generation
export const MARKETING_SYSTEM_PROMPT = `You are an expert real estate marketing copywriter with 15+ years of experience creating high-converting content for luxury and residential properties. 

Your writing style is:
- Compelling and action-oriented
- Professional yet approachable
- Focused on benefits, not just features
- Optimized for the specific platform or format
- Authentic and avoids clichés like "stunning" or "must-see"

You understand real estate terminology, buyer psychology, and what makes properties sell. You create content that stands out in crowded markets and drives real engagement and leads.

Always provide ready-to-use content that requires minimal editing.`;
