import { useState } from "react";
import { Mail, Calendar, FolderOpen, Users, Check, X, RefreshCw, Settings2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useGoogleServicesStatus } from "@/hooks/useGoogleServices";
import { useGmailConnection, useDisconnectGmail } from "@/hooks/useGmail";
import { useGoogleCalendarConnection, useDisconnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useDriveConnection, useDisconnectDrive } from "@/hooks/useGoogleDrive";
import { useContactsConnection, useDisconnectContacts } from "@/hooks/useGoogleContacts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ServiceCardProps {
  name: string;
  description: string;
  icon: React.ElementType;
  isConnected: boolean;
  isLoading: boolean;
  onDisconnect: () => void;
  isDisconnecting: boolean;
}

function ServiceCard({ 
  name, 
  description, 
  icon: Icon, 
  isConnected, 
  isLoading,
  onDisconnect,
  isDisconnecting
}: ServiceCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3 rounded-lg",
          isConnected ? "bg-green-500/10" : "bg-muted"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            isConnected ? "text-green-500" : "text-muted-foreground"
          )} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            {isLoading ? (
              <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
            ) : isConnected ? (
              <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                <X className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {isConnected && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onDisconnect}
          disabled={isDisconnecting}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          {isDisconnecting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            "Disconnect"
          )}
        </Button>
      )}
    </div>
  );
}

export default function GoogleServicesSettings() {
  const { data: servicesStatus, isLoading: isLoadingStatus } = useGoogleServicesStatus();
  
  // Individual service connections
  const { data: gmailData, isLoading: isLoadingGmail } = useGmailConnection();
  const { data: calendarData, isLoading: isLoadingCalendar } = useGoogleCalendarConnection();
  const { data: driveData, isLoading: isLoadingDrive } = useDriveConnection();
  const { data: contactsData, isLoading: isLoadingContacts } = useContactsConnection();
  
  // Disconnect mutations
  const disconnectGmail = useDisconnectGmail();
  const disconnectCalendar = useDisconnectGoogleCalendar();
  const disconnectDrive = useDisconnectDrive();
  const disconnectContacts = useDisconnectContacts();

  const allConnected = servicesStatus?.connected && 
    servicesStatus.services.gmail && 
    servicesStatus.services.calendar && 
    servicesStatus.services.drive && 
    servicesStatus.services.contacts;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light tracking-tight">Google Services</h1>
        <p className="text-muted-foreground mt-1">
          Manage your Google integrations and connection status
        </p>
      </div>

      {/* Overall Status */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                allConnected ? "bg-green-500/10" : "bg-amber-500/10"
              )}>
                <Settings2 className={cn(
                  "h-5 w-5",
                  allConnected ? "text-green-500" : "text-amber-500"
                )} />
              </div>
              <div>
                <CardTitle className="text-lg font-medium">Connection Status</CardTitle>
                <CardDescription>
                  {servicesStatus?.email || "Not connected to Google"}
                </CardDescription>
              </div>
            </div>
            {allConnected ? (
              <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                All Services Connected
              </Badge>
            ) : servicesStatus?.connected ? (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">
                Partially Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Not Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            When you sign in with Google, all services are automatically connected. 
            You can manage individual services below.
          </p>
        </CardContent>
      </Card>

      {/* Individual Services */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Services</h2>
        
        <div className="space-y-3">
          <ServiceCard
            name="Gmail"
            description="Send and receive emails directly from the portal"
            icon={Mail}
            isConnected={gmailData?.isConnected ?? false}
            isLoading={isLoadingGmail}
            onDisconnect={() => disconnectGmail.mutate()}
            isDisconnecting={disconnectGmail.isPending}
          />
          
          <ServiceCard
            name="Google Calendar"
            description="View and manage your calendar events"
            icon={Calendar}
            isConnected={!!calendarData?.calendar_enabled && !!calendarData?.access_token}
            isLoading={isLoadingCalendar}
            onDisconnect={() => disconnectCalendar.mutate()}
            isDisconnecting={disconnectCalendar.isPending}
          />
          
          <ServiceCard
            name="Google Drive"
            description="Access and manage your files and documents"
            icon={FolderOpen}
            isConnected={driveData?.isConnected ?? false}
            isLoading={isLoadingDrive}
            onDisconnect={() => disconnectDrive.mutate()}
            isDisconnecting={disconnectDrive.isPending}
          />
          
          <ServiceCard
            name="Google Contacts"
            description="Sync contacts to your CRM automatically"
            icon={Users}
            isConnected={contactsData?.connected ?? false}
            isLoading={isLoadingContacts}
            onDisconnect={() => disconnectContacts.mutate()}
            isDisconnecting={disconnectContacts.isPending}
          />
        </div>
      </div>

      {/* Info Section */}
      <Card className="border-border bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-primary/10 h-fit">
              <Settings2 className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm">About Google Integration</h3>
              <p className="text-sm text-muted-foreground">
                When you sign in with your Google account, all services are automatically 
                enabled using a single OAuth token. This means you don't need to connect 
                each service separately. If you disconnect a service, you may need to 
                sign out and sign back in to reconnect it.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
