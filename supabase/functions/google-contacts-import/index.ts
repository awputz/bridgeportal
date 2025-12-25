import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { contacts, division = 'residential' } = await req.json();
    console.log(`Importing ${contacts?.length || 0} contacts for user: ${user.id}`);

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No contacts provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get existing contacts to check for duplicates
    const { data: existingContacts } = await supabase
      .from('crm_contacts')
      .select('email, phone')
      .eq('agent_id', user.id);

    const existingEmails = new Set((existingContacts || []).map(c => c.email?.toLowerCase()).filter(Boolean));
    const existingPhones = new Set((existingContacts || []).map(c => c.phone?.replace(/\D/g, '')).filter(Boolean));

    // Filter out duplicates and prepare for insert
    const contactsToInsert = contacts
      .filter((c: any) => {
        if (!c.name || c.name.trim() === '') return false;
        const email = c.email?.toLowerCase();
        const phone = c.phone?.replace(/\D/g, '');
        // Skip if email or phone already exists
        if (email && existingEmails.has(email)) return false;
        if (phone && existingPhones.has(phone)) return false;
        return true;
      })
      .map((c: any) => ({
        agent_id: user.id,
        full_name: c.name,
        email: c.email || null,
        phone: c.phone || null,
        company: c.company || null,
        address: c.address || null,
        contact_type: 'prospect',
        source: 'google-contacts',
        division: division,
        tags: ['google-import'],
        notes: c.title ? `Title: ${c.title}` : null,
      }));

    if (contactsToInsert.length === 0) {
      return new Response(
        JSON.stringify({ 
          imported: 0, 
          skipped: contacts.length,
          message: 'All contacts already exist in CRM'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert contacts
    const { data: inserted, error: insertError } = await supabase
      .from('crm_contacts')
      .insert(contactsToInsert)
      .select('id');

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to import contacts' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the sync in contact_sync_log
    const syncLogs = contacts
      .filter((c: any) => c.resourceName)
      .map((c: any) => ({
        agent_id: user.id,
        google_contact_id: c.resourceName,
        sync_direction: 'google_to_crm',
        sync_status: 'synced',
        google_etag: c.etag || null,
      }));

    if (syncLogs.length > 0) {
      await supabase.from('contact_sync_log').insert(syncLogs);
    }

    return new Response(
      JSON.stringify({ 
        imported: inserted?.length || 0,
        skipped: contacts.length - contactsToInsert.length,
        message: `Successfully imported ${inserted?.length || 0} contacts`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Contacts import error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
