import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 30;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      event_name,
      category,
      start_date,
      start_time,
      end_date,
      end_time,
      venue,
      address,
      city,
      description,
      website,
      ticket_url,
      cost,
      contact_name,
      contact_email,
      contact_phone,
    } = body;

    // Validate required fields
    if (!event_name || !category || !start_date || !venue || !description || !contact_name || !contact_email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Save to Supabase
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: inserted, error: dbError } = await supabase
      .from("submitted_events")
      .insert({
        event_name,
        category,
        start_date,
        start_time: start_time || null,
        end_date: end_date || null,
        end_time: end_time || null,
        venue,
        address: address || null,
        city: city || "Flint",
        description,
        website: website || null,
        ticket_url: ticket_url || null,
        cost: cost || null,
        contact_name,
        contact_email,
        contact_phone: contact_phone || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
    }

    const submissionId = inserted?.id;

    // Send Telegram notification
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const startDisplay = start_time
        ? `${start_date} at ${start_time}`
        : start_date;
      const endDisplay = end_date
        ? end_time ? `${end_date} at ${end_time}` : end_date
        : "";

      const lines = [
        `📅 *New Event Submission*`,
        ``,
        `*${event_name}*`,
        `📁 ${category}`,
        `📆 ${startDisplay}${endDisplay ? ` → ${endDisplay}` : ""}`,
        `📍 ${venue}${address ? `, ${address}` : ""}${city ? `, ${city}` : ""}`,
        ``,
        `${description.slice(0, 300)}${description.length > 300 ? "…" : ""}`,
        ``,
        cost ? `💰 ${cost}` : "",
        website ? `🔗 ${website}` : "",
        ticket_url ? `🎟 ${ticket_url}` : "",
        ``,
        `👤 Submitted by: ${contact_name} (${contact_email}${contact_phone ? `, ${contact_phone}` : ""})`,
      ]
        .filter((l) => l !== "")
        .join("\n");

      const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: lines,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Approve", callback_data: `approve_event_${submissionId}` },
                { text: "❌ Reject", callback_data: `reject_event_${submissionId}` },
              ],
            ],
          },
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit-event error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
