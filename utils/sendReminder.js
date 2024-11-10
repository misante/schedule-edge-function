import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendReminder = (doc) => {
  const msg = {
    to: "recipient@example.com", // Recipient's email
    from: "noreply@yourapp.com", // Your verified sender email
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
