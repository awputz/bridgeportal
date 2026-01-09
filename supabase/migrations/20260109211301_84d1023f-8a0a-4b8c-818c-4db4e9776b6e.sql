-- Phase 1: AI Property Staging Database Schema

-- Step 1.1: Create storage bucket for staging images
INSERT INTO storage.buckets (id, name, public)
VALUES ('staging-images', 'staging-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for staging-images bucket
CREATE POLICY "Users can upload staging images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'staging-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view all staging images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'staging-images');

CREATE POLICY "Users can update their staging images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'staging-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their staging images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'staging-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Step 1.2: Create staging_projects table
CREATE TABLE public.staging_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  staging_type text NOT NULL CHECK (staging_type IN ('residential', 'commercial', 'architecture', 'investment')),
  property_id uuid REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  property_type text,
  target_audience text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_images integer NOT NULL DEFAULT 0,
  completed_images integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Indexes for staging_projects
CREATE INDEX idx_staging_projects_agent_id ON public.staging_projects(agent_id);
CREATE INDEX idx_staging_projects_status ON public.staging_projects(status);
CREATE INDEX idx_staging_projects_created_at ON public.staging_projects(created_at DESC);

-- Enable RLS on staging_projects
ALTER TABLE public.staging_projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for staging_projects
CREATE POLICY "Agents can view their own staging projects"
ON public.staging_projects FOR SELECT TO authenticated
USING (agent_id = auth.uid());

CREATE POLICY "Agents can create their own staging projects"
ON public.staging_projects FOR INSERT TO authenticated
WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update their own staging projects"
ON public.staging_projects FOR UPDATE TO authenticated
USING (agent_id = auth.uid());

CREATE POLICY "Agents can delete their own staging projects"
ON public.staging_projects FOR DELETE TO authenticated
USING (agent_id = auth.uid());

-- Step 1.3: Create staging_images table
CREATE TABLE public.staging_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.staging_projects(id) ON DELETE CASCADE,
  original_url text NOT NULL,
  original_width integer,
  original_height integer,
  staged_url text,
  staged_width integer,
  staged_height integer,
  room_type text NOT NULL CHECK (room_type IN ('living-room', 'bedroom', 'kitchen', 'bathroom', 'office', 'exterior', 'lobby', 'dining-room', 'other')),
  style_preference text NOT NULL CHECK (style_preference IN ('modern', 'traditional', 'minimalist', 'luxury', 'industrial', 'coastal', 'scandinavian', 'contemporary')),
  staging_prompt text,
  model_used text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  processing_time_ms integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for staging_images
CREATE INDEX idx_staging_images_project_id ON public.staging_images(project_id);
CREATE INDEX idx_staging_images_status ON public.staging_images(status);
CREATE INDEX idx_staging_images_project_status ON public.staging_images(project_id, status);

-- Enable RLS on staging_images
ALTER TABLE public.staging_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for staging_images
CREATE POLICY "Agents can view images in their projects"
ON public.staging_images FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.staging_projects 
  WHERE id = staging_images.project_id AND agent_id = auth.uid()
));

CREATE POLICY "Agents can add images to their projects"
ON public.staging_images FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.staging_projects 
  WHERE id = staging_images.project_id AND agent_id = auth.uid()
));

CREATE POLICY "Agents can update images in their projects"
ON public.staging_images FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.staging_projects 
  WHERE id = staging_images.project_id AND agent_id = auth.uid()
));

CREATE POLICY "Agents can delete images in their projects"
ON public.staging_images FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.staging_projects 
  WHERE id = staging_images.project_id AND agent_id = auth.uid()
));

-- Step 1.4: Create staging_templates table
CREATE TABLE public.staging_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  staging_type text NOT NULL CHECK (staging_type IN ('residential', 'commercial', 'architecture', 'investment')),
  room_type text NOT NULL CHECK (room_type IN ('living-room', 'bedroom', 'kitchen', 'bathroom', 'office', 'exterior', 'lobby', 'dining-room', 'other')),
  style_preference text NOT NULL CHECK (style_preference IN ('modern', 'traditional', 'minimalist', 'luxury', 'industrial', 'coastal', 'scandinavian', 'contemporary')),
  prompt_template text NOT NULL,
  negative_prompt text,
  thumbnail_url text,
  example_before_url text,
  example_after_url text,
  is_premium boolean NOT NULL DEFAULT false,
  popularity_score integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for staging_templates
CREATE INDEX idx_staging_templates_staging_type ON public.staging_templates(staging_type);
CREATE INDEX idx_staging_templates_room_type ON public.staging_templates(room_type);
CREATE INDEX idx_staging_templates_is_active ON public.staging_templates(is_active);

-- Enable RLS on staging_templates
ALTER TABLE public.staging_templates ENABLE ROW LEVEL SECURITY;

-- RLS policy for staging_templates (all authenticated users can view)
CREATE POLICY "All users can view active staging templates"
ON public.staging_templates FOR SELECT TO authenticated
USING (is_active = true);

