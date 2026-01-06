import { format } from "date-fns";

interface Expense {
  id: string;
  expense_date: string;
  amount: number;
  category: string;
  subcategory?: string | null;
  description: string;
  payment_method?: string | null;
  is_tax_deductible?: boolean | null;
  mileage_from?: string | null;
  mileage_to?: string | null;
  mileage_distance?: number | null;
  mileage_rate?: number | null;
  notes?: string | null;
  deal_id?: string | null;
  billable_to_client?: boolean | null;
}

interface AgentInfo {
  name: string;
  email: string;
}

const IRS_MILEAGE_RATE_2025 = 0.70;
const IRS_MILEAGE_RATE_2024 = 0.67;

// IRS category mapping for tax purposes
const TAX_CATEGORIES: Record<string, string> = {
  "Marketing & Advertising": "Advertising",
  "Transportation & Mileage": "Car & Truck Expenses",
  "Client Entertainment": "Business Meals & Entertainment",
  "Professional Development": "Education & Training",
  "Technology & Software": "Office Expenses",
  "Office Supplies": "Office Expenses",
  "Professional Services": "Professional Services",
  "Licensing & Fees": "Licenses & Fees",
  "Insurance": "Insurance",
  "Other Expenses": "Other Expenses",
};

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportExpensesToCSV(expenses: Expense[], filename?: string): void {
  const headers = [
    "Date",
    "Category",
    "Subcategory",
    "Description",
    "Amount",
    "Payment Method",
    "Tax Deductible",
    "Mileage (miles)",
    "Mileage From",
    "Mileage To",
    "Notes",
  ];

  const rows = expenses.map((e) => [
    e.expense_date,
    e.category,
    e.subcategory || "",
    e.description,
    e.amount.toFixed(2),
    e.payment_method || "",
    e.is_tax_deductible ? "Yes" : "No",
    e.mileage_distance?.toString() || "",
    e.mileage_from || "",
    e.mileage_to || "",
    e.notes || "",
  ]);

  const csv = [headers.map(escapeCSV).join(","), ...rows.map((row) => row.map(escapeCSV).join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `expenses-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateTaxSummary(expenses: Expense[], year: number, agentInfo: AgentInfo): void {
  const yearExpenses = expenses.filter((e) => {
    const expenseYear = new Date(e.expense_date).getFullYear();
    return expenseYear === year;
  });

  const taxDeductible = yearExpenses.filter((e) => e.is_tax_deductible);

  // Group by IRS category
  const categoryTotals: Record<string, number> = {};
  taxDeductible.forEach((e) => {
    const irsCategory = TAX_CATEGORIES[e.category] || "Other Expenses";
    categoryTotals[irsCategory] = (categoryTotals[irsCategory] || 0) + e.amount;
  });

  // Calculate mileage separately
  const mileageExpenses = taxDeductible.filter((e) => e.mileage_distance && e.mileage_distance > 0);
  const totalMiles = mileageExpenses.reduce((sum, e) => sum + (e.mileage_distance || 0), 0);
  const mileageRate = year >= 2025 ? IRS_MILEAGE_RATE_2025 : IRS_MILEAGE_RATE_2024;
  const mileageDeduction = totalMiles * mileageRate;

  const grandTotal = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Tax Expense Summary - ${year}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      color: #1a1a1a;
    }
    .header { 
      text-align: center; 
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e5e5;
    }
    .header h1 { font-size: 24px; margin-bottom: 8px; }
    .header p { color: #666; font-size: 14px; }
    .agent-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 32px;
    }
    .agent-info p { margin: 4px 0; font-size: 14px; }
    .section { margin-bottom: 32px; }
    .section h2 { 
      font-size: 16px; 
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
      margin-bottom: 16px;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { 
      padding: 12px; 
      text-align: left; 
      border-bottom: 1px solid #e5e5e5;
    }
    th { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; }
    td { font-size: 14px; }
    .amount { text-align: right; font-family: monospace; }
    .total-row { 
      font-weight: 600; 
      background: #f5f5f5;
    }
    .total-row td { border-bottom: none; }
    .grand-total {
      background: #1a1a1a;
      color: white;
      padding: 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
    }
    .grand-total .label { font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
    .grand-total .value { font-size: 28px; font-weight: 700; font-family: monospace; }
    .mileage-note {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      margin-top: 16px;
      font-size: 13px;
      color: #1e40af;
    }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    .print-btn:hover { background: #333; }
    @media print {
      .print-btn { display: none; }
      body { padding: 20px; }
    }
    .disclaimer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 11px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  
  <div class="header">
    <h1>Business Expense Summary</h1>
    <p>Tax Year ${year}</p>
  </div>
  
  <div class="agent-info">
    <p><strong>Agent:</strong> ${agentInfo.name}</p>
    <p><strong>Email:</strong> ${agentInfo.email}</p>
    <p><strong>Generated:</strong> ${format(new Date(), "MMMM d, yyyy")}</p>
  </div>
  
  <div class="section">
    <h2>Expense Breakdown by IRS Category</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .map(
            ([cat, amount]) => `
          <tr>
            <td>${cat}</td>
            <td class="amount">$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
          </tr>
        `
          )
          .join("")}
        <tr class="total-row">
          <td>Total Tax Deductible Expenses</td>
          <td class="amount">$${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  ${
    totalMiles > 0
      ? `
  <div class="section">
    <h2>Mileage Deduction</h2>
    <table>
      <tbody>
        <tr>
          <td>Total Business Miles</td>
          <td class="amount">${totalMiles.toLocaleString()} miles</td>
        </tr>
        <tr>
          <td>IRS Standard Mileage Rate (${year})</td>
          <td class="amount">$${mileageRate.toFixed(2)} / mile</td>
        </tr>
        <tr class="total-row">
          <td>Mileage Deduction</td>
          <td class="amount">$${mileageDeduction.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>
    <div class="mileage-note">
      <strong>Note:</strong> Mileage deduction is included in the "Car & Truck Expenses" category total above.
      Keep detailed mileage logs for IRS documentation.
    </div>
  </div>
  `
      : ""
  }
  
  <div class="grand-total">
    <span class="label">Total Tax Deductible Expenses</span>
    <span class="value">$${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
  </div>
  
  <p class="disclaimer">
    This summary is provided for informational purposes only and does not constitute tax advice.
    Consult a qualified tax professional for guidance on your specific tax situation.
  </p>
</body>
</html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

export function generateMonthlyStatement(
  expenses: Expense[],
  year: number,
  month: number,
  agentInfo: AgentInfo
): void {
  const monthExpenses = expenses.filter((e) => {
    const date = new Date(e.expense_date);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const monthName = format(new Date(year, month), "MMMM yyyy");
  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  monthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Monthly Expense Statement - ${monthName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      color: #1a1a1a;
    }
    .header { 
      text-align: center; 
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e5e5;
    }
    .header h1 { font-size: 24px; margin-bottom: 8px; }
    .header p { color: #666; font-size: 14px; }
    .agent-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 32px;
    }
    .agent-info p { margin: 4px 0; font-size: 14px; }
    .section { margin-bottom: 32px; }
    .section h2 { 
      font-size: 16px; 
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
      margin-bottom: 16px;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { 
      padding: 10px; 
      text-align: left; 
      border-bottom: 1px solid #e5e5e5;
      font-size: 13px;
    }
    th { font-weight: 600; color: #666; font-size: 11px; text-transform: uppercase; }
    .amount { text-align: right; font-family: monospace; }
    .total-row { font-weight: 600; background: #f5f5f5; }
    .grand-total {
      background: #1a1a1a;
      color: white;
      padding: 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
    }
    .grand-total .label { font-size: 14px; text-transform: uppercase; }
    .grand-total .value { font-size: 28px; font-weight: 700; font-family: monospace; }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  
  <div class="header">
    <h1>Monthly Expense Statement</h1>
    <p>${monthName}</p>
  </div>
  
  <div class="agent-info">
    <p><strong>Agent:</strong> ${agentInfo.name}</p>
    <p><strong>Email:</strong> ${agentInfo.email}</p>
  </div>
  
  <div class="section">
    <h2>Category Summary</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .map(
            ([cat, amount]) => `
          <tr>
            <td>${cat}</td>
            <td class="amount">$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <h2>All Expenses</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${monthExpenses
          .sort((a, b) => new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime())
          .map(
            (e) => `
          <tr>
            <td>${format(new Date(e.expense_date), "MMM d")}</td>
            <td>${e.category}</td>
            <td>${e.description}</td>
            <td class="amount">$${e.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>
  
  <div class="grand-total">
    <span class="label">Total for ${monthName}</span>
    <span class="value">$${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
  </div>
</body>
</html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
