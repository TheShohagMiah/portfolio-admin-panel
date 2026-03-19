import React, { createContext, useContext, useEffect, useState } from "react";

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
  const [adminTheme, setAdminTheme] = useState(() => {
    const stored = localStorage.getItem("AdminTheme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme:dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (adminTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("AdminTheme", adminTheme);
  }, [adminTheme]);

  const toggleAdminTheme = () => {
    setAdminTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <AdminThemeContext.Provider value={{ adminTheme, toggleAdminTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);
