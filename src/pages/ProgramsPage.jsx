import { useEffect, useState } from "react";
import { BarChart3, BookOpen, CheckCircle2, Code2, Cpu, Lock, PenLine, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import NavBar from "../components/NavBar.jsx";

const fallbackCourses = [
  {
    id: "product-management-ai",
    title: "Product Management + AI",
    price: 25000,
    currency: "NGN",
    status: "active",
    duration: "4-hour intensive sprint",
    level: "Beginner to intermediate",
    description:
      "AI-assisted roadmaps, PRDs, discovery, and practical product workflows for modern builders.",
    outcomes: [
      "AI-assisted roadmaps & PRDs",
      "Product discovery and ideation",
      "Portfolio-ready product artefact",
      "Live guidance and recording access"
    ]
  },
  {
    id: "web-development",
    title: "Web Development",
    status: "coming-soon",
    duration: "4-week intensive",
    description: "HTML, CSS, JavaScript, React, backend APIs, deployment, and debugging.",
    outcomes: ["Frontend foundations", "Responsive interfaces", "Backend APIs", "Deployment basics"]
  },
  {
    id: "data-analysis",
    title: "Data Analysis",
    status: "coming-soon",
    duration: "4-week intensive",
    description: "Python, SQL, spreadsheets, dashboards, charts, and business data storytelling.",
    outcomes: ["Python for analysis", "SQL for data extraction", "Dashboards", "Business storytelling"]
  },
  {
    id: "research-writing",
    title: "Research Writing",
    status: "coming-soon",
    duration: "4-week intensive",
    description: "Academic writing, literature reviews, research structure, citations, and AI support.",
    outcomes: ["Research structure", "Literature review mastery", "Citation workflows", "Publication-ready manuscript"]
  }
];

const icons = {
  "product-management-ai": Cpu,
  "web-development": Code2,
  "data-analysis": BarChart3,
  "research-writing": BookOpen
};

export default function ProgramsPage() {
  const [courses, setCourses] = useState(fallbackCourses);

  useEffect(() => {
    api
      .get("/courses")
      .then(({ data }) => {
        const courseMap = new Map(fallbackCourses.map((course) => [course.id, course]));
        setCourses(
          data.courses.map((course) => ({
            ...courseMap.get(course.id),
            ...course,
            outcomes: course.outcomes || courseMap.get(course.id)?.outcomes || []
          }))
        );
      })
      .catch(() => setCourses(fallbackCourses));
  }, []);

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[radial-gradient(circle_at_18%_8%,rgba(79,70,229,0.22),transparent_28rem),linear-gradient(120deg,#07101f_0%,#10101f_54%,#1d1632_100%)] px-4 py-12 text-slate-100 sm:px-6">
        <section className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-violet-200">
              <Sparkles size={15} aria-hidden="true" />
              Choose your path
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-normal text-indigo-300 sm:text-5xl">Our Programs</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-400">
              Empowering your career with focused tech, AI, and research skills.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {courses.map((course) => {
              const Icon = icons[course.id] || PenLine;
              const active = course.status === "active";

              return (
                <article
                  key={course.id}
                  className={`flex min-h-[520px] flex-col rounded-2xl border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] ${
                    active
                      ? "border-violet-400/70 bg-[#111a36]/90"
                      : "border-white/10 bg-[#0d1729]/85"
                  }`}
                >
                  <div className="flex justify-center">
                    <span className="grid size-12 place-items-center rounded-xl bg-white/8 text-slate-100">
                      <Icon size={28} aria-hidden="true" />
                    </span>
                  </div>

                  <h2 className="mt-6 min-h-14 text-center text-xl font-black leading-tight text-white">
                    {course.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-black text-amber-300">
                      {active ? "Active" : "Coming Soon"}
                    </span>
                    <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs font-bold text-blue-200">
                      {course.duration || "4-week intensive"}
                    </span>
                  </div>

                  {active ? (
                    <div className="mt-6 text-center">
                      <p className="text-3xl font-black text-white">NGN {course.price?.toLocaleString()}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{course.duration}</p>
                    </div>
                  ) : (
                    <p className="mt-8 text-center text-2xl font-black text-white">Coming Soon</p>
                  )}

                  <ul className="mt-7 flex-1 space-y-3 text-sm font-semibold leading-6 text-slate-300">
                    {(course.outcomes || []).map((outcome) => (
                      <li key={outcome} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 size-4 shrink-0 text-violet-300" aria-hidden="true" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  {active ? (
                    <Link
                      to={`/enrollment?course=${course.id}`}
                      className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-5 text-sm font-black text-white shadow-[0_16px_34px_rgba(99,102,241,0.35)] transition hover:from-blue-400 hover:to-violet-500"
                    >
                      Enroll now
                      <span className="text-xs">NGN {course.price?.toLocaleString()}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-black text-slate-400"
                    >
                      <Lock size={16} aria-hidden="true" />
                      Notify me soon
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
