import { useState } from "react";
import { useFormik } from "formik";
import { Send } from "lucide-react";
import api from "../api/client.js";
import { leadSchema } from "../utils/validation.js";

export default function LeadCapture({ course }) {
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: leadSchema,
    onSubmit: async (values, helpers) => {
      setMessage("");
      try {
        const { data } = await api.post("/leads", {
          email: values.email,
          interestedCourse: course.title
        });
        setMessage(data.message);
        helpers.resetForm();
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to save your email right now.");
      } finally {
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="mt-5 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label={`Email for ${course.title}`}
          name="email"
          type="email"
          className="field"
          placeholder="you@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputMode="email"
        />
        <button type="submit" className="btn-primary shrink-0 px-4" disabled={formik.isSubmitting}>
          <Send size={17} aria-hidden="true" />
          Notify me
        </button>
      </div>
      {formik.touched.email && formik.errors.email ? <p className="error">{formik.errors.email}</p> : null}
      {message ? <p className="text-sm text-mint">{message}</p> : null}
    </form>
  );
}
