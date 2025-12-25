CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

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
    action text NOT NULL,
    entity_type text,
    entity_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: bridge_buildings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bridge_buildings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    borough text,
    neighborhood text,
    unit_count integer,
    description text,
    tags text[],
    image_url text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    website_url text
);


--
-- Name: bridge_calculators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bridge_calculators (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    service_slug text NOT NULL,
    calculator_type text NOT NULL,
    section_key text NOT NULL,
    title text,
    subtitle text,
    input_config jsonb,
    output_description text,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: bridge_listing_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bridge_listing_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    url text NOT NULL,
    parent_id uuid,
    is_external boolean DEFAULT true,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: bridge_markets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bridge_markets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    metadata jsonb,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: bridge_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bridge_pages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_slug text NOT NULL,
    section_key text NOT NULL,
    title text,
    content text,
    metadata jsonb,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: bridge_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bridge_resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    short_description text,
    body_content text,
    external_url text,
    metadata jsonb,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: bridge_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bridge_services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    path text NOT NULL,
    tagline text,
    description text,
    icon text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: bridge_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bridge_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: commercial_listing_agents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.commercial_listing_agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    listing_id uuid NOT NULL,
    agent_id uuid NOT NULL,
    role text DEFAULT 'exclusive'::text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: commercial_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.commercial_listings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_address text NOT NULL,
    building_name text,
    neighborhood text,
    borough text,
    listing_type text NOT NULL,
    square_footage integer NOT NULL,
    asking_rent numeric,
    rent_per_sf numeric,
    lease_term text,
    possession text,
    ceiling_height_ft numeric,
    features text[],
    description text,
    image_url text,
    flyer_url text,
    latitude numeric,
    longitude numeric,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT commercial_listings_listing_type_check CHECK ((listing_type = ANY (ARRAY['office'::text, 'retail'::text])))
);


--
-- Name: deal_room_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deal_room_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    listing_id uuid NOT NULL,
    category text NOT NULL,
    document_name text NOT NULL,
    document_url text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: deal_room_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deal_room_registrations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    listing_id uuid NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    full_name text NOT NULL,
    company_name text,
    user_type text NOT NULL,
    brokerage_firm text,
    working_with text,
    notes text,
    registered_at timestamp with time zone DEFAULT now() NOT NULL,
    last_accessed_at timestamp with time zone DEFAULT now(),
    access_count integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    inquiry_type text,
    user_type text,
    property_address text,
    neighborhoods text,
    requirements text,
    budget text,
    timeline text,
    timing text,
    assignment_type text,
    unit_count text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: investment_listing_agents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.investment_listing_agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    listing_id uuid NOT NULL,
    agent_id uuid NOT NULL,
    role text DEFAULT 'exclusive'::text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: investment_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.investment_listings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_address text NOT NULL,
    neighborhood text,
    borough text,
    asset_class text NOT NULL,
    units integer,
    asking_price numeric,
    cap_rate numeric,
    gross_sf integer,
    year_built integer,
    description text,
    image_url text,
    om_url text,
    deal_room_password text DEFAULT 'bridgedeals'::text NOT NULL,
    listing_agent_id uuid,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: newsletter_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL
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
    slug text,
    license_number text
);


--
-- Name: team_members_public; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.team_members_public AS
 SELECT id,
    name,
    title,
    bio,
    image_url,
    category,
    display_order,
    slug,
    linkedin_url,
    instagram_url,
    email,
    phone,
    license_number
   FROM public.team_members
  WHERE (is_active = true);


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
    image_url text,
    division text DEFAULT 'Investment Sales'::text,
    is_profile_only boolean DEFAULT false NOT NULL,
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
-- Name: bridge_buildings bridge_buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_buildings
    ADD CONSTRAINT bridge_buildings_pkey PRIMARY KEY (id);


--
-- Name: bridge_buildings bridge_buildings_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_buildings
    ADD CONSTRAINT bridge_buildings_slug_key UNIQUE (slug);


--
-- Name: bridge_calculators bridge_calculators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_calculators
    ADD CONSTRAINT bridge_calculators_pkey PRIMARY KEY (id);


--
-- Name: bridge_calculators bridge_calculators_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_calculators
    ADD CONSTRAINT bridge_calculators_slug_key UNIQUE (slug);


