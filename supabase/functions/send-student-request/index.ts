
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminRequestBody {
  type: "add_student" | "support";
  roll_number?: string;
  name?: string;
  message?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: AdminRequestBody = await req.json();
    console.log("Received request body:", body);

    let subject = "";
    let html = "";

    if (body.type === "add_student") {
      subject = "New Student Add Request";
      html = `
        <h2>New Student Request</h2>
        <p><strong>Roll Number:</strong> ${body.roll_number}</p>
        <p><strong>Name:</strong> ${body.name}</p>
      `;
    } else if (body.type === "support") {
      subject = "Student Contact Support Request";
      html = `
        <h2>Support Message</h2>
        <p>${body.message}</p>
      `;
    } else {
      return new Response(JSON.stringify({ error: "Invalid request type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Attempting to send email with subject:", subject);
    
    const emailResp = await resend.emails.send({
      from: "RGUKT Portal <onboarding@resend.dev>",
      to: ["polampallisaivardhan142@gmail.com"],
      subject,
      html,
    });

    console.log("Email API response:", emailResp);

    if (emailResp.error) {
      console.error("Resend API error:", emailResp.error);
      return new Response(JSON.stringify({ success: false, error: emailResp.error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in send-student-request function:", err);
    return new Response(JSON.stringify({ success: false, error: "Failed to process request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
