// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// console.log("Hello from Functions!");

// Deno.serve(async (req) => {
//   const { name } = await req.json();
//   const data = {
//     message: `Hello ${name}!`,
//   };

//   return new Response(JSON.stringify(data), {
//     headers: { "Content-Type": "application/json" },
//   });
// });

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/check-expiring-documents' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
// File: ./functions/check-expiring-documents/index.ts
import { serve } from 'https://deno.land/x/sift/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Serve the Edge Function
serve(async (req) => {
  try {
    // Get current date and date after 7 days
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const nextWeek = sevenDaysFromNow.toISOString().split('T')[0];

    // Query documents that will expire within the next 7 days
    const { data: expiringDocuments, error } = await supabase
      .from('Documents')
      .select('*')
      .gte('expiration_date', today)
      .lte('expiration_date', nextWeek);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (expiringDocuments.length > 0) {
      // Handle the logic for expiring documents
      // E.g., send notifications or log the results
      console.log('Documents nearing expiration:', expiringDocuments);
      
      // You can add notification logic here (email, SMS, etc.)
      
      return new Response(
        JSON.stringify({ message: `Found ${expiringDocuments.length} expiring documents`, data: expiringDocuments }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: 'No expiring documents found' }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
  }
});
