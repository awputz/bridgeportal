import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Linkedin,
  Instagram,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import { useAgentApplication, useUpdateApplicationStatus } from "@/hooks/useAgentApplications";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: application, isLoading } = useAgentApplication(id || "");
  const updateStatus = useUpdateApplicationStatus();
  const [adminNotes, setAdminNotes] = useState("");

  const handleApprove = async () => {
    if (!id) return;
    try {
      await updateStatus.mutateAsync({
        id,
        status: "approved",
        admin_notes: adminNotes || undefined,
      });
      toast.success("Application approved successfully");
      navigate("/hr/applications");
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await updateStatus.mutateAsync({
        id,
        status: "rejected",
        admin_notes: adminNotes || undefined,
      });
      toast.success("Application rejected");
      navigate("/hr/applications");
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <p>Application not found</p>
        <Button variant="link" onClick={() => navigate("/hr/applications")}>
          Back to Applications
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/hr/applications")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-extralight tracking-tight">
            Application Details
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Submitted {format(new Date(application.created_at), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        {getStatusBadge(application.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Profile */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-light">Applicant Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                {application.headshot_url ? (
                  <img
                    src={application.headshot_url}
                    alt={application.full_name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <User className="h-12 w-12 text-emerald-400" />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-light">{application.full_name}</h2>
                    <p className="text-muted-foreground">{application.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {application.divisions.map((div) => (
                      <Badge key={div} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {div}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {application.bio && (
                <div className="pt-4 border-t border-white/10">
                  <Label className="text-sm text-muted-foreground mb-2 block">Bio</Label>
                  <p className="text-sm whitespace-pre-wrap">{application.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-light">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm">{application.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="text-sm">{application.phone}</p>
                </div>
              </div>

              {application.mailing_address && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Mailing Address</Label>
                    <p className="text-sm">{application.mailing_address}</p>
                  </div>
                </div>
              )}

              {application.date_of_birth && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                    <p className="text-sm">
                      {format(new Date(application.date_of_birth), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}

              {application.license_number && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">License Number</Label>
                    <p className="text-sm">{application.license_number}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          {(application.linkedin_url || application.instagram_url) && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-light">Social Profiles</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                {application.linkedin_url && (
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {application.instagram_url && (
                  <a
                    href={application.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* ID Photo */}
          {application.id_photo_url && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-light">ID Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={application.id_photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={application.id_photo_url}
                    alt="ID Photo"
                    className="max-w-full max-h-64 rounded-lg object-contain"
                  />
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Checklist */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-light">Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {application.cultural_values_acknowledged ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm">Cultural Values Acknowledged</span>
              </div>
              <div className="flex items-center gap-3">
                {application.contract_signed ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm">Contract Signed</span>
              </div>
              <div className="flex items-center gap-3">
                {application.w9_submitted ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm">W9 Submitted</span>
              </div>
            </CardContent>
          </Card>

          {/* Review History */}
          {application.reviewed_at && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-light">Review History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Reviewed on {format(new Date(application.reviewed_at), "MMM d, yyyy")}
                </p>
                {application.admin_notes && (
                  <div className="pt-2 border-t border-white/10">
                    <Label className="text-xs text-muted-foreground">Admin Notes</Label>
                    <p className="text-sm mt-1">{application.admin_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {application.status === "pending" && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-light">Take Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="admin-notes" className="text-sm text-muted-foreground">
                    Admin Notes (Optional)
                  </Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Add notes about this application..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={updateStatus.isPending}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {updateStatus.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={updateStatus.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    {updateStatus.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
