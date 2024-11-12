import { serve } from 'https://deno.land/x/sift/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import sgMail from 'https://esm.sh/@sendgrid/mail@7';

// Initialize Supabase and SendGrid API keys
const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize SendGrid
sgMail.setApiKey(sendgridApiKey);

// Send reminder email
const sendReminder = (doc) => {
  const msg = {
    to: "aspireonline22@gmail.com", // Recipient's email
    from: "aspireonline22@gmail.com", // Your verified sender email
    subject: `Document "${doc.name}" is Expiring Soon`,
    text: `Your document "${doc.name}" is expiring on ${doc.expiration_date}. Please renew it.`,
    html: `<strong>Your document "${doc.name}" is expiring on ${doc.expiration_date}. Please renew it.</strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Reminder sent for:', doc.name);
    })
    .catch((error) => {
      console.error('Error sending reminder:', error);
    });
};

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
    if (expiringDocuments && expiringDocuments.length > 0) {
      // Send reminders for each expiring document
      for (const doc of expiringDocuments) {
        sendReminder(doc);
      }

      return new Response(
        JSON.stringify({ message: `Found ${expiringDocuments.length} expiring documents`, data: expiringDocuments }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: 'No expiring documents found' }), { status: 200 });
    }
  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
  }
});
