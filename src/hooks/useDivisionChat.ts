import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDivision } from "@/contexts/DivisionContext";
import { toast } from "sonner";

export interface ChatMessage {
  id: string;
  channel_id: string;
  user_id: string;
  message: string;
  message_type: string;
  reply_to: string | null;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
  // Joined from profiles
  sender_name?: string;
  sender_avatar?: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface ChatChannel {
  id: string;
  division: string;
  name: string;
  description: string | null;
}

export function useDivisionChat() {
  const { user } = useAuth();
  const { division, isAdmin } = useDivision();
  const queryClient = useQueryClient();
  const [realtimeChannel, setRealtimeChannel] = useState<ReturnType<typeof supabase.channel> | null>(null);

  // Get the channel for current division
  const { data: channel, isLoading: isLoadingChannel } = useQuery({
    queryKey: ["division-channel", division],
    queryFn: async () => {
      if (!division) return null;
      
      const { data, error } = await supabase
        .from("division_channels")
        .select("*")
        .eq("division", division)
        .single();

      if (error) {
        console.error("Error fetching channel:", error);
        return null;
      }
      return data as ChatChannel;
    },
    enabled: !!division,
  });

  // Get all channels (for admin dropdown)
  const { data: allChannels } = useQuery({
    queryKey: ["all-division-channels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("division_channels")
        .select("*")
        .order("division");

      if (error) {
        console.error("Error fetching channels:", error);
        return [];
      }
      return data as ChatChannel[];
    },
    enabled: isAdmin,
  });

  // Fetch messages for the channel
  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["division-messages", channel?.id],
    queryFn: async () => {
      if (!channel?.id) return [];

      const { data, error } = await supabase
        .from("division_messages")
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq("channel_id", channel.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }

      return data.map((msg: any) => ({
        ...msg,
        sender_name: msg.profiles?.full_name || "Unknown",
        sender_avatar: msg.profiles?.avatar_url,
      })) as ChatMessage[];
    },
    enabled: !!channel?.id,
  });

  // Fetch reactions for all messages
  const { data: reactions = [], refetch: refetchReactions } = useQuery({
    queryKey: ["message-reactions", channel?.id],
    queryFn: async () => {
      if (!channel?.id || messages.length === 0) return [];

      const messageIds = messages.map(m => m.id);
      const { data, error } = await supabase
        .from("message_reactions")
        .select("*")
        .in("message_id", messageIds);

      if (error) {
        console.error("Error fetching reactions:", error);
        return [];
      }

      return data as MessageReaction[];
    },
    enabled: !!channel?.id && messages.length > 0,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!channel?.id || !user?.id) throw new Error("Not ready");

      const { data, error } = await supabase
        .from("division_messages")
        .insert({
          channel_id: channel.id,
          user_id: user.id,
          message: text.trim(),
          message_type: "text",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetchMessages();
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    },
  });

  // Edit message mutation
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, text }: { messageId: string; text: string }) => {
      const { data, error } = await supabase
        .from("division_messages")
        .update({
          message: text.trim(),
          edited_at: new Date().toISOString(),
        })
        .eq("id", messageId)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetchMessages();
    },
    onError: (error) => {
      console.error("Failed to edit message:", error);
      toast.error("Failed to edit message");
    },
  });

  // Delete message mutation (soft delete)
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("division_messages")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", messageId)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      refetchMessages();
      toast.success("Message deleted");
    },
    onError: (error) => {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    },
  });

  // Add reaction mutation
  const addReactionMutation = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("message_reactions")
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetchReactions();
    },
    onError: (error: any) => {
      // Ignore duplicate reaction error
      if (error?.code !== "23505") {
        console.error("Failed to add reaction:", error);
      }
    },
  });

  // Remove reaction mutation
  const removeReactionMutation = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", user.id)
        .eq("emoji", emoji);

      if (error) throw error;
    },
    onSuccess: () => {
      refetchReactions();
    },
  });

  // Toggle reaction (add if not exists, remove if exists)
  const toggleReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user?.id) return;

    const existingReaction = reactions.find(
      r => r.message_id === messageId && r.user_id === user.id && r.emoji === emoji
    );

    if (existingReaction) {
      await removeReactionMutation.mutateAsync({ messageId, emoji });
    } else {
      await addReactionMutation.mutateAsync({ messageId, emoji });
    }
  }, [user?.id, reactions, addReactionMutation, removeReactionMutation]);

  // Get reactions grouped by message
  const getReactionsForMessage = useCallback((messageId: string) => {
    const messageReactions = reactions.filter(r => r.message_id === messageId);
    const grouped: Record<string, { emoji: string; count: number; userIds: string[] }> = {};

    messageReactions.forEach(r => {
      if (!grouped[r.emoji]) {
        grouped[r.emoji] = { emoji: r.emoji, count: 0, userIds: [] };
      }
      grouped[r.emoji].count++;
      grouped[r.emoji].userIds.push(r.user_id);
    });

    return Object.values(grouped);
  }, [reactions]);

  // Set up real-time subscription
  useEffect(() => {
    if (!channel?.id) return;

    const channelSub = supabase
      .channel(`chat-${channel.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "division_messages",
          filter: `channel_id=eq.${channel.id}`,
        },
        () => {
          refetchMessages();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
        },
        () => {
          refetchReactions();
        }
      )
      .subscribe();

    setRealtimeChannel(channelSub);

    return () => {
      supabase.removeChannel(channelSub);
    };
  }, [channel?.id, refetchMessages, refetchReactions]);

  return {
    // Channel info
    channel,
    allChannels: allChannels || [],
    isLoadingChannel,

    // Messages
    messages,
    isLoadingMessages,
    sendMessage: (text: string) => sendMessageMutation.mutateAsync(text),
    editMessage: (messageId: string, text: string) => 
      editMessageMutation.mutateAsync({ messageId, text }),
    deleteMessage: (messageId: string) => deleteMessageMutation.mutateAsync(messageId),
    isSending: sendMessageMutation.isPending,

    // Reactions
    toggleReaction,
    getReactionsForMessage,

    // User info
    currentUserId: user?.id,
    isAdmin,
  };
}
