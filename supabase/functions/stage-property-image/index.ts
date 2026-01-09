import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Style descriptions for prompt building
const STYLE_DESCRIPTIONS: Record<string, string> = {
  modern: "sleek contemporary design with clean lines, neutral colors, and minimalist furniture",
  traditional: "classic elegant design with rich wood tones, ornate details, and timeless furniture",
  minimalist: "ultra-clean design with bare essentials, white walls, and simple functional furniture",
  luxury: "high-end opulent design with premium materials, statement pieces, and designer furniture",
  industrial: "raw urban design with exposed brick, metal accents, and reclaimed wood furniture",
  coastal: "bright airy design with ocean-inspired colors, natural textures, and relaxed furniture",
  scandinavian: "nordic-inspired design with light wood, hygge elements, and functional simplicity",
  contemporary: "current trending design blending modern and transitional elements"
};

// Room context descriptions
const ROOM_CONTEXTS: Record<string, string> = {
  'living-room': "a welcoming living room with comfortable seating, coffee table, and ambient lighting",
  'bedroom': "a serene bedroom with a bed, nightstands, and soft lighting",
  'kitchen': "a functional kitchen with modern appliances, countertops, and dining elements",
  'bathroom': "a spa-like bathroom with clean fixtures, mirrors, and fresh towels",
  'office': "a productive home office with desk, ergonomic chair, and organized workspace",
  'exterior': "impressive curb appeal with landscaping, clean walkways, and welcoming entrance",
  'lobby': "an impressive commercial lobby with seating, reception area, and professional decor",
  'dining-room': "an elegant dining room with table, chairs, and tasteful lighting",
  'other': "a beautifully staged interior space"
};

const DEFAULT_NEGATIVE_PROMPT = "people, pets, clutter, personal items, brand logos, watermarks, text, blurry, low quality, distorted, unrealistic proportions";

function buildStagingPrompt(roomType: string, style: string): string {
  const styleDesc = STYLE_DESCRIPTIONS[style] || STYLE_DESCRIPTIONS.modern;
  const roomContext = ROOM_CONTEXTS[roomType] || ROOM_CONTEXTS.other;
  
  return `Transform this empty room into ${roomContext}. 
Apply ${styleDesc}. 
Keep the original architecture, windows, and structural elements intact.
Add appropriate furniture, decor, lighting fixtures, and accessories.
Ensure professional real estate photography quality with natural lighting.
Make the space feel inviting and move-in ready for potential buyers.`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Validate authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const userId = claimsData.claims.sub;

    // Parse request body
    const { imageId, templateId } = await req.json();

    if (!imageId) {
      return new Response(
        JSON.stringify({ success: false, error: "imageId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch image with project info
    const { data: image, error: imageError } = await supabase
      .from("staging_images")
      .select(`
        *,
        project:staging_projects!inner(
          id, agent_id, staging_type
        )
      `)
      .eq("id", imageId)
      .single();

    if (imageError || !image) {
      return new Response(
        JSON.stringify({ success: false, error: "Image not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify ownership
    if (image.project.agent_id !== userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Access denied" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update status to processing
    await supabase
      .from("staging_images")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", imageId);

    // Build staging prompt
    let prompt: string;
    
    if (templateId) {
      const { data: template } = await supabase
        .from("staging_templates")
        .select("prompt_template, negative_prompt")
        .eq("id", templateId)
        .single();
      
      if (template) {
        prompt = template.prompt_template;
      } else {
        prompt = buildStagingPrompt(image.room_type, image.style_preference);
      }
    } else {
      prompt = buildStagingPrompt(image.room_type, image.style_preference);
    }

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image.original_url } }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    const processingTimeMs = Date.now() - startTime;

    // Handle AI gateway errors
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      let errorMessage = "AI processing failed";
      if (aiResponse.status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (aiResponse.status === 402) {
        errorMessage = "AI credits exhausted. Please add funds.";
      }

      await supabase
        .from("staging_images")
        .update({
          status: "failed",
          error_message: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq("id", imageId);

      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        { status: aiResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const generatedImageBase64 = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageBase64) {
      throw new Error("No image generated from AI");
    }

    // Upload to storage bucket
    const fileName = `staged-${Date.now()}.png`;
    const filePath = `${userId}/${image.project.id}/staged/${fileName}`;

    // Convert base64 to binary
    const base64Data = generatedImageBase64.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Create admin client for storage upload
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: uploadError } = await adminClient.storage
      .from("staging-images")
      .upload(filePath, binaryData, {
        contentType: "image/png",
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from("staging-images")
      .getPublicUrl(filePath);

    // Update database with result
    await supabase
      .from("staging_images")
      .update({
        staged_url: publicUrl,
        staging_prompt: prompt,
        model_used: "google/gemini-3-pro-image-preview",
        status: "completed",
        processing_time_ms: processingTimeMs,
        updated_at: new Date().toISOString()
      })
      .eq("id", imageId);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          imageId,
          stagedUrl: publicUrl,
          processingTimeMs
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Stage image error:", error);
    
    // Try to update image status to failed
    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const { imageId } = await req.clone().json().catch(() => ({}));
        if (imageId) {
          const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
          );
          await supabase
            .from("staging_images")
            .update({
              status: "failed",
              error_message: error instanceof Error ? error.message : "Unknown error",
              updated_at: new Date().toISOString()
            })
            .eq("id", imageId);
        }
      }
    } catch {
      // Ignore cleanup errors
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