--
-- Name: bridge_listing_links bridge_listing_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_listing_links
    ADD CONSTRAINT bridge_listing_links_pkey PRIMARY KEY (id);


--
-- Name: bridge_markets bridge_markets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_markets
    ADD CONSTRAINT bridge_markets_pkey PRIMARY KEY (id);


--
-- Name: bridge_pages bridge_pages_page_slug_section_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_pages
    ADD CONSTRAINT bridge_pages_page_slug_section_key_key UNIQUE (page_slug, section_key);


--
-- Name: bridge_pages bridge_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_pages
    ADD CONSTRAINT bridge_pages_pkey PRIMARY KEY (id);


--
-- Name: bridge_resources bridge_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_resources
    ADD CONSTRAINT bridge_resources_pkey PRIMARY KEY (id);


--
-- Name: bridge_resources bridge_resources_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_resources
    ADD CONSTRAINT bridge_resources_slug_key UNIQUE (slug);


--
-- Name: bridge_services bridge_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_services
    ADD CONSTRAINT bridge_services_pkey PRIMARY KEY (id);


--
-- Name: bridge_services bridge_services_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_services
    ADD CONSTRAINT bridge_services_slug_key UNIQUE (slug);


--
-- Name: bridge_settings bridge_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_settings
    ADD CONSTRAINT bridge_settings_key_key UNIQUE (key);


--
-- Name: bridge_settings bridge_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_settings
    ADD CONSTRAINT bridge_settings_pkey PRIMARY KEY (id);


--
-- Name: commercial_listing_agents commercial_listing_agents_listing_id_agent_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commercial_listing_agents
    ADD CONSTRAINT commercial_listing_agents_listing_id_agent_id_key UNIQUE (listing_id, agent_id);


--
-- Name: commercial_listing_agents commercial_listing_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commercial_listing_agents
    ADD CONSTRAINT commercial_listing_agents_pkey PRIMARY KEY (id);


--
-- Name: commercial_listings commercial_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commercial_listings
    ADD CONSTRAINT commercial_listings_pkey PRIMARY KEY (id);


--
-- Name: deal_room_documents deal_room_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deal_room_documents
    ADD CONSTRAINT deal_room_documents_pkey PRIMARY KEY (id);


--
-- Name: deal_room_registrations deal_room_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deal_room_registrations
    ADD CONSTRAINT deal_room_registrations_pkey PRIMARY KEY (id);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: investment_listing_agents investment_listing_agents_listing_id_agent_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_listing_agents
    ADD CONSTRAINT investment_listing_agents_listing_id_agent_id_key UNIQUE (listing_id, agent_id);


--
-- Name: investment_listing_agents investment_listing_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_listing_agents
    ADD CONSTRAINT investment_listing_agents_pkey PRIMARY KEY (id);


--
-- Name: investment_listings investment_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_listings
    ADD CONSTRAINT investment_listings_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscriptions newsletter_subscriptions_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_email_key UNIQUE (email);


--
-- Name: newsletter_subscriptions newsletter_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_slug_key UNIQUE (slug);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: deal_room_registrations unique_listing_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deal_room_registrations
    ADD CONSTRAINT unique_listing_email UNIQUE (listing_id, email);


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
-- Name: idx_activity_logs_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_logs_action ON public.activity_logs USING btree (action);


--
-- Name: idx_activity_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_logs_created_at ON public.activity_logs USING btree (created_at DESC);


--
-- Name: idx_deal_room_registrations_listing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deal_room_registrations_listing ON public.deal_room_registrations USING btree (listing_id);


--
-- Name: idx_deal_room_registrations_listing_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deal_room_registrations_listing_email ON public.deal_room_registrations USING btree (listing_id, email);


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
-- Name: idx_transactions_division; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transactions_division ON public.transactions USING btree (division);


