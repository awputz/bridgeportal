import { Mail, Calendar, HardDrive, Check, X, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGmailConnection, useConnectGmail } from "@/hooks/useGmail";
import { useGoogleCalendarConnection, useConnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useDriveConnection, useConnectDrive } from "@/hooks/useGoogleDrive";
import { Link } from "react-router-dom";

interface ServiceStatus {
  name: string;
  icon: React.ElementType;
  isConnected: boolean;
  isLoading: boolean;
  color: string;
  bgColor: string;
  path: string;
  onConnect: () => void;
  isPending: boolean;
}

export function GoogleConnectionStatus() {
  const { data: gmailConnection, isLoading: isLoadingGmail } = useGmailConnection();
  const { data: calendarConnection, isLoading: isLoadingCalendar } = useGoogleCalendarConnection();
  const { data: driveConnection, isLoading: isLoadingDrive } = useDriveConnection();

  const connectGmail = useConnectGmail();
  const connectCalendar = useConnectGoogleCalendar();
  const connectDrive = useConnectDrive();

  const services: ServiceStatus[] = [
    {
      name: "Gmail",
      icon: Mail,
      isConnected: gmailConnection?.isConnected || false,
      isLoading: isLoadingGmail,
      color: "text-gmail-red",
      bgColor: "bg-gmail-red",
      path: "/portal/mail",
      onConnect: () => connectGmail.mutate(),
      isPending: connectGmail.isPending,
    },
    {
      name: "Calendar",
      icon: Calendar,
      isConnected: calendarConnection?.calendar_enabled && !!calendarConnection?.access_token,
      isLoading: isLoadingCalendar,
      color: "text-gcal-blue",
      bgColor: "bg-gcal-blue",
      path: "/portal/calendar",
      onConnect: () => connectCalendar.mutate(),
      isPending: connectCalendar.isPending,
    },
    {
      name: "Drive",
      icon: HardDrive,
      isConnected: driveConnection?.isConnected || false,
      isLoading: isLoadingDrive,
      color: "text-gdrive-folder",
      bgColor: "bg-gdrive-folder",
      path: "/portal/drive",
      onConnect: () => connectDrive.mutate(),
      isPending: connectDrive.isPending,
    },
  ];

  const connectedCount = services.filter((s) => s.isConnected).length;
  const isAnyLoading = services.some((s) => s.isLoading);

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Google Services</h3>
        {!isAnyLoading && (
          <span className="text-sm text-muted-foreground">
            {connectedCount}/{services.length} connected
          </span>
        )}
      </div>

      <div className="space-y-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.name}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-colors",
                service.isConnected ? "bg-muted/20" : "bg-muted/10"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", service.bgColor)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.isLoading ? "Checking..." : service.isConnected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {service.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : service.isConnected ? (
                  <>
                    <div className="flex items-center gap-1 text-green-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <Link to={service.path}>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        Open
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={service.onConnect}
                    disabled={service.isPending}
                    className={cn("gap-1.5", service.bgColor, "hover:opacity-90 text-white")}
                  >
                    {service.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {connectedCount < services.length && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Connect your Google services to access emails, calendar events, and files directly from the portal.
        </p>
      )}
    </div>
  );
}
