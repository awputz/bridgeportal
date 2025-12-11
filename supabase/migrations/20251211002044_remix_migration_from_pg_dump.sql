CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'agent',
    'user'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: is_admin_or_agent(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin_or_agent(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'agent')
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    details jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    session_id text NOT NULL,
    user_id uuid,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chat_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])))
);


--
-- Name: email_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipient_email text NOT NULL,
    recipient_name text,
    subject text NOT NULL,
    body text NOT NULL,
    template_type text,
    status text DEFAULT 'pending'::text NOT NULL,
    sent_at timestamp with time zone,
    error_message text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    property_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inquiries (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    user_type text,
    timeline text,
    budget text,
    neighborhoods text,
    requirements text,
    property_address text,
    unit_count text,
    assignment_type text,
    timing text,
    status text DEFAULT 'new'::text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    matched_properties jsonb,
    property_type text,
    approximate_size text,
    current_situation text,
    inquiry_type text DEFAULT 'general'::text,
    target_asset_type text,
    target_boroughs text,
    budget_range text,
    CONSTRAINT inquiries_status_check CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'qualified'::text, 'closed'::text]))),
    CONSTRAINT inquiries_user_type_check CHECK ((user_type = ANY (ARRAY['renter'::text, 'buyer'::text, 'landlord'::text])))
);


--
-- Name: media_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    file_name text NOT NULL,
    file_type text NOT NULL,
    file_size integer,
    file_url text NOT NULL,
    bucket_name text NOT NULL,
    storage_path text NOT NULL,
    uploaded_by uuid,
    entity_type text,
    entity_id uuid,
    alt_text text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    email text,
    phone text,
    user_type text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT profiles_user_type_check CHECK ((user_type = ANY (ARRAY['renter'::text, 'buyer'::text, 'landlord'::text, 'agent'::text])))
);


--
-- Name: properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.properties (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    description text,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip_code text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    property_type text,
    listing_type text,
    price numeric(12,2) NOT NULL,
    bedrooms integer,
    bathrooms numeric(3,1),
    square_feet integer,
    year_built integer,
    amenities text[],
    images text[],
    status text DEFAULT 'active'::text,
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_represented_building boolean DEFAULT false,
    cap_rate numeric,
    gross_square_feet integer,
    units integer,
    asset_type text,
    offering_status text DEFAULT 'active'::text,
    price_on_request boolean DEFAULT false,
    brief_highlights text,
    CONSTRAINT properties_listing_type_check CHECK ((listing_type = ANY (ARRAY['rent'::text, 'sale'::text]))),
    CONSTRAINT properties_property_type_check CHECK ((property_type = ANY (ARRAY['apartment'::text, 'condo'::text, 'house'::text, 'townhouse'::text, 'commercial'::text]))),
    CONSTRAINT properties_status_check CHECK ((status = ANY (ARRAY['active'::text, 'pending'::text, 'sold'::text, 'rented'::text])))
);


--
-- Name: property_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id uuid NOT NULL,
    user_id uuid,
    view_type text DEFAULT 'page_view'::text NOT NULL,
    session_id text,
    referrer text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: research_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.research_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    category text,
    summary text,
    content text,
    download_link text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    bio text,
    email text NOT NULL,
    phone text,
    image_url text,
    instagram_url text,
    linkedin_url text,
    category text NOT NULL,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT team_members_category_check CHECK ((category = ANY (ARRAY['leadership'::text, 'sales_team'::text])))
);


--
-- Name: tour_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour_requests (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    property_id uuid NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    preferred_date timestamp with time zone,
    preferred_time text,
    message text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT tour_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])))
);


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    closing_date date,
    agent_name text NOT NULL,
    deal_type text DEFAULT 'Residential'::text NOT NULL,
    property_address text NOT NULL,
    property_type text,
    monthly_rent numeric,
    lease_term_months integer,
    total_lease_value numeric,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    borough text,
    neighborhood text,
    building_id uuid,
    notes text,
    price_per_unit numeric,
    price_per_sf numeric,
    role text DEFAULT 'seller_representation'::text,
    year integer,
    gross_square_feet integer,
    units integer,
    sale_price numeric,
    asset_type text,
    CONSTRAINT transactions_borough_check CHECK ((borough = ANY (ARRAY['Manhattan'::text, 'Brooklyn'::text, 'Queens'::text, 'Bronx'::text, 'Other'::text])))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: email_notifications email_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_property_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_property_id_key UNIQUE (user_id, property_id);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: media_files media_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: property_analytics property_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_analytics
    ADD CONSTRAINT property_analytics_pkey PRIMARY KEY (id);


