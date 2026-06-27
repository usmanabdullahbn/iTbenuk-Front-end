import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AuthForm({
  title,
  subtitle,
  formik,
  submitLabel,
  alternate,
  errorMessage,
  onGoogle,
  googleLoading = false,
  nameField = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl place-items-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-panel/85 p-6 shadow-glow sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan">iTbenuk</p>
          <h1 className="mt-3 text-3xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>

        {errorMessage ? (
          <div className="mb-5 flex gap-3 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
            <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {nameField ? (
            <div className="space-y-2">
              <label htmlFor="name" className="label">
                Full name
              </label>
              <input
                id="name"
                name="name"
                className="field"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="name"
              />
              {formik.touched.name && formik.errors.name ? <p className="error">{formik.errors.name}</p> : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="email" className="label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="field"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="email"
              inputMode="email"
            />
            {formik.touched.email && formik.errors.email ? <p className="error">{formik.errors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="field pr-12"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete={nameField ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-slate-400 transition hover:text-cyan focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan/60"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <p className="error">{formik.errors.password}</p>
            ) : null}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Please wait..." : submitLabel}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">{alternate}</p>

        {onGoogle ? (
          <button
            type="button"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-cyan/70 hover:text-cyan focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onGoogle}
            disabled={googleLoading || formik.isSubmitting}
          >
            <span className="grid size-5 place-items-center rounded-full bg-white text-xs font-black text-ink">G</span>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>
        ) : null}
      </section>
    </main>
  );
}
