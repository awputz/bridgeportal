import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SignedUrlResult {
  url: string | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useSignedUrl = (
  bucket: string,
  path: string | null,
  expiresIn: number = 3600
): SignedUrlResult => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSignedUrl = async () => {
    if (!path) {
      setUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signedUrlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (signedUrlError) throw signedUrlError;
      setUrl(data.signedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate URL");
      setUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateSignedUrl();
  }, [bucket, path, expiresIn]);

  return { url, isLoading, error, refresh: generateSignedUrl };
};

// Helper function to generate a signed URL on demand
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  } catch {
    return null;
  }
};

// Extract file path from a stored URL (handles both public and signed URLs)
export const extractFilePath = (url: string | null): string | null => {
  if (!url) return null;
  
  // Handle URLs that are just paths
  if (url.startsWith('/')) return url.slice(1);
  
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/[^/]+\/(.+)/);
    if (pathMatch) return pathMatch[1];
    
    // If it's a simple path stored in the database
    return url;
  } catch {
    // If URL parsing fails, return the original string as it might be a path
    return url;
  }
};
