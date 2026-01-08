-- Email templates table
CREATE TABLE public.hr_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('outreach', 'interview', 'offer', 'follow-up', 'custom')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications table
CREATE TABLE public.hr_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  notification_type TEXT NOT NULL,
  related_agent_id UUID REFERENCES public.hr_agents(id) ON DELETE SET NULL,
  related_interview_id UUID REFERENCES public.hr_interviews(id) ON DELETE SET NULL,
  related_offer_id UUID REFERENCES public.hr_offers(id) ON DELETE SET NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reminders table
CREATE TABLE public.hr_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reminder_date TIMESTAMPTZ NOT NULL,
  message TEXT NOT NULL,
  related_agent_id UUID REFERENCES public.hr_agents(id) ON DELETE SET NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hr_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hr_email_templates (admins only)
CREATE POLICY "Admins can view email templates" ON public.hr_email_templates
  FOR SELECT USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert email templates" ON public.hr_email_templates
  FOR INSERT WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update email templates" ON public.hr_email_templates
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete email templates" ON public.hr_email_templates
  FOR DELETE USING (public.is_admin_user(auth.uid()));

-- RLS Policies for hr_notifications (user can see their own)
CREATE POLICY "Users can view their notifications" ON public.hr_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications" ON public.hr_notifications
  FOR INSERT WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Users can update their notifications" ON public.hr_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for hr_reminders (user can manage their own)
CREATE POLICY "Users can view their reminders" ON public.hr_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their reminders" ON public.hr_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their reminders" ON public.hr_reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their reminders" ON public.hr_reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at on templates
CREATE TRIGGER update_hr_email_templates_updated_at
  BEFORE UPDATE ON public.hr_email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email templates
INSERT INTO public.hr_email_templates (name, subject, body, template_type) VALUES
('Initial Outreach', 'Opportunity at {{company_name}} - {{division}}', 'Hi {{agent_name}},

I came across your profile and was impressed by your work at {{current_brokerage}}. We have an exciting opportunity in our {{division}} division that I think would be a great fit for your experience.

Would you be open to a brief conversation to learn more?

Best regards,
{{sender_name}}', 'outreach'),

('Interview Invitation', 'Interview Invitation - {{company_name}}', 'Hi {{agent_name}},

Thank you for your interest in joining {{company_name}}. We would like to invite you for an interview.

Date: {{interview_date}}
Time: {{interview_time}}
Location: {{interview_location}}

Please confirm your availability.

Best regards,
{{sender_name}}', 'interview'),

('Offer Letter', 'Offer Letter - {{company_name}}', 'Dear {{agent_name}},

We are pleased to extend an offer to join {{company_name}} as part of our {{division}} team.

Position: {{position}}
Commission Split: {{commission_split}}
Start Date: {{start_date}}

Please review the attached offer details and let us know your decision.

Welcome aboard!

Best regards,
{{sender_name}}', 'offer'),

('Follow-up', 'Following Up - {{company_name}}', 'Hi {{agent_name}},

I wanted to follow up on our previous conversation about opportunities at {{company_name}}.

Are you still interested in exploring this further? I would be happy to answer any questions you may have.

Best regards,
{{sender_name}}', 'follow-up');