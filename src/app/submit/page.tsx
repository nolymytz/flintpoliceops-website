"use client";

import { useState, useRef } from "react";
import NewsletterSignup from "@/components/NewsletterSignup";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_FILE_MB = 10;

export default function SubmitPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileError("");
    if (!f) { setFileName(""); return; }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File is too large. Max ${MAX_FILE_MB} MB. For videos, paste a link in the Media URL field instead.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFileName("");
      return;
    }
    setFileName(f.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setErrorMessage("");
    setStatus("submitting");

    try {
      const fd = new FormData(e.currentTarget);
      fd.set("anonymous", anonymous ? "true" : "false");
      fd.set("ownership", (fd.get("ownership") ? "true" : "false"));
      fd.set("rights", (fd.get("rights") ? "true" : "false"));

      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      formRef.current?.reset();
      setFileName("");
      setAnonymous(false);
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div>
        <section className="text-white" style={{ backgroundColor: '#0f1a2e' }}>
          <div className="max-w-7xl mx-auto px-4 py-10 text-center">
            <h1 className="text-3xl font-black mb-2">Submit to Flint Police Ops</h1>
            <p style={{ color: '#8a9ab5' }} className="max-w-xl mx-auto">This is YOUR community platform.</p>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: '#f0ead6', border: '1px solid #d4c68a' }}>
            <div className="text-5xl mb-3" style={{ color: '#c9a84c' }}>✓</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#0f1a2e' }}>Thanks for your submission.</h2>
            <p className="mb-6" style={{ color: '#5a5340' }}>
              We received your tip and our team will review it. We can&apos;t guarantee we&apos;ll publish every submission, but every one gets looked at. If we need more info, we&apos;ll reach out.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="inline-block text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: '#c9a84c' }}
            >
              Submit Another Tip
            </button>
          </div>
        </div>
        <NewsletterSignup variant="banner" />
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-60";
  const labelClass = "block text-sm font-semibold mb-1.5";
  const labelStyle = { color: '#0f1a2e' as string };
  const submitting = status === "submitting";

  return (
    <div>
      <section className="text-white" style={{ backgroundColor: '#0f1a2e' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-black mb-2">Submit a News Story or Video</h1>
          <p style={{ color: '#8a9ab5' }} className="max-w-xl mx-auto">
            See something newsworthy in Flint? Send it our way. Every tip helps keep the community informed.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Contact block */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-3" style={labelStyle}>Your Contact Info</h2>

            <label className="flex items-start gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="mt-0.5"
                disabled={submitting}
              />
              <span className="text-sm" style={{ color: '#444' }}>
                <strong>Submit anonymously.</strong> We won&apos;t be able to follow up or credit you.
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={labelStyle}>Name {!anonymous && <span style={{ color: '#b91c1c' }}>*</span>}</label>
                <input name="name" type="text" required={!anonymous} disabled={anonymous || submitting} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Email {!anonymous && <span style={{ color: '#b91c1c' }}>*</span>}</label>
                <input name="email" type="email" required={!anonymous} disabled={anonymous || submitting} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} style={labelStyle}>Phone (optional)</label>
                <input name="phone" type="tel" disabled={anonymous || submitting} className={inputClass} placeholder="So we can call if we have questions" />
              </div>
            </div>
          </div>

          {/* Story block: 5 Ws */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-1" style={labelStyle}>The Story &mdash; The 5 Ws</h2>
            <p className="text-sm mb-4" style={{ color: '#666' }}>Tell us the basics. Don&apos;t worry about writing perfectly — we just need the facts.</p>

            <div className="space-y-4">
              <div>
                <label className={labelClass} style={labelStyle}>Headline <span style={{ color: '#b91c1c' }}>*</span></label>
                <input name="headline" type="text" required disabled={submitting} className={inputClass} placeholder="Short summary of what happened" maxLength={140} />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>What happened? <span style={{ color: '#b91c1c' }}>*</span></label>
                <textarea name="what" required disabled={submitting} rows={4} className={inputClass} placeholder="Describe what you saw or what the story is about." />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Who was involved?</label>
                <input name="who" type="text" disabled={submitting} className={inputClass} placeholder="Names, agencies, businesses, groups (if known)" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} style={labelStyle}>When did it happen? <span style={{ color: '#b91c1c' }}>*</span></label>
                  <input name="when" type="text" required disabled={submitting} className={inputClass} placeholder="Date and approximate time" />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Where did it happen? <span style={{ color: '#b91c1c' }}>*</span></label>
                  <input name="where" type="text" required disabled={submitting} className={inputClass} placeholder="Street, intersection, or neighborhood" />
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Why does it matter?</label>
                <textarea name="why" disabled={submitting} rows={3} className={inputClass} placeholder="Any context — why Flint residents should care or what makes this important." />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="rounded-xl p-5 bg-white border border-gray-200">
            <h2 className="font-bold mb-1" style={labelStyle}>Photo or Video</h2>
            <p className="text-sm mb-4" style={{ color: '#666' }}>
              Upload a photo or short video (max {MAX_FILE_MB} MB). For larger videos, paste a link to the file on Google Drive, Dropbox, or YouTube below.
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelClass} style={labelStyle}>Upload file</label>
                <input
                  ref={fileInputRef}
                  name="attachment"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={submitting}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer disabled:opacity-60"
                  style={{ }}
                />
                <style jsx>{`
                  input[type="file"]::file-selector-button { background-color: #0f1a2e; }
                  input[type="file"]::file-selector-button:hover { background-color: #1a2744; }
                `}</style>
                {fileName && !fileError && (
                  <p className="text-xs mt-2" style={{ color: '#0f1a2e' }}>Selected: {fileName}</p>
                )}
                {fileError && (
                  <p className="text-xs mt-2" style={{ color: '#b91c1c' }}>{fileError}</p>
                )}
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Or paste a media URL</label>
                <input name="mediaUrl" type="url" disabled={submitting} className={inputClass} placeholder="https://drive.google.com/... or https://youtu.be/..." />
              </div>
            </div>
          </div>

          {/* Confirmations */}
          <div className="rounded-xl p-5" style={{ backgroundColor: '#f0ead6', border: '1px solid #d4c68a' }}>
            <h2 className="font-bold mb-3" style={labelStyle}>Ownership &amp; Usage Rights</h2>

            <p className="text-sm mb-4" style={{ color: '#5a5340' }}>
              Flint Police Ops may use what you submit — in whole or in part — on our website, in our newsletter, on our social channels, or in future reporting. You keep ownership of your content, but by submitting you grant us a non-exclusive, royalty-free license to publish and share it. We may credit you by name, by first name, or keep your submission anonymous depending on the context. <strong>We don&apos;t guarantee that your submission will be posted</strong> — our editors review everything and publish at their discretion. Please do not submit anything you did not personally capture or have permission to share.
            </p>

            <label className="flex items-start gap-2 mb-3 cursor-pointer">
              <input name="ownership" type="checkbox" required disabled={submitting} className="mt-1" />
              <span className="text-sm" style={{ color: '#3a3a2f' }}>
                <strong>I took this photo/video myself</strong>, or I have the rights and permission from the person who did to submit it to Flint Police Ops.
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input name="rights" type="checkbox" required disabled={submitting} className="mt-1" />
              <span className="text-sm" style={{ color: '#3a3a2f' }}>
                <strong>I agree</strong> that Flint Police Ops may publish, edit, or share what I submit, and I understand there is no guarantee my submission will be posted.
              </span>
            </label>
          </div>

          {status === "error" && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#fee', color: '#b91c1c', border: '1px solid #fcc' }}>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-white font-bold py-3.5 rounded-lg text-base transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#c9a84c' }}
          >
            {submitting ? "Submitting…" : "Submit to Flint Police Ops"}
          </button>

          <p className="text-xs text-center" style={{ color: '#666' }}>
            Your submission goes straight to our editors. We&apos;ll reach out if we need more info.
          </p>
        </form>
      </div>

      <NewsletterSignup variant="banner" />
    </div>
  );
}
