import { supabase } from "@/utils/supabase/supabaseClient";

export async function GET() {
  try {
    // Fetch documents from Supabase
    const { data, error } = await supabase.from("Documents").select("*");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
