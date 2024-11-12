export async function POST(req) {
  try {
    // Parse the incoming request body as JSON
    const message = await req.json();

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

    // Call the sendReminder function to send the email
    sendReminder(message);

    return new Response(
      JSON.stringify({ success: "Reminder sent successfully", message }),
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
