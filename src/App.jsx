import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/Signin";
import OtpVerification from "./pages/auth/OtpVerification";
import UpdateBioForm from "./pages/about/About";
import AddService from "./pages/services/AddService";
import AllServices from "./pages/services/AllServices";
import Hero from "./pages/Hero/Hero";
import { Toaster } from "react-hot-toast";
import AllProjects from "./pages/project/AllProjects";
import AddProject from "./pages/project/AddProject";
import Dashboard from "./pages/dashboard/Dashboard";
import ContactManagement from "./pages/contact/Contact";
import AddSkill from "./pages/skills/AddSkill";
import NotFound from "./pages/404/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Profile from "./pages/profile/Profile";
import EditProject from "./pages/project/EditProject";
import Messages from "./pages/contact/Messages";
import AllSkills from "./pages/skills/AllSkills";

const App = () => {
  return (
    <div className="bg-white dark:bg-[#050505] transition-colors duration-300">
      <Toaster position="top-right" />

      <Routes>
        {/* ── Root redirect ──────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* ── Public Auth Routes ─────────────────────────────── */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Outlet />
            </PublicRoute>
          }
        >
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="verify-account" element={<OtpVerification />} />
        </Route>

        {/* ── Protected Admin Routes ─────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect → dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Hero */}
          <Route path="hero-management" element={<Hero />} />

          {/* About / Bio */}
          <Route path="about" element={<UpdateBioForm />} />

          {/* Skills */}
          <Route path="skills/new" element={<AddSkill />} />
          <Route path="skills" element={<AllSkills />} />

          {/* Projects */}
          <Route path="projects" element={<AllProjects />} />
          <Route path="projects/new" element={<AddProject />} />
          <Route path="projects/edit/:id" element={<EditProject />} />

          {/* Services */}
          <Route path="services" element={<AllServices />} />
          <Route path="services/new" element={<AddService />} />

          {/* Contact & Messages */}
          <Route path="contact" element={<ContactManagement />} />
          <Route path="messages" element={<Messages />} />

          {/* Profile */}
          <Route path="profile/me/:id" element={<Profile />} />
        </Route>

        {/* ── 404 ────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