--
-- Name: idx_transactions_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transactions_year ON public.transactions USING btree (year) WHERE (year IS NOT NULL);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: bridge_calculators update_bridge_calculators_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bridge_calculators_updated_at BEFORE UPDATE ON public.bridge_calculators FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bridge_listing_links update_bridge_listing_links_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bridge_listing_links_updated_at BEFORE UPDATE ON public.bridge_listing_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bridge_markets update_bridge_markets_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bridge_markets_updated_at BEFORE UPDATE ON public.bridge_markets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bridge_pages update_bridge_pages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bridge_pages_updated_at BEFORE UPDATE ON public.bridge_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bridge_resources update_bridge_resources_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bridge_resources_updated_at BEFORE UPDATE ON public.bridge_resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bridge_services update_bridge_services_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bridge_services_updated_at BEFORE UPDATE ON public.bridge_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bridge_settings update_bridge_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bridge_settings_updated_at BEFORE UPDATE ON public.bridge_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: commercial_listings update_commercial_listings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_commercial_listings_updated_at BEFORE UPDATE ON public.commercial_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: investment_listings update_investment_listings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_investment_listings_updated_at BEFORE UPDATE ON public.investment_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: team_members update_team_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: transactions update_transactions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bridge_listing_links bridge_listing_links_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bridge_listing_links
    ADD CONSTRAINT bridge_listing_links_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.bridge_listing_links(id);


--
-- Name: commercial_listing_agents commercial_listing_agents_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commercial_listing_agents
    ADD CONSTRAINT commercial_listing_agents_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.team_members(id) ON DELETE CASCADE;


--
-- Name: commercial_listing_agents commercial_listing_agents_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commercial_listing_agents
    ADD CONSTRAINT commercial_listing_agents_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.commercial_listings(id) ON DELETE CASCADE;


--
-- Name: deal_room_documents deal_room_documents_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deal_room_documents
    ADD CONSTRAINT deal_room_documents_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.investment_listings(id) ON DELETE CASCADE;


--
-- Name: investment_listing_agents investment_listing_agents_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_listing_agents
    ADD CONSTRAINT investment_listing_agents_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.team_members(id) ON DELETE CASCADE;


--
-- Name: investment_listing_agents investment_listing_agents_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_listing_agents
    ADD CONSTRAINT investment_listing_agents_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.investment_listings(id) ON DELETE CASCADE;


--
-- Name: investment_listings investment_listings_listing_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investment_listings
    ADD CONSTRAINT investment_listings_listing_agent_id_fkey FOREIGN KEY (listing_agent_id) REFERENCES public.team_members(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
-- Name: transactions Admins and agents can manage transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can manage transactions" ON public.transactions USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: team_members Admins and agents can update team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can update team members" ON public.team_members FOR UPDATE USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: team_members Admins and agents can view all team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and agents can view all team members" ON public.team_members FOR SELECT USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: deal_room_registrations Admins can manage all registrations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all registrations" ON public.deal_room_registrations USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: bridge_buildings Admins can manage buildings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage buildings" ON public.bridge_buildings USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: bridge_calculators Admins can manage calculators; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage calculators" ON public.bridge_calculators USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: commercial_listing_agents Admins can manage commercial listing agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage commercial listing agents" ON public.commercial_listing_agents USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: commercial_listings Admins can manage commercial listings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage commercial listings" ON public.commercial_listings USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: deal_room_documents Admins can manage documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage documents" ON public.deal_room_documents USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: inquiries Admins can manage inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage inquiries" ON public.inquiries USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: investment_listing_agents Admins can manage listing agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage listing agents" ON public.investment_listing_agents USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: bridge_listing_links Admins can manage listing links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage listing links" ON public.bridge_listing_links USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: investment_listings Admins can manage listings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage listings" ON public.investment_listings USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: bridge_markets Admins can manage markets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage markets" ON public.bridge_markets USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: bridge_pages Admins can manage pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage pages" ON public.bridge_pages USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: bridge_resources Admins can manage resources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage resources" ON public.bridge_resources USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: bridge_services Admins can manage services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage services" ON public.bridge_services USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: bridge_settings Admins can manage settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage settings" ON public.bridge_settings USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: newsletter_subscriptions Admins can manage subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage subscriptions" ON public.newsletter_subscriptions USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: activity_logs Admins can view activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view activity logs" ON public.activity_logs FOR SELECT USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: inquiries Admins can view all inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all inquiries" ON public.inquiries FOR SELECT USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: newsletter_subscriptions Admins can view subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view subscriptions" ON public.newsletter_subscriptions FOR SELECT USING (public.is_admin_or_agent(auth.uid()));


--
-- Name: deal_room_registrations Anyone can check their own registration; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can check their own registration" ON public.deal_room_registrations FOR SELECT USING (true);


--
-- Name: activity_logs Anyone can insert activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);


