import { useEffect, useState } from "react";
import { BookOpenCheck, CreditCard, Gauge, RefreshCw } from "lucide-react";
import NavBar from "../components/NavBar.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then(({ data }) => {
        setDashboard(data);
        setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, [setUser]);

  async function updateProgress(courseId, progress) {
    setMessage("");
    const { data } = await api.patch(`/dashboard/progress/${courseId}`, { progress });
    setUser(data.user);
    setDashboard((current) => ({
      ...current,
      user: data.user,
      stats: {
        ...current.stats,
        averageProgress: Math.round(
          data.user.enrolledCourses.reduce((sum, course) => sum + course.progress, 0) /
            Math.max(data.user.enrolledCourses.length, 1)
        )
      }
    }));
    setMessage("Progress updated.");
  }

  const displayUser = dashboard?.user || user;
  const enrollments = displayUser?.enrolledCourses || [];

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan">Student dashboard</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Hello, {displayUser?.name || "student"}
            </h1>
            <p className="mt-2 text-slate-400">Track enrollment, billing, and your course momentum.</p>
          </div>
          <button type="button" onClick={() => window.location.reload()} className="btn-secondary w-fit">
            <RefreshCw size={18} aria-hidden="true" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-lg border border-white/10 bg-panel p-6 text-slate-300">Loading dashboard...</div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Enrolled",
                  value: dashboard?.stats.enrolledCount || 0,
                  icon: <BookOpenCheck className="text-cyan" size={23} aria-hidden="true" />
                },
                {
                  label: "Paid courses",
                  value: dashboard?.stats.paidCount || 0,
                  icon: <CreditCard className="text-cyan" size={23} aria-hidden="true" />
                },
                {
                  label: "Avg progress",
                  value: `${dashboard?.stats.averageProgress || 0}%`,
                  icon: <Gauge className="text-cyan" size={23} aria-hidden="true" />
                }
              ].map(({ label, value, icon }) => (
                <div key={label} className="rounded-lg border border-white/10 bg-panel/80 p-5">
                  {icon}
                  <p className="mt-4 text-sm text-slate-400">{label}</p>
                  <p className="mt-1 text-3xl font-black text-white">{value}</p>
                </div>
              ))}
            </section>

            <section className="mt-8 rounded-lg border border-white/10 bg-panel/75 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">My courses</h2>
                {message ? <p className="text-sm text-mint">{message}</p> : null}
              </div>

              {enrollments.length ? (
                <div className="mt-5 space-y-4">
                  {enrollments.map((course) => (
                    <article key={course.courseId} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="font-bold text-white">{course.courseTitle}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            Billing:{" "}
                            <span className={course.paymentStatus === "paid" ? "text-mint" : "text-amber-300"}>
                              {course.paymentStatus}
                            </span>
                          </p>
                        </div>
                        <span className="rounded-lg bg-cyan/10 px-3 py-2 text-sm font-bold text-cyan">
                          {course.progress}% complete
                        </span>
                      </div>
                      <div className="mt-4">
                        <input
                          aria-label={`Progress for ${course.courseTitle}`}
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={course.progress}
                          onChange={(event) => updateProgress(course.courseId, Number(event.target.value))}
                          className="w-full accent-cyan"
                        />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-lg border border-dashed border-white/15 p-6 text-slate-300">
                  No enrolled courses yet. Start from the Product Management + AI checkout on the landing page.
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
