import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, CreditCard, Mail, MessageSquare, Phone, Send, UserRound } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client.js";
import NavBar from "../components/NavBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const fallbackCourse = {
  id: "product-management-ai",
  title: "Product Management + AI",
  price: 25000,
  currency: "NGN",
  status: "active",
  duration: "4-hour intensive sprint",
  description: "Secure your seat for the Product Management with AI intensive sprint."
};

const included = ["Pay online or bank transfer", "Live and recorded session", "AI lab access and mentorship", "Completion certificate"];

function phoneIsValid(phone) {
  const normalized = phone.trim();
  const digitCount = normalized.replace(/\D/g, "").length;

  return /^\+?[0-9][0-9\s().-]{7,19}$/.test(normalized) && digitCount >= 8 && digitCount <= 15;
}

export default function EnrollmentPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([fallbackCourse]);
  const [courseId, setCourseId] = useState(searchParams.get("course") || fallbackCourse.id);
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/courses")
      .then(({ data }) => {
        const activeCourses = data.courses.filter((course) => course.status === "active");
        setCourses(activeCourses.length ? activeCourses : [fallbackCourse]);
      })
      .catch(() => setCourses([fallbackCourse]));
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === courseId) || courses[0] || fallbackCourse,
    [courseId, courses]
  );
  const showPhoneError = phoneTouched && !phoneIsValid(phone);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setPhoneTouched(true);

    if (!phoneIsValid(phone)) {
      setErrorMessage("Please enter a valid phone number with 8 to 15 digits.");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post("/payments/checkout", { courseId: selectedCourse.id, phone: phone.trim() });
      setMessage("Enrollment started. Redirecting to Stripe checkout...");
      window.location.href = data.checkoutUrl;
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Checkout is unavailable. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[radial-gradient(circle_at_86%_76%,rgba(124,58,237,0.25),transparent_30rem),linear-gradient(115deg,#07101f_0%,#10101f_52%,#1d1632_100%)] px-4 py-12 text-slate-100 sm:px-6">
        <section className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-normal text-indigo-300 sm:text-5xl">Secure Your Spot</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-6 text-slate-400 sm:text-base">
              Join the Product Management with AI intensive sprint. Limited seats available.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 grid max-w-6xl gap-8 rounded-[28px] border border-white/10 bg-[#09111f]/80 px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur lg:grid-cols-[0.9fr_1.8fr] lg:px-10"
          >
            <aside>
              <h2 className="flex items-center gap-2 text-2xl font-black text-white">
                <Send className="size-7 fill-slate-100 text-slate-100" aria-hidden="true" />
                Enrollment Form
              </h2>
              <p className="mt-5 text-sm font-semibold leading-6 text-slate-400">
                Fill out the form to register. You will receive payment instructions and confirmation within 12 hours.
              </p>

              <ul className="mt-6 space-y-4 text-sm font-bold text-slate-200">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-violet-300" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/25 p-6 text-center">
                <BookOpen className="mx-auto size-8 text-violet-200" aria-hidden="true" />
                <p className="mt-4 text-sm font-black text-white">{selectedCourse.title}</p>
                <p className="mt-3 text-3xl font-black text-white">NGN {selectedCourse.price?.toLocaleString()}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">{selectedCourse.duration}</p>
              </div>
            </aside>

            <div className="grid content-start gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                  <UserRound size={14} aria-hidden="true" />
                  Full name *
                </span>
                <input
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-indigo-300/30 bg-[#0b1220] px-4 text-sm text-slate-300 outline-none placeholder:text-slate-500"
                  name="name"
                  type="text"
                  value={user?.name || ""}
                  placeholder="e.g., Chiamaka Okafor"
                  readOnly
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                  <Mail size={14} aria-hidden="true" />
                  Email address *
                </span>
                <input
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-indigo-300/30 bg-[#0b1220] px-4 text-sm text-slate-300 outline-none placeholder:text-slate-500"
                  name="email"
                  type="email"
                  value={user?.email || ""}
                  placeholder="hello@example.com"
                  readOnly
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                  <Phone size={14} aria-hidden="true" />
                  Phone / WhatsApp *
                </span>
                <input
                  className="h-12 w-full rounded-xl border border-indigo-300/45 bg-[#050914] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/30"
                  name="phone"
                  type="tel"
                  value={phone}
                  onBlur={() => setPhoneTouched(true)}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="tel"
                  maxLength={22}
                  pattern="^\+?[0-9][0-9\s().-]{7,19}$"
                  placeholder="+234 904 120 7221"
                  aria-invalid={showPhoneError}
                  required
                />
                {showPhoneError && (
                  <p className="mt-2 text-xs font-semibold text-red-300">
                    Enter a valid phone number with 8 to 15 digits.
                  </p>
                )}
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                  <BookOpen size={14} aria-hidden="true" />
                  Select program *
                </span>
                <select
                  className="h-12 w-full rounded-xl border border-indigo-300/45 bg-[#050914] px-4 text-sm font-semibold text-white outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/30"
                  name="course"
                  value={selectedCourse.id}
                  onChange={(event) => setCourseId(event.target.value)}
                  required
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-300">
                  <MessageSquare size={14} aria-hidden="true" />
                  Additional message
                </span>
                <textarea
                  className="min-h-28 w-full resize-y rounded-xl border border-indigo-300/45 bg-[#050914] px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/30"
                  name="message"
                  placeholder="Any questions about schedule, payment, or syllabus..."
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 text-sm font-black text-white shadow-[0_14px_34px_rgba(99,102,241,0.35)] transition hover:from-blue-400 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-[#09111f] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
              >
                <CreditCard className="size-4" aria-hidden="true" />
                {submitting ? "Starting checkout..." : "Register Now"}
              </button>

              {message && <p className="text-center text-sm font-semibold text-indigo-200 sm:col-span-2">{message}</p>}
              {errorMessage && <p className="text-center text-sm font-semibold text-red-300 sm:col-span-2">{errorMessage}</p>}
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
