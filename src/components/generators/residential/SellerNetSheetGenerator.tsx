import { useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GeneratorShell } from "../GeneratorShell";

interface Props {
  onBack: () => void;
}

export const SellerNetSheetGenerator = ({ onBack }: Props) => {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    salePrice: "",
    mortgageBalance: "",
    commissionRate: "",
    transferTax: "",
    attorneyFees: "",
    otherCosts: "",
    sellerName: ""
  });

  const promptBuilder = (data: Record<string, any>) => `Create a seller net sheet narrative explaining the estimated proceeds from a property sale.

Property: ${data.propertyAddress}
Expected Sale Price: $${data.salePrice}
Mortgage Balance: $${data.mortgageBalance}
Commission Rate: ${data.commissionRate}%
Transfer Tax: $${data.transferTax}
Attorney Fees: $${data.attorneyFees}
Other Costs: ${data.otherCosts}
Seller Name: ${data.sellerName}

Generate a clear, easy-to-understand narrative that:
1. Summarizes the expected sale price
2. Breaks down all costs line by line
3. Explains what each cost covers and why
4. Calculates the estimated net proceeds
5. Notes any variables that could affect final numbers
6. Provides context on typical costs in this market

Write in a reassuring, educational tone. Help the seller understand where their money goes and feel confident in the numbers.`;

  const isFormValid = !!formData.propertyAddress && !!formData.salePrice;

  return (
    <GeneratorShell
      id="seller-net-sheet"
      title="Seller Net Sheet Narrative"
      description="Create a clear explanation of seller proceeds and costs."
      icon={Calculator}
      onBack={onBack}
      promptBuilder={promptBuilder}
      formData={formData}
      isFormValid={isFormValid}
      outputTitle="Net Sheet Explanation"
      outputDescription="Your seller proceeds breakdown"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Address *</Label>
          <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} placeholder="123 Main Street" />
        </div>
        <div className="space-y-2">
          <Label>Seller Name</Label>
          <Input value={formData.sellerName} onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })} placeholder="Mr. & Mrs. Johnson" />
        </div>
        <div className="space-y-2">
          <Label>Expected Sale Price *</Label>
          <Input value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} placeholder="1,200,000" />
        </div>
        <div className="space-y-2">
          <Label>Mortgage Balance</Label>
          <Input value={formData.mortgageBalance} onChange={(e) => setFormData({ ...formData, mortgageBalance: e.target.value })} placeholder="450,000" />
        </div>
        <div className="space-y-2">
          <Label>Commission Rate (%)</Label>
          <Input value={formData.commissionRate} onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })} placeholder="5" />
        </div>
        <div className="space-y-2">
          <Label>Transfer Tax</Label>
          <Input value={formData.transferTax} onChange={(e) => setFormData({ ...formData, transferTax: e.target.value })} placeholder="24,000" />
        </div>
        <div className="space-y-2">
          <Label>Attorney Fees</Label>
          <Input value={formData.attorneyFees} onChange={(e) => setFormData({ ...formData, attorneyFees: e.target.value })} placeholder="3,000" />
        </div>
        <div className="space-y-2">
          <Label>Other Costs</Label>
          <Textarea value={formData.otherCosts} onChange={(e) => setFormData({ ...formData, otherCosts: e.target.value })} placeholder="Staging: $2,000, Repairs: $5,000..." />
        </div>
      </div>
    </GeneratorShell>
  );
};

export default SellerNetSheetGenerator;
