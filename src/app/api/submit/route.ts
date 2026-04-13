import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const maxDuration = 30;

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || "Flint Police Ops <news@flintpoliceops.com>";
const TIPS_EMAIL = process.env.RESEND_TIPS_EMAIL || "news@flintpoliceops.com";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  if (!value) return "";
  const safe = escapeHtml(value).replace(/\n/g, "<br/>");
  return `<tr><td style="padding:8px 12px;background:#f5f5f0;font-weight:600;color:#0f1a2e;vertical-align:top;width:140px;">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#222;vertical-align:top;">${safe}</td></tr>`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY env var");
      return NextResponse.json({ error: "Submission service not configured." }, { status: 500 });
    }

    const form = await req.formData();

    const anonymous = form.get("anonymous") === "true";
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();

    const headline = String(form.get("headline") || "").trim();
    const what = String(form.get("what") || "").trim();
    const who = String(form.get("who") || "").trim();
    const whenIso = String(form.get("when") || "").trim();
    const whenFallback = String(form.get("whenText") || "").trim();
    const whenDisplay = whenIso
      ? new Date(whenIso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) + (whenFallback ? ` (${whenFallback})` : "")
      : whenFallback;
    const whenText = whenDisplay;
    const whenProvided = !!(whenIso || whenFallback);
    const where = String(form.get("where") || "").trim();
    const why = String(form.get("why") || "").trim();
    const mediaUrl = String(form.get("mediaUrl") || "").trim();

    const ownership = form.get("ownership") === "true";
    const rights = form.get("rights") === "true";

    // Required fields
    if (!headline || !what || !whenProvided || !where) {
      return NextResponse.json(
        { error: "Please fill in headline, what happened, when, and where." },
        { status: 400 }
      );
    }
    if (!anonymous && (!name || !email)) {
      return NextResponse.json(
        { error: "Please provide your name and email, or choose anonymous." },
        { status: 400 }
      );
    }
    if (!ownership || !rights) {
      return NextResponse.json(
        { error: "Please confirm the ownership and usage-rights checkboxes." },
        { status: 400 }
      );
    }

    // Optional file attachment
    const file = form.get("attachment");
    let attachmentData: { filename: string; content: Buffer } | null = null;

    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const f = file as File;
      if (f.size > 0) {
        if (f.size > MAX_FILE_BYTES) {
          return NextResponse.json(
            { error: "Attachment is larger than 10 MB. For videos, please paste a link instead." },
            { status: 413 }
          );
        }
        const buf = Buffer.from(await f.arrayBuffer());
        attachmentData = { filename: f.name || "attachment", content: buf };
      }
    }

    const resend = new Resend(apiKey);

    const submitterLine = anonymous
      ? "Anonymous submitter"
      : `${name}${email ? ` &lt;${escapeHtml(email)}&gt;` : ""}${phone ? ` &middot; ${escapeHtml(phone)}` : ""}`;

    const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#222;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;"><tr><td align="center">
    <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(15,26,46,0.08);">
      <tr><td style="background:#0f1a2e;padding:20px 28px;">
        <div style="color:#c9a84c;font-size:11px;letter-spacing:2px;font-weight:700;">NEW TIP SUBMISSION</div>
        <div style="color:#ffffff;font-size:20px;font-weight:900;margin-top:4px;">${escapeHtml(headline)}</div>
      </td></tr>
      <tr><td style="padding:20px 28px;">
        <div style="font-size:13px;color:#666;margin-bottom:16px;"><strong>From:</strong> ${submitterLine}</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;font-size:14px;line-height:1.5;">
          ${row("What", what)}
          ${row("Who", who)}
          ${row("When", whenText)}
          ${row("Where", where)}
          ${row("Why", why)}
          ${row("Media URL", mediaUrl)}
        </table>
        <p style="font-size:12px;color:#666;margin:16px 0 0;">
          Ownership confirmed: ${ownership ? "YES" : "NO"} &middot; Usage rights agreed: ${rights ? "YES" : "NO"}
          ${attachmentData ? ` &middot; Attachment: ${escapeHtml(attachmentData.filename)} (${Math.round(attachmentData.content.length / 1024)} KB)` : ""}
        </p>
      </td></tr>
      <tr><td style="background:#0a1220;color:#8a9ab5;font-size:11px;padding:14px 28px;text-align:center;">
        Submitted via flintpoliceops.com/submit
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

    const textLines = [
      `NEW TIP: ${headline}`,
      ``,
      `From: ${anonymous ? "Anonymous" : `${name} <${email}>${phone ? ` / ${phone}` : ""}`}`,
      ``,
      `What: ${what}`,
      who ? `Who: ${who}` : "",
      `When: ${whenText}`,
      `Where: ${where}`,
      why ? `Why: ${why}` : "",
      mediaUrl ? `Media URL: ${mediaUrl}` : "",
      ``,
      `Ownership confirmed: ${ownership ? "YES" : "NO"}`,
      `Usage rights agreed: ${rights ? "YES" : "NO"}`,
      attachmentData ? `Attachment: ${attachmentData.filename}` : "",
    ].filter(Boolean).join("\n");

    const sendPayload: Parameters<typeof resend.emails.send>[0] = {
      from: FROM_ADDRESS,
      to: TIPS_EMAIL,
      replyTo: !anonymous && email ? email : undefined,
      subject: `[FPO Tip] ${headline}`,
      html,
      text: textLines,
    };

    if (attachmentData) {
      sendPayload.attachments = [
        { filename: attachmentData.filename, content: attachmentData.content },
      ];
    }

    const sendResult = await resend.emails.send(sendPayload);
    if (sendResult.error) {
      console.error("Resend emails.send error:", sendResult.error);
      return NextResponse.json(
        { error: "Couldn't send your submission. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
