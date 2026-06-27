import * as Yup from "yup";

const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const registerSchema = Yup.object({
  name: Yup.string().trim().min(2, "Use at least 2 characters").required("Name is required"),
  email: Yup.string()
    .trim()
    .matches(emailRule, "Email format is required, for example name@example.com")
    .required("Email is required"),
  password: Yup.string()
    .matches(passwordRule, "Use 8+ characters with letters and numbers")
    .required("Password is required")
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .matches(emailRule, "Email format is required, for example name@example.com")
    .required("Email is required"),
  password: Yup.string().required("Password is required")
});

export const leadSchema = Yup.object({
  email: Yup.string()
    .trim()
    .matches(emailRule, "Email format is required, for example name@example.com")
    .required("Email is required")
});
