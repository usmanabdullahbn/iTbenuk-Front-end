import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, PlayCircle, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const fallbackModules = [
  {
    title: "Course welcome",
    description: "Start here for the course overview, learning path, and required resources.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    pdf: "Course-welcome-pack.pdf",
    resources: ["Learning schedule", "Community access guide"]
  }
];

export default function CourseContentPage() {
  const { courseId } = useParams();
  const { user, setUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      try {
        const [{ data: dashboardData }, { data: courseData }] = await Promise.all([
          api.get("/dashboard"),
          api.get("/courses")
        ]);

        if (!active) return;

        const nextEnrollment = dashboardData.user.enrolledCourses.find((item) => item.courseId === courseId);
        const nextCourse = courseData.courses.find((item) => item.id === courseId);

        setUser(dashboardData.user);
        setEnrollment(nextEnrollment || null);
        setCourse(nextCourse || null);
      } catch {
        if (active) {
          setError("We could not load this course right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      active = false;
    };
  }, [courseId, setUser]);

  const displayEnrollment = useMemo(
    () => enrollment || user?.enrolledCourses?.find((item) => item.courseId === courseId),
    [courseId, enrollment, user]
  );
  const modules = course?.modules?.length ? course.modules : fallbackModules;

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link to="/dashboard" className="btn-secondary w-fit px-4">
          <ArrowLeft size={18} aria-hidden="true" />
          Dashboard
        </Link>

        {loading ? (
          <div className="mt-6 rounded-lg border border-white/10 bg-panel p-6 text-slate-300">Loading course...</div>
        ) : error ? (
          <div className="mt-6 rounded-lg border border-red-300/20 bg-red-400/10 p-6 text-red-100">{error}</div>
        ) : !displayEnrollment ? (
          <section className="mt-6 rounded-lg border border-white/10 bg-panel p-6">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan">Course access</p>
            <h1 className="mt-3 text-3xl font-black text-white">Subscription required</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              This course content opens after you subscribe from the enrollment page.
            </p>
            <Link to={`/enrollment?course=${courseId}`} className="btn-primary mt-6 w-fit">
              Subscribe now
            </Link>
          </section>
        ) : (
          <>
            <section className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-lg border border-white/10 bg-panel/80 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan">Course content</p>
                <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  {course?.title || displayEnrollment.courseTitle}
                </h1>
                <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                  {course?.description || "Your subscribed course materials are ready."}
                </p>
              </div>

              <aside className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-300">Progress</span>
                  <span className="rounded-lg bg-cyan/10 px-3 py-2 text-sm font-bold text-cyan">
                    {displayEnrollment.progress}% complete
                  </span>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan"
                    style={{ width: `${displayEnrollment.progress}%` }}
                  />
                </div>
                <p className="mt-5 text-sm text-slate-400">
                  Billing:{" "}
                  <span className={displayEnrollment.paymentStatus === "paid" ? "text-mint" : "text-amber-300"}>
                    {displayEnrollment.paymentStatus}
                  </span>
                </p>
              </aside>
            </section>

            <section className="mt-8 grid gap-5">
              {modules.map((module, index) => (
                <article key={module.title} className="rounded-lg border border-white/10 bg-panel/75 p-5">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div>
                      <p className="text-sm font-bold text-cyan">Module {index + 1}</p>
                      <h2 className="mt-2 text-2xl font-black text-white">{module.title}</h2>
                      <p className="mt-2 max-w-3xl leading-7 text-slate-300">{module.description}</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-mint/10 px-3 py-2 text-sm font-bold text-mint">
                      <CheckCircle2 size={17} aria-hidden="true" />
                      Available
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
                      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm font-bold text-white">
                        <PlayCircle size={18} className="text-cyan" aria-hidden="true" />
                        Video lesson
                      </div>
                      <iframe
                        title={`${module.title} video`}
                        src={module.video}
                        className="aspect-video w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <FileText size={18} className="text-cyan" aria-hidden="true" />
                          PDF material
                        </div>
                        <p className="mt-3 text-sm text-slate-300">{module.pdf}</p>
                        <p className="mt-4 rounded-lg border border-white/10 bg-ink/60 p-3 text-sm leading-6 text-slate-300">
                          Use this handout with the video lesson to capture notes, complete exercises, and prepare
                          your portfolio task.
                        </p>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <BookOpen size={18} className="text-cyan" aria-hidden="true" />
                          Resources
                        </div>
                        <div className="mt-3 space-y-2">
                          {(module.resources || []).map((resource) => (
                            <p key={resource} className="flex items-center gap-2 text-sm text-slate-300">
                              <Sparkles size={15} className="text-mint" aria-hidden="true" />
                              {resource}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </main>
    </>
  );
}