--
-- Name: deal_room_registrations Anyone can register for deal room access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can register for deal room access" ON public.deal_room_registrations FOR INSERT WITH CHECK (true);


--
-- Name: inquiries Anyone can submit inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);


--
-- Name: newsletter_subscriptions Anyone can subscribe to newsletter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);


--
-- Name: deal_room_registrations Anyone can update their own registration; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update their own registration" ON public.deal_room_registrations FOR UPDATE USING (true);


--
-- Name: bridge_buildings Anyone can view active buildings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active buildings" ON public.bridge_buildings FOR SELECT USING ((is_active = true));


--
-- Name: bridge_calculators Anyone can view active calculators; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active calculators" ON public.bridge_calculators FOR SELECT USING ((is_active = true));


--
-- Name: commercial_listings Anyone can view active commercial listings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active commercial listings" ON public.commercial_listings FOR SELECT USING ((is_active = true));


--
-- Name: deal_room_documents Anyone can view active documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active documents" ON public.deal_room_documents FOR SELECT USING ((is_active = true));


--
-- Name: bridge_listing_links Anyone can view active listing links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active listing links" ON public.bridge_listing_links FOR SELECT USING ((is_active = true));


--
-- Name: investment_listings Anyone can view active listings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active listings" ON public.investment_listings FOR SELECT USING ((is_active = true));


--
-- Name: bridge_markets Anyone can view active markets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active markets" ON public.bridge_markets FOR SELECT USING ((is_active = true));


--
-- Name: bridge_pages Anyone can view active pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active pages" ON public.bridge_pages FOR SELECT USING ((is_active = true));


--
-- Name: bridge_resources Anyone can view active resources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active resources" ON public.bridge_resources FOR SELECT USING ((is_active = true));


--
-- Name: bridge_services Anyone can view active services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active services" ON public.bridge_services FOR SELECT USING ((is_active = true));


--
-- Name: commercial_listing_agents Anyone can view commercial listing agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view commercial listing agents" ON public.commercial_listing_agents FOR SELECT USING (true);


--
-- Name: investment_listing_agents Anyone can view listing agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view listing agents" ON public.investment_listing_agents FOR SELECT USING (true);


--
-- Name: team_members Anyone can view public team member info; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view public team member info" ON public.team_members FOR SELECT USING ((is_active = true));


--
-- Name: bridge_settings Anyone can view settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view settings" ON public.bridge_settings FOR SELECT USING (true);


--
-- Name: transactions Anyone can view transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view transactions" ON public.transactions FOR SELECT USING (true);


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: activity_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: bridge_buildings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bridge_buildings ENABLE ROW LEVEL SECURITY;

--
-- Name: bridge_calculators; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bridge_calculators ENABLE ROW LEVEL SECURITY;

--
-- Name: bridge_listing_links; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bridge_listing_links ENABLE ROW LEVEL SECURITY;

--
-- Name: bridge_markets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bridge_markets ENABLE ROW LEVEL SECURITY;

--
-- Name: bridge_pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bridge_pages ENABLE ROW LEVEL SECURITY;

--
-- Name: bridge_resources; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bridge_resources ENABLE ROW LEVEL SECURITY;

--
-- Name: bridge_services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bridge_services ENABLE ROW LEVEL SECURITY;

--
-- Name: bridge_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bridge_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: commercial_listing_agents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.commercial_listing_agents ENABLE ROW LEVEL SECURITY;

--
-- Name: commercial_listings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.commercial_listings ENABLE ROW LEVEL SECURITY;

--
-- Name: deal_room_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deal_room_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: deal_room_registrations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deal_room_registrations ENABLE ROW LEVEL SECURITY;

--
-- Name: inquiries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: investment_listing_agents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.investment_listing_agents ENABLE ROW LEVEL SECURITY;

--
-- Name: investment_listings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.investment_listings ENABLE ROW LEVEL SECURITY;

--
-- Name: newsletter_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: team_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

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




COMMIT;