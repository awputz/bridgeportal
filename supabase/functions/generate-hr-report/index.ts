import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportRequest {
  reportType: "executive-summary" | "agent-roster" | "production-report" | "compliance-audit";
  division?: string;
  dateRange?: "ytd" | "last-12" | "all";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("is_hr_admin", { _user_id: user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden - HR Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { reportType, division, dateRange } = await req.json() as ReportRequest;

    let reportData: any = {};
    const generatedAt = new Date().toISOString();

    switch (reportType) {
      case "executive-summary":
        // Fetch summary data
        const { data: activeAgents } = await supabase
          .from("active_agents")
          .select("*")
          .eq("status", "active");

        const { data: production } = await supabase
          .from("hr_production_summary")
          .select("*");

        const { data: hrAgents } = await supabase
          .from("hr_agents")
          .select("*");

        reportData = {
          title: "HR Executive Summary",
          generatedAt,
          metrics: {
            totalHeadcount: activeAgents?.length || 0,
            totalVolume: production?.reduce((a, p) => a + (p.total_volume || 0), 0) || 0,
            totalCommission: production?.reduce((a, p) => a + (p.total_commission || 0), 0) || 0,
            totalDeals: production?.reduce((a, p) => a + (p.total_deals || 0), 0) || 0,
            pipelineCandidates: hrAgents?.filter(a => 
              ["contacted", "warm", "qualified", "hot"].includes(a.recruitment_status)
            ).length || 0,
          },
          divisionBreakdown: activeAgents?.reduce((acc, agent) => {
            acc[agent.division] = (acc[agent.division] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {},
        };
        break;

      case "agent-roster":
        let rosterQuery = supabase
          .from("active_agents")
          .select("*")
          .order("full_name");

        if (division && division !== "all") {
          rosterQuery = rosterQuery.eq("division", division);
        }

        const { data: roster } = await rosterQuery;

        reportData = {
          title: "Agent Roster",
          generatedAt,
          division: division || "All Divisions",
          totalAgents: roster?.length || 0,
          agents: roster?.map(a => ({
            name: a.full_name,
            email: a.email,
            phone: a.phone,
            division: a.division,
            status: a.status,
            hireDate: a.hire_date,
            employeeId: a.employee_id,
          })) || [],
        };
        break;

      case "production-report":
        let prodQuery = supabase
          .from("hr_production_summary")
          .select("*")
          .order("total_volume", { ascending: false });

        if (division && division !== "all") {
          prodQuery = prodQuery.eq("division", division);
        }

        const { data: prodData } = await prodQuery;

        reportData = {
          title: "Production Performance Report",
          generatedAt,
          division: division || "All Divisions",
          summary: {
            totalAgents: prodData?.length || 0,
            totalVolume: prodData?.reduce((a, p) => a + (p.total_volume || 0), 0) || 0,
            totalCommission: prodData?.reduce((a, p) => a + (p.total_commission || 0), 0) || 0,
            totalDeals: prodData?.reduce((a, p) => a + (p.total_deals || 0), 0) || 0,
          },
          agents: prodData?.map(p => ({
            name: p.full_name,
            division: p.division,
            hireDate: p.hire_date,
            totalDeals: p.total_deals,
            totalVolume: p.total_volume,
            totalCommission: p.total_commission,
            dealsSinceHire: p.deals_since_hire,
            lastDealDate: p.last_deal_date,
          })) || [],
        };
        break;

      case "compliance-audit":
        const { data: compliance } = await supabase
          .from("agent_compliance")
          .select(`
            *,
            active_agents (
              full_name,
              email,
              division
            )
          `)
          .order("expiry_date");

        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        reportData = {
          title: "Compliance Audit Report",
          generatedAt,
          summary: {
            totalLicenses: compliance?.length || 0,
            expiringSoon: compliance?.filter(c => {
              const expiry = new Date(c.expiry_date);
              return expiry <= thirtyDaysFromNow && expiry >= now;
            }).length || 0,
            expired: compliance?.filter(c => new Date(c.expiry_date) < now).length || 0,
            valid: compliance?.filter(c => new Date(c.expiry_date) > thirtyDaysFromNow).length || 0,
          },
          licenses: compliance?.map(c => ({
            agentName: c.active_agents?.full_name,
            agentEmail: c.active_agents?.email,
            division: c.active_agents?.division,
            licenseType: c.license_type,
            licenseNumber: c.license_number,
            state: c.license_state,
            expiryDate: c.expiry_date,
            status: c.status,
          })) || [],
        };
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid report type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Generate HTML report
    const html = generateHTMLReport(reportData, reportType);

    return new Response(JSON.stringify({ 
      success: true, 
      reportType,
      data: reportData,
      html,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    const error = err as Error;
    console.error("Report generation error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to generate report",
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateHTMLReport(data: any, reportType: string): string {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const styles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 900px; margin: 0 auto; padding: 40px 20px; }
      h1 { font-size: 28px; font-weight: 300; margin-bottom: 8px; }
      h2 { font-size: 18px; font-weight: 500; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
      .meta { color: #666; font-size: 14px; margin-bottom: 32px; }
      .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin: 24px 0; }
      .metric-card { background: #f9f9f9; padding: 16px; border-radius: 8px; }
      .metric-value { font-size: 28px; font-weight: 600; color: #10b981; }
      .metric-label { font-size: 12px; color: #666; margin-top: 4px; }
      table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
      th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
      th { background: #f5f5f5; font-weight: 500; }
      tr:hover { background: #fafafa; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; }
      .badge-success { background: #d1fae5; color: #065f46; }
      .badge-warning { background: #fef3c7; color: #92400e; }
      .badge-danger { background: #fee2e2; color: #991b1b; }
    </style>
  `;

  let content = "";

  switch (reportType) {
    case "executive-summary":
      content = `
        <h1>${data.title}</h1>
        <p class="meta">Generated: ${formatDate(data.generatedAt)}</p>
        
        <h2>Key Metrics</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${data.metrics.totalHeadcount}</div>
            <div class="metric-label">Total Headcount</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${formatCurrency(data.metrics.totalVolume)}</div>
            <div class="metric-label">Total Volume</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${formatCurrency(data.metrics.totalCommission)}</div>
            <div class="metric-label">Total Commission</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.metrics.totalDeals}</div>
            <div class="metric-label">Deals Closed</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.metrics.pipelineCandidates}</div>
            <div class="metric-label">Pipeline Candidates</div>
          </div>
        </div>
        
        <h2>Division Breakdown</h2>
        <table>
          <tr><th>Division</th><th>Count</th></tr>
          ${Object.entries(data.divisionBreakdown).map(([div, count]) => 
            `<tr><td>${formatDivisionLabel(div)}</td><td>${count}</td></tr>`
          ).join("")}
        </table>
      `;
      break;

    case "agent-roster":
      content = `
        <h1>${data.title}</h1>
        <p class="meta">Generated: ${formatDate(data.generatedAt)} | Division: ${data.division} | Total: ${data.totalAgents} agents</p>
        
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Division</th>
            <th>Status</th>
            <th>Hire Date</th>
          </tr>
          ${data.agents.map((a: any) => `
            <tr>
              <td>${a.name}</td>
              <td>${a.email}</td>
              <td>${formatDivisionLabel(a.division)}</td>
              <td><span class="badge badge-success">${a.status}</span></td>
              <td>${formatDate(a.hireDate)}</td>
            </tr>
          `).join("")}
        </table>
      `;
      break;

    case "production-report":
      content = `
        <h1>${data.title}</h1>
        <p class="meta">Generated: ${formatDate(data.generatedAt)} | Division: ${data.division}</p>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${data.summary.totalAgents}</div>
            <div class="metric-label">Agents</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${formatCurrency(data.summary.totalVolume)}</div>
            <div class="metric-label">Total Volume</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${formatCurrency(data.summary.totalCommission)}</div>
            <div class="metric-label">Total Commission</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.summary.totalDeals}</div>
            <div class="metric-label">Total Deals</div>
          </div>
        </div>
        
        <h2>Agent Production</h2>
        <table>
          <tr>
            <th>Agent</th>
            <th>Division</th>
            <th>Deals</th>
            <th>Volume</th>
            <th>Commission</th>
            <th>Last Deal</th>
          </tr>
          ${data.agents.map((a: any) => `
            <tr>
              <td>${a.name}</td>
              <td>${formatDivisionLabel(a.division)}</td>
              <td>${a.totalDeals || 0}</td>
              <td>${formatCurrency(a.totalVolume || 0)}</td>
              <td>${formatCurrency(a.totalCommission || 0)}</td>
              <td>${formatDate(a.lastDealDate)}</td>
            </tr>
          `).join("")}
        </table>
      `;
      break;

    case "compliance-audit":
      content = `
        <h1>${data.title}</h1>
        <p class="meta">Generated: ${formatDate(data.generatedAt)}</p>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${data.summary.totalLicenses}</div>
            <div class="metric-label">Total Licenses</div>
          </div>
          <div class="metric-card">
            <div class="metric-value" style="color: #10b981;">${data.summary.valid}</div>
            <div class="metric-label">Valid</div>
          </div>
          <div class="metric-card">
            <div class="metric-value" style="color: #f59e0b;">${data.summary.expiringSoon}</div>
            <div class="metric-label">Expiring Soon</div>
          </div>
          <div class="metric-card">
            <div class="metric-value" style="color: #ef4444;">${data.summary.expired}</div>
            <div class="metric-label">Expired</div>
          </div>
        </div>
        
        <h2>License Details</h2>
        <table>
          <tr>
            <th>Agent</th>
            <th>License Type</th>
            <th>Number</th>
            <th>State</th>
            <th>Expiry</th>
            <th>Status</th>
          </tr>
          ${data.licenses.map((l: any) => `
            <tr>
              <td>${l.agentName || "N/A"}</td>
              <td>${l.licenseType}</td>
              <td>${l.licenseNumber}</td>
              <td>${l.state}</td>
              <td>${formatDate(l.expiryDate)}</td>
              <td><span class="badge ${getStatusBadge(l.status)}">${l.status}</span></td>
            </tr>
          `).join("")}
        </table>
      `;
      break;
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data.title}</title>${styles}</head><body>${content}</body></html>`;
}

function formatDivisionLabel(division: string): string {
  const labels: Record<string, string> = {
    "investment-sales": "Investment Sales",
    "commercial-leasing": "Commercial Leasing",
    "residential": "Residential",
    "capital-advisory": "Capital Advisory",
  };
  return labels[division] || division;
}

function getStatusBadge(status: string): string {
  switch (status?.toLowerCase()) {
    case "valid":
    case "active":
      return "badge-success";
    case "expiring_soon":
    case "warning":
      return "badge-warning";
    case "expired":
    case "invalid":
      return "badge-danger";
    default:
      return "";
  }
}
