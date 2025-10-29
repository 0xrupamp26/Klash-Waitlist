import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1oJpteOZSLms27PA8E7iyLrKRXiXwBd1d3FhlMCiV-FQ/edit';
const SHEET_ID = '1oJpteOZSLms27PA8E7iyLrKRXiXwBd1d3FhlMCiV-FQ';

interface WaitlistEntry {
  email: string;
  ip_address?: string;
  user_agent?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email }: WaitlistEntry = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const user_agent = req.headers.get('user-agent') || '';

    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email, ip_address, user_agent }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Email already registered' }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      throw error;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('entry.emailAddress', email);
      formData.append('entry.timestamp', new Date().toISOString());
      
      await fetch(
        `https://script.google.com/macros/s/AKfycbwDummy/exec`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      ).catch(() => {});

      await supabase
        .from('waitlist')
        .update({ synced_to_sheets: true })
        .eq('id', data.id);
    } catch (sheetsError) {
      console.error('Failed to sync to sheets:', sheetsError);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully joined the waitlist!' }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred. Please try again.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});