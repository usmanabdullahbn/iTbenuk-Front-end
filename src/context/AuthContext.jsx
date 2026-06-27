import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import api from "../api/client.js";
import { firebaseAuth, googleProvider } from "../api/firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("itbenuk_token"));
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("itbenuk_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  async function register(values) {
    const { data } = await api.post("/auth/register", values);
    localStorage.setItem("itbenuk_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function login(values) {
    const { data } = await api.post("/auth/login", values);
    localStorage.setItem("itbenuk_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const { displayName, email, uid } = result.user;
    const { data } = await api.post("/auth/google", {
      name: displayName || email?.split("@")[0] || "Google user",
      email,
      uid
    });

    localStorage.setItem("itbenuk_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("itbenuk_token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, register, login, loginWithGoogle, logout, setUser }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
