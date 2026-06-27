import { useState } from "react";
import { Mail, MessageCircle, Phone, Send, Tag, UserRound } from "lucide-react";

const subjectOptions = ["General inquiry", "Course support", "Payment question", "Partnership", "Other"];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_84%_66%,rgba(124,58,237,0.25),transparent_28rem),linear-gradient(115deg,#07101f_0%,#10101f_52%,#1d1632_100%)] px-4 py-10 text-slate-100 sm:px-6">
      <section className="mx-auto flex max-w-5xl flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-normal text-indigo-300 sm:text-5xl">Get In Touch</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-6 text-slate-400 sm:text-base">
            Have questions? Send us a message and we'll respond within 24 hours.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 w-full max-w-[740px] rounded-[28px] border border-white/10 bg-[#09111f]/80 px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur sm:px-10"
        >
          <h2 className="mb-7 flex items-center justify-center gap-2 text-2xl font-black text-slate-100">
            <Send className="size-7 fill-slate-100 text-slate-100" aria-hidden="true" />
            Send us a Message
          </h2>

          <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                <UserRound size={14} aria-hidden="true" />
                Full Name *
              </span>
              <input
                className="h-12 w-full rounded-xl border border-indigo-300/45 bg-[#050914] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/30"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                <Mail size={14} aria-hidden="true" />
                Email Address *
              </span>
              <input
                className="h-12 w-full rounded-xl border border-indigo-300/45 bg-[#050914] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/30"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                <Phone size={14} aria-hidden="true" />
                Phone Number
              </span>
              <input
                className="h-12 w-full rounded-xl border border-indigo-300/45 bg-[#050914] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/30"
                name="phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                <Tag size={14} aria-hidden="true" />
                Subject *
              </span>
              <select
                className="h-12 w-full rounded-xl border border-indigo-300/45 bg-[#050914] px-4 text-sm font-semibold text-white outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/30"
                name="subject"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select a subject
                </option>
                {subjectOptions.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-3 block">
            <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
              <MessageCircle size={14} aria-hidden="true" />
              Message *
            </span>
            <textarea
              className="min-h-32 w-full resize-y rounded-xl border border-indigo-300/45 bg-[#050914] px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/30"
              name="message"
              placeholder="Please describe your question or message in detail..."
              required
            />
          </label>

          <button
            type="submit"
            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 text-sm font-black text-white shadow-[0_14px_34px_rgba(99,102,241,0.35)] transition hover:from-blue-400 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-[#09111f]"
          >
            <Send className="size-4 fill-white text-white" aria-hidden="true" />
            Send Message
          </button>

          {submitted && (
            <p className="mt-4 text-center text-sm font-semibold text-indigo-200">
              Thanks for reaching out. Your message is ready to be connected to the backend.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
