import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export const useReceiptUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadReceipt = async (file: File, expenseId?: string) => {
    if (!user?.id) {
      toast.error("You must be logged in to upload receipts");
      return null;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload PDF, JPG, PNG, or WebP");
      return null;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 5MB");
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const fileName = expenseId 
        ? `${expenseId}/${timestamp}.${fileExt}`
        : `temp/${timestamp}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { data, error } = await supabase.storage
        .from("expense-receipts")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get signed URL
      const { data: signedData } = await supabase.storage
        .from("expense-receipts")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

      setProgress(100);

      return {
        path: data.path,
        url: signedData?.signedUrl || null,
        filename: file.name,
      };
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload receipt: " + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteReceipt = async (filePath: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase.storage
        .from("expense-receipts")
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete receipt: " + error.message);
      return false;
    }
  };

  const getSignedUrl = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("expense-receipts")
      .createSignedUrl(filePath, 60 * 60); // 1 hour

    if (error) {
      console.error("Signed URL error:", error);
      return null;
    }

    return data.signedUrl;
  };

  return {
    uploadReceipt,
    deleteReceipt,
    getSignedUrl,
    isUploading,
    progress,
  };
};
