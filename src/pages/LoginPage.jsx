import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useState } from "react";
import AuthForm from "../components/AuthForm.jsx";
import NavBar from "../components/NavBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { loginSchema } from "../utils/validation.js";

export default function LoginPage() {
  const { login } = useAuth();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ""}` : "/dashboard";

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, helpers) => {
      setErrorMessage("");
      try {
        await login(values);
        navigate(redirectTo, { replace: true });
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
      navigate(redirectTo, { replace: true });
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
        title="Welcome back"
        subtitle="Continue your iTbenuk learning journey."
        formik={formik}
        submitLabel="Login"
        errorMessage={errorMessage}
        onGoogle={handleGoogleLogin}
        googleLoading={googleLoading}
        alternate={
          <>
            New here?{" "}
            <Link className="font-semibold text-cyan hover:text-mint" to="/register">
              Create an account
            </Link>
          </>
        }
      />
    </>
  );
}
