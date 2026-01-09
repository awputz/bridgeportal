import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FileSignature, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignaturePad, SignaturePadRef } from "@/components/contracts/SignaturePad";
import { useContract, useSignContract } from "@/hooks/hr/useContracts";
import { format } from "date-fns";

export default function SignContract() {
  const { contractId } = useParams<{ contractId: string }>();
  const signaturePadRef = useRef<SignaturePadRef>(null);
  
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const { data: contract, isLoading, error } = useContract(contractId);
  const signContract = useSignContract();

  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll position to enable signing
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    if (scrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  // Auto-scroll check on load
  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      if (scrollHeight <= clientHeight) {
        setHasScrolledToBottom(true);
      }
    }
  }, [contract]);

  const handleSignatureEnd = () => {
    setHasSignature(!signaturePadRef.current?.isEmpty());
  };

  const canSubmit = hasScrolledToBottom && agreedToTerms && typedName.trim() && hasSignature;

  const handleSubmit = async () => {
    if (!canSubmit || !contract || !signaturePadRef.current) return;

    setIsSubmitting(true);

    try {
      const signatureData = signaturePadRef.current.toDataURL();
      
      await signContract.mutateAsync({
        contractId: contract.id,
        signatureData,
        signatoryName: typedName.trim(),
        signatoryEmail: contract.agent_email || '',
      });

      setIsComplete(true);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-muted-foreground">Loading contract...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !contract) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contract Not Found</h2>
            <p className="text-muted-foreground">
              This contract may have expired or been voided. Please contact HR for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already signed
  if (contract.status === 'signed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contract Already Signed</h2>
            <p className="text-muted-foreground mb-4">
              This contract was signed on {contract.signed_at && format(new Date(contract.signed_at), 'MMMM d, yyyy')}.
            </p>
            {contract.pdf_url && (
              <Button asChild>
                <a href={contract.pdf_url} download>Download Signed Contract</a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Voided
  if (contract.status === 'voided') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contract Voided</h2>
            <p className="text-muted-foreground">
              This contract has been voided and can no longer be signed. Please contact HR for a new contract.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Contract Signed!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for signing. A copy of the signed contract will be emailed to you shortly.
            </p>
            <p className="text-sm text-muted-foreground">
              You can close this window now.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <FileSignature className="h-6 w-6 text-emerald-500" />
          <div>
            <h1 className="font-semibold">Contract Signing</h1>
            <p className="text-sm text-muted-foreground">for {contract.agent_name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Contract Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {contract.contract_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={contentRef}
              onScroll={handleScroll}
              className="bg-white text-black p-6 rounded-lg max-h-[60vh] overflow-y-auto prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: contract.content_html || '' }}
            />
            
            {!hasScrolledToBottom && (
              <p className="text-sm text-amber-500 mt-4 text-center">
                ↓ Please scroll to the bottom to continue ↓
              </p>
            )}
          </CardContent>
        </Card>

        {/* Signature Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                disabled={!hasScrolledToBottom}
              />
              <label 
                htmlFor="terms" 
                className={`text-sm leading-relaxed ${!hasScrolledToBottom ? 'text-muted-foreground' : ''}`}
              >
                I have read and agree to the terms and conditions outlined in this contract. 
                I understand that this electronic signature is legally binding.
              </label>
            </div>

            {/* Signature Pad */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Signature</label>
              <SignaturePad 
                ref={signaturePadRef}
                onEnd={handleSignatureEnd}
              />
            </div>

            {/* Typed Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Type Your Full Legal Name</label>
              <Input
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Enter your full name"
                className="max-w-sm"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4 mr-2" />
                  Sign Contract
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By clicking "Sign Contract", you agree that your electronic signature is the legal equivalent of your manual signature.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
