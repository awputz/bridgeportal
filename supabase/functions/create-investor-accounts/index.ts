import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvestorData {
  email: string;
  full_name: string;
  company: string;
}

const investors: InvestorData[] = [
  { email: 'jason@hudsonpointgroup.com', full_name: 'Jason Shottenfeld', company: 'Hudson Point Group' },
  { email: 'daniel@hudsonpointgroup.com', full_name: 'Daniel Levitin', company: 'Hudson Point Group' },
  { email: 'ms@hudsonpointgroup.com', full_name: 'Matthew Sherr', company: 'Hudson Point Group' },
  { email: 'matt@hudsonpointgroup.com', full_name: 'Matthew Pazzaglini', company: 'Hudson Point Group' },
];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const results: { email: string; status: string; error?: string }[] = [];
    const password = 'BridgeInvestors2025!';

    for (const investor of investors) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === investor.email);

        let userId: string;

        if (existingUser) {
          userId = existingUser.id;
          console.log(`User ${investor.email} already exists with ID: ${userId}`);
          
          // Update their password to ensure they can log in
          await supabase.auth.admin.updateUserById(userId, {
            password: password,
            email_confirm: true
          });
          
          results.push({ email: investor.email, status: 'exists - password updated' });
        } else {
          // Create new user
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: investor.email,
            password: password,
            email_confirm: true,
            user_metadata: {
              full_name: investor.full_name,
              company: investor.company
            }
          });

          if (createError) {
            console.error(`Error creating user ${investor.email}:`, createError);
            results.push({ email: investor.email, status: 'error', error: createError.message });
            continue;
          }

          userId = newUser.user.id;
          console.log(`Created user ${investor.email} with ID: ${userId}`);
          results.push({ email: investor.email, status: 'created' });
        }

        // Ensure investor role exists for this user
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .eq('role', 'investor')
          .maybeSingle();

        if (!existingRole) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: 'investor' });

          if (roleError) {
            console.error(`Error assigning investor role to ${investor.email}:`, roleError);
          } else {
            console.log(`Assigned investor role to ${investor.email}`);
          }
        } else {
          console.log(`Investor role already exists for ${investor.email}`);
        }

        // Ensure profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (!existingProfile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: investor.email,
              full_name: investor.full_name,
              user_type: 'investor'
            });

          if (profileError) {
            console.error(`Error creating profile for ${investor.email}:`, profileError);
          } else {
            console.log(`Created profile for ${investor.email}`);
          }
        } else {
          // Update existing profile
          await supabase
            .from('profiles')
            .update({
              full_name: investor.full_name,
              user_type: 'investor'
            })
            .eq('id', userId);
          console.log(`Updated profile for ${investor.email}`);
        }

      } catch (error) {
        console.error(`Error processing ${investor.email}:`, error);
        results.push({ email: investor.email, status: 'error', error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Investor accounts processed',
        results,
        password: password
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in create-investor-accounts:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
