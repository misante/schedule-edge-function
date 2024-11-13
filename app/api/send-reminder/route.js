import { supabase } from "@/utils/supabase/supabaseClient";

export async function POST() {
  try {
    // Parse the incoming request body as JSON
    // const message = await req.json();
    // Get current date and date after 7 days
    const today = new Date().toISOString().split("T")[0];
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const nextWeek = sevenDaysFromNow.toISOString().split("T")[0];
    console.log(today);
    console.log(nextWeek);
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      return new Response(
        JSON.stringify({ error: "SendGrid API Key is missing" }),
        { status: 500 }
      );
    }
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(sendgridApiKey);

    // Send reminder email
    const sendReminder = (message) => {
      const msg = {
        to: "aspireonline22@gmail.com", // Recipient's email
        from: "aspireonline22@gmail.com", // Your verified sender email
        subject: `Document "${message.name}" is Expiring Soon`,
        text: `Your document "${message.name}" is expiring on ${message.expiration_date}. Please renew it.`,
        html: `<strong>Your document "${message.name}" is expiring on ${message.expiration_date}. Please renew it.</strong>`,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Reminder sent for:", message.name);
        })
        .catch((error) => {
          console.error("Error sending reminder:", error);
        });
    };
    const { data: expiringDocuments, error } = await supabase
      .from("Documents")
      .select("*")
      .gte("expiration_date", today)
      .lte("expiration_date", nextWeek);

    if (error) {
      console.log(error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    console.log(expiringDocuments);
    if (expiringDocuments && expiringDocuments.length > 0) {
      // Send reminders for each expiring document
      for (const doc of expiringDocuments) {
        sendReminder(doc);
        const { data, error } = await supabase
          .from("Documents")
          .update("status", "Near to expire", "reminder", "Reminder sent")
          .eq("id", doc.id);
      }
    }
    return new Response(
      JSON.stringify({
        success: "Reminder sent successfully",
        expiringDocuments,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    });
  }
}
