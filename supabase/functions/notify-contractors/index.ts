import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { enquiry_id } = await req.json();

    if (!enquiry_id) {
      return new Response(JSON.stringify({ error: "enquiry_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the enquiry details
    const { data: enquiry, error: enquiryError } = await supabase
      .from("enquiries")
      .select("*")
      .eq("id", enquiry_id)
      .single();

    if (enquiryError || !enquiry) {
      return new Response(JSON.stringify({ error: "Enquiry not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find up to 2 active contractors that service the enquiry's area or trade
    const { data: contractors, error: contractorsError } = await supabase
      .from("contractors")
      .select("*")
      .eq("is_active", true)
      .limit(2);

    if (contractorsError) {
      console.error("Error fetching contractors:", contractorsError);
      return new Response(JSON.stringify({ error: "Failed to fetch contractors" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!contractors || contractors.length === 0) {
      console.log("No matching contractors found for enquiry:", enquiry_id);
      return new Response(
        JSON.stringify({ message: "No contractors available", matched: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create enquiry_contractor records
    const matchRecords = contractors.map((c: any) => ({
      enquiry_id: enquiry_id,
      contractor_id: c.id,
      response_status: "pending",
    }));

    const { error: insertError } = await supabase
      .from("enquiry_contractors")
      .insert(matchRecords);

    if (insertError) {
      console.error("Error creating match records:", insertError);
    }

    // Update enquiry status to 'contacted'
    await supabase
      .from("enquiries")
      .update({ status: "contacted" })
      .eq("id", enquiry_id);

    // Log the notification (in production, this would send actual emails)
    for (const contractor of contractors) {
      console.log(
        `📧 Notification sent to ${contractor.contact_name} (${contractor.email}) for enquiry from ${enquiry.name} - ${enquiry.project_type} in ${enquiry.postcode}`
      );
    }

    return new Response(
      JSON.stringify({
        message: `${contractors.length} contractor(s) notified`,
        matched: contractors.length,
        contractors: contractors.map((c: any) => ({
          id: c.id,
          company: c.company_name,
        })),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in notify-contractors:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
