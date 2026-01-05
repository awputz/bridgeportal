import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OMInvestmentThesis } from "@/types/om-generator";

interface OMThesisSectionProps {
  data: OMInvestmentThesis;
  onChange: (data: OMInvestmentThesis) => void;
}

export const OMThesisSection = ({ data, onChange }: OMThesisSectionProps) => {
  const update = (field: keyof OMInvestmentThesis, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="whyBuyNow">Why Buy Now?</Label>
        <Textarea
          id="whyBuyNow"
          value={data.whyBuyNow}
          onChange={(e) => update("whyBuyNow", e.target.value)}
          placeholder="Explain the timing: market cycle position, seller motivation, upcoming catalysts, rate environment..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Target Buyer Profile</Label>
        <Select value={data.targetBuyer} onValueChange={(v) => update("targetBuyer", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select target buyer type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value-add">Value-Add Investor</SelectItem>
            <SelectItem value="core">Core Investor</SelectItem>
            <SelectItem value="core-plus">Core-Plus Investor</SelectItem>
            <SelectItem value="opportunistic">Opportunistic Investor</SelectItem>
            <SelectItem value="1031">1031 Exchange Buyer</SelectItem>
            <SelectItem value="owner-user">Owner-User</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="family-office">Family Office</SelectItem>
            <SelectItem value="institutional">Institutional Buyer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="financingNotes">Financing Notes</Label>
        <Textarea
          id="financingNotes"
          value={data.financingNotes}
          onChange={(e) => update("financingNotes", e.target.value)}
          placeholder="Assumable debt, agency financing available, seller financing options..."
          rows={2}
        />
      </div>
    </div>
  );
};
