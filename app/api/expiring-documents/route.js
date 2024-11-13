import { supabase } from "@/utils/supabase/supabaseClient";

export async function GET() {
  try {
    const today = new Date();
    const reminderThreshold = new Date(today.setDate(today.getDate() + 7)); // 7 days before expiration
    const reminderTime = reminderThreshold.toISOString().split("T")[0];
    console.log(reminderTime);
    const { data: expiringDocs, error } = await supabase
      .from("Documents")
      .select("*")
      .lte("expiration_date", reminderTime);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    console.log("expiringDocs:", expiringDocs);
    return new Response(JSON.stringify({ expiringDocs }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
