import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

interface UploadResult {
  path: string;
  signedUrl: string | null;
  fileName: string;
}

export const useESignStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload PDF, JPG, or PNG.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 50MB.";
    }
    return null;
  };

  const uploadDocument = async (file: File): Promise<UploadResult | null> => {
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Upload Error",
        description: validationError,
        variant: "destructive",
      });
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload documents.",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("esign-documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      setProgress(80);

      // Get signed URL for private bucket
      const { data: signedData, error: signedError } = await supabase.storage
        .from("esign-documents")
        .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 days

      if (signedError) {
        console.warn("Failed to create signed URL:", signedError);
      }

      setProgress(100);

      return {
        path: data.path,
        signedUrl: signedData?.signedUrl || null,
        fileName: file.name,
      };
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from("esign-documents")
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete document.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getSignedUrl = async (path: string, expiresIn = 3600): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from("esign-documents")
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Signed URL error:", error);
      return null;
    }
  };

  return {
    uploadDocument,
    deleteDocument,
    getSignedUrl,
    isUploading,
    progress,
    validateFile,
  };
};
