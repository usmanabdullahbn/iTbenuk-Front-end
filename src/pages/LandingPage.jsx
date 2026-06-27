import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Clock, CreditCard, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import NavBar from "../components/NavBar.jsx";
import LeadCapture from "../components/LeadCapture.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const fallbackCourses = [
  {
    id: "product-management-ai",
    title: "Product Management + AI",
    price: 25000,
    currency: "NGN",
    status: "active",
    duration: "6 weeks",
    level: "Beginner to intermediate",
    description:
      "Learn product strategy, discovery, roadmapping, AI workflows, and portfolio-ready product thinking.",
    outcomes: ["AI-assisted product discovery", "Roadmaps and PRDs", "Launch metrics", "Portfolio project"]
  },
  { id: "web-development", title: "Web Development", status: "coming-soon" },
  { id: "data-analysis", title: "Data Analysis", status: "coming-soon" },
  { id: "research-writing", title: "Research Writing", status: "coming-soon" }
];

export default function LandingPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState(fallbackCourses);
  const activeCourse = courses.find((course) => course.status === "active") || fallbackCourses[0];
  const comingSoon = courses.filter((course) => course.status === "coming-soon");

  useEffect(() => {
    api
      .get("/courses")
      .then(({ data }) => setCourses(data.courses))
      .catch(() => setCourses(fallbackCourses));
  }, []);

  return (
    <>
      <NavBar />
      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan">
              <Sparkles size={16} aria-hidden="true" />
              AI-powered career learning
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Where humans & AI build the future
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Learn practical product, technology, and research skills through affordable cohorts designed for modern
              African builders.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/enrollment" className="btn-primary">
                <CreditCard size={18} aria-hidden="true" />
                Enroll for ₦25,000
              </Link>
              {!token && (
                <Link to="/login" className="btn-secondary">
                  Student login
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-panel/80 p-5 shadow-glow">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-lg bg-mint/15 px-3 py-2 text-sm font-bold text-mint">Active cohort</span>
              <span className="text-sm text-slate-400">{activeCourse.duration}</span>
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">{activeCourse.title}</h2>
            <p className="mt-3 leading-7 text-slate-300">{activeCourse.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(activeCourse.outcomes || []).map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg bg-white/5 p-3 text-sm text-slate-200">
                  <BadgeCheck className="mt-0.5 shrink-0 text-mint" size={17} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 p-4">
                <p className="text-sm text-slate-400">Price</p>
                <p className="mt-1 text-2xl font-black text-white">₦{activeCourse.price?.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-white/10 p-4">
                <p className="text-sm text-slate-400">Level</p>
                <p className="mt-1 text-sm font-bold text-white">{activeCourse.level}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
            {[
              {
                title: "Hands-on projects",
                text: "Build evidence of skill, not just notes.",
                icon: <TrendingUp className="text-cyan" size={22} aria-hidden="true" />
              },
              {
                title: "Mobile-friendly",
                text: "Optimized for learners on every screen.",
                icon: <Sparkles className="text-cyan" size={22} aria-hidden="true" />
              },
              {
                title: "Secure billing",
                text: "Hosted checkout and webhook verification.",
                icon: <CreditCard className="text-cyan" size={22} aria-hidden="true" />
              }
            ].map(({ title, text, icon }) => (
              <div key={title} className="rounded-lg border border-white/10 bg-ink/45 p-5">
                {icon}
                <h3 className="mt-4 font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan">Coming soon</p>
              <h2 className="mt-3 text-3xl font-black text-white">Join the waitlist</h2>
            </div>
            <Clock className="hidden text-mint sm:block" size={34} aria-hidden="true" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {comingSoon.map((course) => (
              <article key={course.id} className="rounded-lg border border-white/10 bg-panel/70 p-5">
                <h3 className="text-xl font-bold text-white">{course.title}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{course.description}</p>
                <LeadCapture course={course} />
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
