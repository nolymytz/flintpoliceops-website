import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || "Flint Police Ops <news@flintpoliceops.com>";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      console.error("Missing RESEND_API_KEY or RESEND_AUDIENCE_ID env var");
      return NextResponse.json(
        { error: "Subscription service not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Add contact to the Resend audience
    const contactResult = await resend.contacts.create({
      email: normalizedEmail,
      unsubscribed: false,
      audienceId,
    });

    if (contactResult.error) {
      const msg = contactResult.error.message || "";
      const isDuplicate = /already exists|already subscribed|duplicate/i.test(msg);
      if (!isDuplicate) {
        console.error("Resend contacts.create error:", contactResult.error);
        return NextResponse.json(
          { error: "Something went wrong. Please try again." },
          { status: 500 }
        );
      }
    }

    // 2. Send welcome email (non-blocking)
    try {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: normalizedEmail,
        subject: "Welcome to Flint Police Ops",
        html: welcomeEmailHtml(),
        text: welcomeEmailText(),
      });
    } catch (emailError) {
      console.error("Welcome email failed (subscription still saved):", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

function welcomeEmailHtml(): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to Flint Police Ops</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#222;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:24px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(15,26,46,0.08);">
        <tr><td style="background:#0f1a2e;padding:28px 32px;text-align:center;">
          <div style="color:#c9a84c;font-size:12px;letter-spacing:2px;font-weight:600;">FLINT, MICHIGAN</div>
          <div style="color:#ffffff;font-size:24px;font-weight:900;margin-top:4px;">FLINT POLICE OPS</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="color:#0f1a2e;font-size:22px;margin:0 0 12px;">Welcome aboard.</h1>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
            Thanks for subscribing to the Flint Police Ops newsletter. You'll get daily updates on crime, local news, and community happenings across Flint &mdash; straight to your inbox.
          </p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Here's what to expect:</p>
          <ul style="font-size:16px;line-height:1.6;margin:0 0 20px;padding-left:20px;">
            <li>Morning crime &amp; scanner highlights</li>
            <li>Local government and community news</li>
            <li>Upcoming events around town</li>
            <li>FPO Confessions on Sundays</li>
          </ul>
          <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">
            Got a tip, event, or story? Send it our way at
            <a href="https://flintpoliceops.com/submit" style="color:#c9a84c;font-weight:600;text-decoration:none;">flintpoliceops.com/submit</a>.
          </p>
          <div style="text-align:center;margin:24px 0;">
            <a href="https://flintpoliceops.com" style="display:inline-block;background:#c9a84c;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:8px;">Visit FlintPoliceOps.com</a>
          </div>
          <p style="font-size:14px;color:#666;line-height:1.5;margin:24px 0 0;">
            &mdash; The Flint Police Ops Team
          </p>
        </td></tr>
        <tr><td style="background:#0a1220;color:#8a9ab5;font-size:12px;padding:20px 32px;text-align:center;">
          You're receiving this because you subscribed at flintpoliceops.com.<br/>
          Flint, Michigan
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function welcomeEmailText(): string {
  return `Welcome to Flint Police Ops

Thanks for subscribing. You'll get daily updates on crime, local news, and community happenings across Flint straight to your inbox.

What to expect:
- Morning crime & scanner highlights
- Local government and community news
- Upcoming events around town
- FPO Confessions on Sundays

Got a tip? https://flintpoliceops.com/submit

-- The Flint Police Ops Team
https://flintpoliceops.com
`;
}
