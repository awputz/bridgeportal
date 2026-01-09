-- Create hr_contract_templates table
CREATE TABLE hr_contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  version TEXT NOT NULL,
  content_html TEXT NOT NULL,
  description TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Only one default per contract type
CREATE UNIQUE INDEX idx_hr_contract_templates_default 
  ON hr_contract_templates(contract_type) 
  WHERE is_default = true;

-- RLS Policies for templates
ALTER TABLE hr_contract_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR admins can manage templates"
  ON hr_contract_templates FOR ALL
  USING (public.is_hr_admin(auth.uid()))
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "Anyone can view active templates"
  ON hr_contract_templates FOR SELECT
  USING (is_active = true);

-- Create hr_contracts table
CREATE TABLE hr_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES hr_agents(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES hr_offers(id) ON DELETE SET NULL,
  contract_type TEXT NOT NULL DEFAULT 'independent_contractor',
  template_id UUID REFERENCES hr_contract_templates(id) ON DELETE SET NULL,
  template_version TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  agent_email TEXT NOT NULL,
  division TEXT NOT NULL,
  commission_split TEXT NOT NULL,
  start_date DATE NOT NULL,
  signing_bonus DECIMAL(10,2),
  special_terms TEXT,
  content_html TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  signature_data TEXT,
  signature_ip TEXT,
  signature_user_agent TEXT,
  signature_date TIMESTAMPTZ,
  signatory_name TEXT,
  signatory_email TEXT,
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  voided_at TIMESTAMPTZ,
  voided_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_hr_contracts_agent_id ON hr_contracts(agent_id);
CREATE INDEX idx_hr_contracts_status ON hr_contracts(status);
CREATE INDEX idx_hr_contracts_created_at ON hr_contracts(created_at DESC);

-- RLS Policies for contracts
ALTER TABLE hr_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR admins can manage contracts"
  ON hr_contracts FOR ALL
  USING (public.is_hr_admin(auth.uid()))
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "Anyone can view contract for signing"
  ON hr_contracts FOR SELECT
  USING (status IN ('sent', 'pending_signature'));

-- Add audit triggers
CREATE TRIGGER audit_hr_contracts
  AFTER INSERT OR UPDATE OR DELETE ON hr_contracts
  FOR EACH ROW EXECUTE FUNCTION log_hr_changes();

CREATE TRIGGER audit_hr_contract_templates
  AFTER INSERT OR UPDATE OR DELETE ON hr_contract_templates
  FOR EACH ROW EXECUTE FUNCTION log_hr_changes();

-- Seed default Independent Contractor Agreement template
INSERT INTO hr_contract_templates (name, contract_type, version, content_html, description, variables, is_active, is_default)
VALUES (
  'Independent Contractor Agreement',
  'independent_contractor',
  '1.0',
  '<div class="contract">
<h1 style="text-align: center; margin-bottom: 2rem;">INDEPENDENT CONTRACTOR AGREEMENT</h1>

<p>This Independent Contractor Agreement ("Agreement") is entered into as of <strong>{{effective_date}}</strong> by and between:</p>

<p><strong>BRIDGE CAREERS</strong> ("Company")<br/>
and<br/>
<strong>{{agent_name}}</strong> ("Contractor")<br/>
Email: {{agent_email}}</p>

<h2>1. ENGAGEMENT</h2>
<p>The Company hereby engages the Contractor as an independent real estate agent in the <strong>{{division}}</strong> division, and the Contractor accepts such engagement, subject to the terms and conditions set forth herein.</p>

<h2>2. TERM</h2>
<p>This Agreement shall commence on <strong>{{start_date}}</strong> and shall continue until terminated by either party in accordance with the provisions herein.</p>

<h2>3. COMPENSATION</h2>
<p>The Contractor shall receive compensation based on the following commission structure:</p>
<ul>
<li><strong>Commission Split:</strong> {{commission_split}}</li>
{{#if signing_bonus}}<li><strong>Signing Bonus:</strong> ${{signing_bonus}} (payable upon execution of this Agreement)</li>{{/if}}
</ul>

<h2>4. INDEPENDENT CONTRACTOR STATUS</h2>
<p>The Contractor is an independent contractor and not an employee of the Company. The Contractor shall be solely responsible for all taxes, including self-employment taxes, arising from payments made under this Agreement.</p>

<h2>5. DUTIES AND RESPONSIBILITIES</h2>
<p>The Contractor agrees to:</p>
<ul>
<li>Maintain all required real estate licenses in good standing</li>
<li>Comply with all applicable laws, regulations, and industry standards</li>
<li>Represent the Company professionally in all client interactions</li>
<li>Maintain confidentiality of proprietary information</li>
</ul>

{{#if special_terms}}
<h2>6. SPECIAL TERMS</h2>
<p>{{special_terms}}</p>
{{/if}}

<h2>7. TERMINATION</h2>
<p>Either party may terminate this Agreement with 30 days written notice. Upon termination, the Contractor shall be entitled to commissions on transactions that were pending prior to termination.</p>

<h2>8. GOVERNING LAW</h2>
<p>This Agreement shall be governed by and construed in accordance with the laws of the State of New York.</p>

<div style="margin-top: 3rem;">
<p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the date first written above.</p>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
<div>
<p><strong>BRIDGE CAREERS</strong></p>
<p>_________________________</p>
<p>Authorized Representative</p>
<p>Date: {{effective_date}}</p>
</div>
<div>
<p><strong>CONTRACTOR</strong></p>
<p>_________________________</p>
<p>{{agent_name}}</p>
<p>Date: _______________</p>
</div>
</div>
</div>
</div>',
  'Standard independent contractor agreement for real estate agents joining Bridge Careers',
  '["agent_name", "agent_email", "division", "commission_split", "start_date", "signing_bonus", "special_terms", "effective_date"]'::jsonb,
  true,
  true
);