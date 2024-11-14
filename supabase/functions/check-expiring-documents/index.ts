import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import sgMail from "https://esm.sh/@sendgrid/mail@7";
// Set up Supabase and SendGrid
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);
sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY")!);

// Helper function to send email reminders
const sendReminder = (doc: any) => {
  const msg = {
    to: "aspireonline22@gmail.com",
    from: "aspireonline22@gmail.com",
    subject: `Document "${doc.name}" is Expiring Soon`,
    text:
      `Your document "${doc.name}" is expiring on ${doc.expiration_date}. Please renew it.`,
    html:
      `<strong>Your document "${doc.name}" is expiring on ${doc.expiration_date}. Please renew it.</strong>`,
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
serve({
  "/check-expiring-documents": async (req) => {
    try {
      // Only handle POST requests if needed
      if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      // Get current date and date after 7 days
      const today = new Date().toISOString().split("T")[0];
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      const nextWeek = sevenDaysFromNow.toISOString().split("T")[0];

      // Query documents that will expire within the next 7 days
      const { data: expiringDocuments, error } = await supabase
        .from("Documents")
        .select("*")
        .gte("expiration_date", today)
        .lte("expiration_date", nextWeek);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      if (expiringDocuments.length > 0) {
        // Send reminders for expiring documents
        expiringDocuments.forEach((doc) => sendReminder(doc));

        return new Response(
          JSON.stringify({
            message: `Found ${expiringDocuments.length} expiring documents`,
            data: expiringDocuments,
          }),
          { status: 200 },
        );
      } else {
        return new Response(
          JSON.stringify({ message: "No expiring documents found" }),
          { status: 200 },
        );
      }
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: "An error occurred", details: error.message }),
        { status: 500 },
      );
    }
  },
});