--
-- Name: research_notes research_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_notes
    ADD CONSTRAINT research_notes_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: tour_requests tour_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_requests
    ADD CONSTRAINT tour_requests_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_activity_logs_created_desc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_logs_created_desc ON public.activity_logs USING btree (created_at DESC);


--
-- Name: idx_activity_logs_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_logs_entity ON public.activity_logs USING btree (entity_type, entity_id);


--
-- Name: idx_activity_logs_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_logs_user ON public.activity_logs USING btree (user_id, created_at DESC);


--
-- Name: idx_inquiries_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inquiries_created_at ON public.inquiries USING btree (created_at DESC);


--
-- Name: idx_inquiries_created_desc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inquiries_created_desc ON public.inquiries USING btree (created_at DESC);


--
-- Name: idx_inquiries_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inquiries_email ON public.inquiries USING btree (email);


--
-- Name: idx_inquiries_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inquiries_status ON public.inquiries USING btree (status);


--
-- Name: idx_inquiries_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inquiries_user ON public.inquiries USING btree (user_id) WHERE (user_id IS NOT NULL);


--
-- Name: idx_media_files_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_files_entity ON public.media_files USING btree (entity_type, entity_id) WHERE (entity_type IS NOT NULL);


--
-- Name: idx_media_files_uploaded_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_files_uploaded_by ON public.media_files USING btree (uploaded_by, created_at DESC);


--
-- Name: idx_properties_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_properties_city ON public.properties USING btree (city);


--
-- Name: idx_properties_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_properties_featured ON public.properties USING btree (featured, created_at DESC) WHERE (featured = true);


--
-- Name: idx_properties_listing_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_properties_listing_type ON public.properties USING btree (listing_type) WHERE (listing_type IS NOT NULL);


--
-- Name: idx_properties_price; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_properties_price ON public.properties USING btree (price);


--
-- Name: idx_properties_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_properties_status ON public.properties USING btree (status);


--
-- Name: idx_property_analytics_property; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_property_analytics_property ON public.property_analytics USING btree (property_id, created_at DESC);


--
-- Name: idx_property_analytics_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_property_analytics_user ON public.property_analytics USING btree (user_id) WHERE (user_id IS NOT NULL);


--
-- Name: idx_team_members_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_team_members_category ON public.team_members USING btree (category);


--
-- Name: idx_team_members_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_team_members_display_order ON public.team_members USING btree (display_order);


--
-- Name: idx_team_members_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_team_members_is_active ON public.team_members USING btree (is_active);


--
-- Name: idx_transactions_created_desc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transactions_created_desc ON public.transactions USING btree (created_at DESC);


--
-- Name: idx_transactions_deal_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transactions_deal_type ON public.transactions USING btree (deal_type);