-- Step 1.5: Create trigger function to update project counts
CREATE OR REPLACE FUNCTION public.update_staging_project_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.staging_projects
    SET 
      total_images = total_images + 1,
      updated_at = now()
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.staging_projects
    SET 
      total_images = GREATEST(0, total_images - 1),
      completed_images = CASE 
        WHEN OLD.status = 'completed' THEN GREATEST(0, completed_images - 1)
        ELSE completed_images
      END,
      updated_at = now()
    WHERE id = OLD.project_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
      UPDATE public.staging_projects
      SET 
        completed_images = completed_images + 1,
        updated_at = now()
      WHERE id = NEW.project_id;
    ELSIF OLD.status = 'completed' AND NEW.status != 'completed' THEN
      UPDATE public.staging_projects
      SET 
        completed_images = GREATEST(0, completed_images - 1),
        updated_at = now()
      WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for image count updates
CREATE TRIGGER trigger_update_staging_project_counts
AFTER INSERT OR UPDATE OR DELETE ON public.staging_images
FOR EACH ROW EXECUTE FUNCTION public.update_staging_project_counts();

-- Step 1.6: Create trigger function to set project completed_at
CREATE OR REPLACE FUNCTION public.set_staging_project_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if all images are completed
  IF NEW.completed_images > 0 AND NEW.completed_images = NEW.total_images AND NEW.completed_at IS NULL THEN
    NEW.status := 'completed';
    NEW.completed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for project completion
CREATE TRIGGER trigger_set_staging_project_completed
BEFORE UPDATE ON public.staging_projects
FOR EACH ROW EXECUTE FUNCTION public.set_staging_project_completed();

-- Step 1.7: Create updated_at trigger for staging tables
CREATE TRIGGER update_staging_images_updated_at
BEFORE UPDATE ON public.staging_images
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staging_projects_updated_at
BEFORE UPDATE ON public.staging_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 1.8: Seed staging templates
INSERT INTO public.staging_templates (name, description, staging_type, room_type, style_preference, prompt_template, negative_prompt, is_premium, popularity_score) VALUES
(
  'Modern Luxury Living Room',
  'Transform empty living rooms into stunning modern luxury spaces with designer furniture, elegant lighting, and sophisticated decor.',
  'residential',
  'living-room',
  'luxury',
  'A luxurious modern living room with high-end designer furniture, plush velvet sofa, marble coffee table, elegant pendant lighting, large abstract art on walls, floor-to-ceiling windows with sheer curtains, warm ambient lighting, professionally staged interior design photo, 8k quality',
  'people, pets, clutter, low quality, blurry, distorted, watermarks, text, logos, old furniture, dated decor',
  false,
  100
),
(
  'Executive Office Suite',
  'Stage commercial office spaces with professional executive furniture, modern workstations, and corporate aesthetics.',
  'commercial',
  'office',
  'modern',
  'A modern executive office with sleek glass desk, ergonomic leather chair, built-in bookshelves, contemporary artwork, professional lighting, large windows with city view, potted plants, clean minimal design, corporate interior photography, 8k quality',
  'people, personal items, clutter, low quality, blurry, distorted, watermarks, text, logos, home office items, casual furniture',
  false,
  90
),
(
  'Coastal Bedroom Retreat',
  'Create serene coastal-inspired bedrooms with light colors, natural textures, and relaxing beach-house vibes.',
  'residential',
  'bedroom',
  'coastal',
  'A serene coastal bedroom with white linen bedding, rattan headboard, light blue accents, natural jute rug, driftwood decor, sheer white curtains, soft natural lighting, beach-inspired artwork, relaxed luxury interior design, 8k quality',
  'people, pets, clutter, low quality, blurry, distorted, watermarks, text, logos, dark colors, heavy furniture',
  false,
  85
),
(
  'Minimalist Kitchen',
  'Stage kitchens with clean minimalist design, modern appliances, and functional elegance.',
  'residential',
  'kitchen',
  'minimalist',
  'A minimalist modern kitchen with white cabinets, marble countertops, stainless steel appliances, pendant lighting over island, clean lines, organized open shelving, fresh fruit bowl, herbs in pots, natural light, professional interior photography, 8k quality',
  'people, clutter, dirty dishes, low quality, blurry, distorted, watermarks, text, logos, old appliances, cluttered counters',
  false,
  88
),
(
  'Investment Property Exterior',
  'Enhance investment property exteriors with professional landscaping, curb appeal improvements, and attractive staging.',
  'investment',
  'exterior',
  'contemporary',
  'A well-maintained property exterior with manicured lawn, professional landscaping, trimmed hedges, colorful flower beds, clean walkway, modern exterior lighting, fresh paint, welcoming entrance, blue sky, real estate photography, 8k quality',
  'people, cars, trash, construction, low quality, blurry, distorted, watermarks, text, logos, dead plants, poor lighting',
  false,
  75
),
(
  'Luxury Retail Showroom',
  'Transform commercial retail spaces into premium showrooms with elegant displays and sophisticated lighting.',
  'commercial',
  'lobby',
  'luxury',
  'A luxury retail showroom with elegant product displays, marble floors, dramatic spotlighting, glass display cases, high-end fixtures, sophisticated color palette, premium branding elements, professional commercial photography, 8k quality',
  'people, shopping carts, clutter, low quality, blurry, distorted, watermarks, text except branding, discount signs, messy displays',
  true,
  70
);