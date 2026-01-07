import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Reply, Trash2, Edit2, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useDealRoomComments,
  useAddDealRoomComment,
  useUpdateDealRoomComment,
  useDeleteDealRoomComment,
  DealRoomComment,
} from "@/hooks/useDealRoom";
import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { toast } from "sonner";

interface DealRoomCommentsProps {
  dealId: string;
}

function CommentItem({
  comment,
  currentUserId,
  dealId,
  onReply,
  depth = 0,
}: {
  comment: DealRoomComment;
  currentUserId?: string;
  dealId: string;
  onReply: (parentId: string) => void;
  depth?: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  
  const updateComment = useUpdateDealRoomComment();
  const deleteComment = useDeleteDealRoomComment();

  const isOwner = currentUserId === comment.user_id;
  const userInitials = comment.user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
      await updateComment.mutateAsync({ dealId, commentId: comment.id, comment: editText.trim() });
      
      setIsEditing(false);
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment.mutateAsync({ dealId, commentId: comment.id });
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-border/50 pl-4" : ""}`}>
      <div className="flex gap-3 py-2">
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarImage src={comment.user?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{comment.user?.full_name || "Someone"}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[60px] text-sm"
                maxLength={500}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUpdate} disabled={updateComment.isPending}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm mt-1 whitespace-pre-wrap">{comment.comment}</p>

              <div className="flex items-center gap-2 mt-2">
                {depth === 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs gap-1"
                    onClick={() => onReply(comment.id)}
                  >
                    <Reply className="h-3 w-3" />
                    Reply
                  </Button>
                )}
                {isOwner && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs gap-1"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs gap-1 text-destructive hover:text-destructive"
                      onClick={handleDelete}
                      disabled={deleteComment.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              dealId={dealId}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DealRoomComments({ dealId }: DealRoomCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { data: agent } = useCurrentAgent();
  const { data: comments, isLoading } = useDealRoomComments(dealId);
  const addComment = useAddDealRoomComment();

  const currentUserId = agent?.id;

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUserId) return;

    try {
      await addComment.mutateAsync({
        dealId,
        comment: newComment.trim(),
        parentId: replyingTo || undefined,
      });
      setNewComment("");
      setReplyingTo(null);
      toast.success(replyingTo ? "Reply added" : "Comment added");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const replyingToComment = replyingTo
    ? comments?.find((c) => c.id === replyingTo)
    : null;

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[450px]">
      {/* Comment Input */}
      <div className="p-4 border-b">
        {replyingTo && replyingToComment && (
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
            <Reply className="h-3 w-3" />
            <span>Replying to {replyingToComment.user?.full_name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 ml-auto"
              onClick={() => setReplyingTo(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Textarea
            placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] flex-1 resize-none"
            maxLength={500}
          />
          <Button
            size="icon"
            className="h-[60px] w-10"
            onClick={handleSubmit}
            disabled={!newComment.trim() || addComment.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {newComment.length}/500
        </p>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1">
        {comments && comments.length > 0 ? (
          <div className="p-4 space-y-2">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                dealId={dealId}
                onReply={setReplyingTo}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start the conversation!</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
