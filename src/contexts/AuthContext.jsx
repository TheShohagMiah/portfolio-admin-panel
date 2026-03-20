import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://shohagmiah-portfolio-server.vercel.app";

// ═══════════════════════════════════════════════════════════════
//  AXIOS INSTANCE
// ═══════════════════════════════════════════════════════════════
export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(err);
  },
);

// ════════════════════════════════════════════��══════════════════
//  STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════
const USER_KEY = "auth_user";
const TOKEN_KEY = "auth_token";

const storage = {
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  clear: () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};

// ═══════════════════════════════════════════════════════════════
//  CONTEXT
// ═══════════════════════════════════════════════════════════════
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ✅ CRITICAL — initialize directly from localStorage
  // This runs SYNCHRONOUSLY before first render
  // So user is NEVER null if previously logged in
  const [user, setUserState] = useState(() => storage.getUser());
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const hasFetched = useRef(false);

  // ── Always sync user to localStorage ────────────────────────
  const setUser = useCallback((next) => {
    setUserState(next);
    if (next) storage.setUser(next);
    else storage.removeUser();
  }, []);

  // ── 401 global handler ───────────────────────────────────────
  useEffect(() => {
    const handle = () => {
      storage.clear();
      setUserState(null);
    };
    window.addEventListener("auth:unauthorized", handle);
    return () => window.removeEventListener("auth:unauthorized", handle);
  }, []);

  // ── Verify session with server on mount ──────────────────────
  // This runs in background — UI already has user from localStorage
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const res = await api.get("/auth/check-auth");
        if (res.data.success) {
          // ✅ Always update with fresh data from server
          setUser(res.data.user);
        } else {
          storage.clear();
          setUserState(null);
        }
      } catch (err) {
        // 401 → interceptor handles it
        // network error → keep existing user (offline support)
        if (err.response?.status === 401) {
          storage.clear();
          setUserState(null);
        }
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    })();
  }, [setUser]);

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(
    async (credentials) => {
      try {
        const res = await api.post("/auth/login", credentials);
        if (res.data.success) {
          // ✅ Save both user AND token immediately
          setUser(res.data.user);
          if (res.data.token) storage.setToken(res.data.token);
          toast.success(res.data.message || "Welcome back!");
          return { success: true };
        }
        const msg = res.data?.message || "Login failed";
        toast.error(msg);
        return { success: false, message: msg };
      } catch (err) {
        const msg = err.response?.data?.message || "Login failed";
        toast.error(msg);
        return { success: false, message: msg };
      }
    },
    [setUser],
  );

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* still clear */
    }
    storage.clear();
    setUserState(null);
    toast.success("Logged out successfully");
  }, []);

  // ── Registration ─────────────────────────────────────────────
  const registration = useCallback(async (payload) => {
    try {
      const res = await api.post("/auth/register", payload);
      if (res.data?.success) {
        toast.success(res.data.message || "OTP sent!");
        return { success: true };
      }
      const msg = res.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, message: msg };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  // ── Verify OTP ───────────────────────────────────────────────
  const verifyOtp = useCallback(async (payload) => {
    try {
      const res = await api.post("/auth/verify-otp", payload);
      if (res.data?.success) {
        toast.success(res.data.message || "Verified!");
        return { success: true };
      }
      const msg = res.data?.message || "Verification failed";
      toast.error(msg);
      return { success: false, message: msg };
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  }, []);

  // ── Update user optimistically ───────────────────────────────
  const updateUser = useCallback(
    (updates) => {
      setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    },
    [setUser],
  );

  // ── Refresh from server ──────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/check-auth");
      if (res.data.success) setUser(res.data.user);
      else {
        storage.clear();
        setUserState(null);
      }
    } catch {
      storage.clear();
      setUserState(null);
    }
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authChecked,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        registration,
        verifyOtp,
        updateUser,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export default AuthContext;
