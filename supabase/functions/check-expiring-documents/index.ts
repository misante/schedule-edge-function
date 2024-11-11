
import { serve } from 'https://deno.land/x/sift/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import sgMail from "@sendgrid/mail";

const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const sendReminder = (doc) => {
  const msg = {
    to: "aspireonline22@gmail.com", // Recipient's email
    from: "aspireonline22@gmail.com", // Your verified sender email
    subject: `Document "${doc.name}" is Expiring Soon`,
    text: `Your document "${doc.name}" is expiring on ${doc.expiration_date}. Please renew it.`,
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Reminder sent for:", doc.name);
    })
    .catch((error) => {
      console.error("Error sending reminder:", error);
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

    if (expiringDocuments.length > 0) {
      // Handle the logic for expiring documents
      // E.g., send notifications or log the results
      console.log('Documents nearing expiration:', expiringDocuments);
      
      // Loop through each document and send reminder
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
    return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
  }
});
