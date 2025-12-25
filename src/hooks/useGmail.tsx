import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  labelIds: string[];
  isUnread: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  subject: string;
  from: { name: string; email: string };
  to: string;
  cc?: string;
  bcc?: string;
  date: string;
  internalDate?: string;
  bodyHtml?: string;
  bodyText?: string;
  attachments?: Array<{
    id: string;
    filename: string;
    mimeType: string;
    size: number;
  }>;
}

export interface GmailLabel {
  id: string;
  name: string;
  type: string;
  messagesTotal: number;
  messagesUnread: number;
  threadsTotal: number;
  threadsUnread: number;
}

// Check Gmail connection status
export function useGmailConnection() {
  return useQuery({
    queryKey: ["gmail-connection"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isConnected: false, email: null };

      const { data, error } = await supabase
        .from("user_google_tokens")
        .select("gmail_enabled, gmail_access_token, google_email")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking Gmail connection:", error);
        return { isConnected: false, email: null };
      }

      if (!data) {
        return { isConnected: false, email: null };
      }

      return {
        isConnected: data.gmail_enabled && !!data.gmail_access_token,
        email: data.google_email,
      };
    },
    staleTime: 30000,
  });
}

// Connect to Gmail using popup flow
export function useConnectGmail() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("gmail-auth", {
        body: { action: "get-auth-url" },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      const authUrl = response.data.url;
      
      // Open popup for OAuth
      const popup = window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Poll for popup close and refetch connection
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            queryClient.invalidateQueries({ queryKey: ['gmail-connection'] });
            queryClient.invalidateQueries({ queryKey: ['gmail-messages'] });
            queryClient.invalidateQueries({ queryKey: ['gmail-labels'] });
            resolve({ success: true });
          }
        }, 500);
        
        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          resolve({ success: true });
        }, 300000);
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Disconnect Gmail
export function useDisconnectGmail() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("gmail-auth", {
        body: { action: "disconnect" },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail-connection"] });
      queryClient.invalidateQueries({ queryKey: ["gmail-messages"] });
      queryClient.invalidateQueries({ queryKey: ["gmail-labels"] });
      toast({
        title: "Gmail Disconnected",
        description: "Your Gmail account has been disconnected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Disconnection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// List Gmail messages
export function useGmailMessages(options: {
  labelIds?: string[];
  query?: string;
  maxResults?: number;
  enabled?: boolean;
}) {
  const { labelIds, query, maxResults = 20, enabled = true } = options;

  return useQuery({
    queryKey: ["gmail-messages", { labelIds, query, maxResults }],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("gmail-messages", {
        body: { action: "list", labelIds, query, maxResults },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      return response.data as {
        messages: GmailMessage[];
        nextPageToken?: string;
        resultSizeEstimate: number;
      };
    },
    enabled,
    staleTime: 30 * 1000,
  });
}

// Get single Gmail message
export function useGmailMessage(messageId: string | null) {
  return useQuery({
    queryKey: ["gmail-message", messageId],
    queryFn: async () => {
      if (!messageId) return null;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("gmail-messages", {
        body: { action: "get", messageId },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      return response.data as GmailMessage;
    },
    enabled: !!messageId,
  });
}

// Get Gmail labels
export function useGmailLabels(enabled = true) {
  return useQuery({
    queryKey: ["gmail-labels"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("gmail-labels", {
        body: {},
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      return response.data.labels as GmailLabel[];
    },
    enabled,
    staleTime: 60 * 1000,
  });
}

// Send email
export function useSendEmail() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      to: string;
      cc?: string;
      bcc?: string;
      subject: string;
      body: string;
      replyToMessageId?: string;
      threadId?: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("gmail-send", {
        body: { action: "send", ...params },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail-messages"] });
      queryClient.invalidateQueries({ queryKey: ["gmail-labels"] });
      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Send Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Modify message (read/unread, star/unstar)
export function useModifyMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      messageId: string;
      addLabelIds?: string[];
      removeLabelIds?: string[];
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("gmail-messages", {
        body: { action: "modify", ...params },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail-messages"] });
      queryClient.invalidateQueries({ queryKey: ["gmail-message"] });
      queryClient.invalidateQueries({ queryKey: ["gmail-labels"] });
    },
  });
}

// Trash message
export function useTrashMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("gmail-messages", {
        body: { action: "trash", messageId },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail-messages"] });
      queryClient.invalidateQueries({ queryKey: ["gmail-labels"] });
      toast({
        title: "Email Deleted",
        description: "The email has been moved to trash.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