--
-- Name: idx_transactions_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transactions_year ON public.transactions USING btree (year) WHERE (year IS NOT NULL);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: email_notifications update_email_notifications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_email_notifications_updated_at BEFORE UPDATE ON public.email_notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: inquiries update_inquiries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: media_files update_media_files_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON public.media_files FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: properties update_properties_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: research_notes update_research_notes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_research_notes_updated_at BEFORE UPDATE ON public.research_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: team_members update_team_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tour_requests update_tour_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tour_requests_updated_at BEFORE UPDATE ON public.tour_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: transactions update_transactions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: chat_messages chat_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: favorites favorites_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: inquiries inquiries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: media_files media_files_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_files
    ADD CONSTRAINT media_files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: property_analytics property_analytics_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_analytics
    ADD CONSTRAINT property_analytics_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_analytics property_analytics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_analytics
    ADD CONSTRAINT property_analytics_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: tour_requests tour_requests_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_requests
    ADD CONSTRAINT tour_requests_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: tour_requests tour_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_requests
    ADD CONSTRAINT tour_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: transactions transactions_building_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_building_id_fkey FOREIGN KEY (building_id) REFERENCES public.properties(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: team_members Admins and agents can delete team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can delete team members" ON public.team_members FOR DELETE USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: team_members Admins and agents can insert team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can insert team members" ON public.team_members FOR INSERT WITH CHECK (public.is_admin_or_agent(auth.uid()));


--
-- Name: media_files Admins and agents can manage all media files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can manage all media files" ON public.media_files USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: email_notifications Admins and agents can manage email notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can manage email notifications" ON public.email_notifications USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: properties Admins and agents can manage properties; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can manage properties" ON public.properties USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: research_notes Admins and agents can manage research notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can manage research notes" ON public.research_notes USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: transactions Admins and agents can manage transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can manage transactions" ON public.transactions USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: inquiries Admins and agents can update inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can update inquiries" ON public.inquiries FOR UPDATE USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: team_members Admins and agents can update team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can update team members" ON public.team_members FOR UPDATE USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: tour_requests Admins and agents can update tour requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can update tour requests" ON public.tour_requests FOR UPDATE USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: inquiries Admins and agents can view all inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can view all inquiries" ON public.inquiries FOR SELECT USING (((auth.uid() = user_id) OR public.is_admin_or_agent(auth.uid())));


--
-- Name: team_members Admins and agents can view all team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can view all team members" ON public.team_members FOR SELECT USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: tour_requests Admins and agents can view all tour requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can view all tour requests" ON public.tour_requests FOR SELECT USING (((auth.uid() = user_id) OR public.is_admin_or_agent(auth.uid())));


--
-- Name: property_analytics Admins and agents can view analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can view analytics" ON public.property_analytics FOR SELECT USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: activity_logs Admins can view all activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all activity logs" ON public.activity_logs FOR SELECT USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: inquiries Anyone can create inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);


--
-- Name: chat_messages Anyone can create messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create messages" ON public.chat_messages FOR INSERT WITH CHECK (true);


--
-- Name: tour_requests Anyone can create tour requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create tour requests" ON public.tour_requests FOR INSERT WITH CHECK (true);


--
-- Name: property_analytics Anyone can track property views; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can track property views" ON public.property_analytics FOR INSERT WITH CHECK (true);


--
-- Name: properties Anyone can view active properties; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active properties" ON public.properties FOR SELECT USING (((status = 'active'::text) OR (auth.uid() IN ( SELECT profiles.id
   FROM public.profiles
  WHERE (profiles.user_type = 'agent'::text)))));


--
-- Name: team_members Anyone can view active team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active team members" ON public.team_members FOR SELECT USING ((is_active = true));


--
-- Name: media_files Anyone can view public media files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view public media files" ON public.media_files FOR SELECT USING ((bucket_name = ANY (ARRAY['property-images'::text, 'team-photos'::text, 'research-pdfs'::text])));


--
-- Name: research_notes Anyone can view research notes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view research notes" ON public.research_notes FOR SELECT USING (true);


--
-- Name: transactions Anyone can view transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view transactions" ON public.transactions FOR SELECT USING (true);


--
-- Name: activity_logs System can insert activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);


--
-- Name: favorites Users can manage own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own favorites" ON public.favorites USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: favorites Users can view own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: chat_messages Users can view own messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own messages" ON public.chat_messages FOR SELECT USING (((auth.uid() = user_id) OR (user_id IS NULL)));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: activity_logs Users can view their own activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own activity logs" ON public.activity_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: activity_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: email_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: favorites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: inquiries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: media_files; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: properties; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

--
-- Name: property_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.property_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: research_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.research_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: team_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

--
-- Name: tour_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tour_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: transactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


