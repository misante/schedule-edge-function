export async function GET(){
// Edge function example or API route logic
const today = new Date();
const reminderThreshold = new Date(today.setDate(today.getDate() + 7)); // 7 days before expiration

const { data: expiringDocs, error } = await supabase
  .from("Documents")
  .select("*")
  .lte("expiration_date", reminderThreshold);

if (expiringDocs.length > 0) {
  // Send notifications or reminders
  expiringDocs.forEach((doc) => sendReminder(doc));
}


}