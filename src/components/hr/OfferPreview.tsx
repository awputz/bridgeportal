import { format } from "date-fns";
import { HROfferWithAgent } from "@/hooks/hr/useHROffers";
import { divisionLabels } from "@/hooks/hr/useHRAgents";

interface OfferPreviewProps {
  offer: HROfferWithAgent;
}

export function OfferPreview({ offer }: OfferPreviewProps) {
  const agentName = offer.hr_agents?.full_name || 'Candidate';
  const currentBrokerage = offer.hr_agents?.current_brokerage || 'Current Firm';
  const division = offer.division ? divisionLabels[offer.division as keyof typeof divisionLabels] || offer.division : 'Real Estate';

  return (
    <div className="bg-white text-slate-900 rounded-lg p-8 space-y-6">
      {/* Letterhead */}
      <div className="text-center border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">BRIDGE</h2>
        <p className="text-sm text-slate-600">Real Estate Services</p>
      </div>

      {/* Date */}
      <div className="text-right text-sm text-slate-600">
        {format(new Date(), 'MMMM d, yyyy')}
      </div>

      {/* Recipient */}
      <div>
        <p className="font-medium">{agentName}</p>
        <p className="text-sm text-slate-600">{currentBrokerage}</p>
      </div>

      {/* Salutation */}
      <div>
        <p>Dear {agentName.split(' ')[0]},</p>
      </div>

      {/* Body */}
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          We are pleased to extend this offer of employment to join Bridge Real Estate 
          as a Licensed Real Estate Agent in our <strong>{division}</strong> division.
        </p>

        <p>
          After reviewing your qualifications and our recent conversations, we believe 
          you would be an excellent addition to our team. Below are the terms of our offer:
        </p>

        {/* Terms Table */}
        <div className="bg-slate-50 rounded-lg p-4 my-6">
          <h3 className="font-semibold text-slate-900 mb-4">Compensation Package</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2 text-slate-600">Position:</td>
                <td className="py-2 font-medium text-right">Licensed Agent - {division}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 text-slate-600">Commission Split:</td>
                <td className="py-2 font-medium text-right">{offer.commission_split || 'To be discussed'}</td>
              </tr>
              {offer.signing_bonus && (
                <tr className="border-b border-slate-200">
                  <td className="py-2 text-slate-600">Signing Bonus:</td>
                  <td className="py-2 font-medium text-right">
                    ${offer.signing_bonus.toLocaleString()}
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-2 text-slate-600">Start Date:</td>
                <td className="py-2 font-medium text-right">
                  {offer.start_date 
                    ? format(new Date(offer.start_date), 'MMMM d, yyyy')
                    : 'To be determined'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Special Terms */}
        {offer.special_terms && !offer.special_terms.startsWith('Declined reason:') && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Additional Terms</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{offer.special_terms}</p>
          </div>
        )}

        <p>
          This offer is contingent upon successful completion of our onboarding process, 
          verification of your real estate license, and execution of our standard 
          Independent Contractor Agreement.
        </p>

        <p>
          Please confirm your acceptance of this offer by signing below and returning 
          this letter within 7 business days. We are excited about the possibility 
          of you joining our team.
        </p>
      </div>

      {/* Signature Lines */}
      <div className="pt-8 space-y-12">
        <div>
          <p className="text-sm text-slate-600 mb-1">Sincerely,</p>
          <div className="h-12 border-b border-slate-300 w-48" />
          <p className="text-sm mt-1">Recruiting Team</p>
          <p className="text-sm text-slate-600">Bridge Real Estate</p>
        </div>

        <div>
          <p className="text-sm text-slate-600 mb-1">Accepted and Agreed:</p>
          <div className="h-12 border-b border-slate-300 w-48" />
          <p className="text-sm mt-1">{agentName}</p>
          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-xs text-slate-500">Date:</p>
              <div className="h-6 border-b border-slate-300 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
