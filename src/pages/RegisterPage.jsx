import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useState } from "react";
import AuthForm from "../components/AuthForm.jsx";
import NavBar from "../components/NavBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { registerSchema } from "../utils/validation.js";

export default function RegisterPage() {
  const { register } = useAuth();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: registerSchema,
    onSubmit: async (values, helpers) => {
      setErrorMessage("");
      try {
        await register(values);
        navigate("/dashboard");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Cannot connect to the server. Make sure the backend is running on port 4000."
        );
      } finally {
        helpers.setSubmitting(false);
      }
    }
  });

  async function handleGoogleLogin() {
    setErrorMessage("");
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Google login is unavailable.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <NavBar />
      <AuthForm
        title="Create your account"
        subtitle="Register to enroll, track payment status, and monitor course progress."
        formik={formik}
        submitLabel="Create account"
        errorMessage={errorMessage}
        onGoogle={handleGoogleLogin}
        googleLoading={googleLoading}
        nameField
        alternate={
          <>
            Already registered?{" "}
            <Link className="font-semibold text-cyan hover:text-mint" to="/login">
              Login
            </Link>
          </>
        }
      />
    </>
  );
}
