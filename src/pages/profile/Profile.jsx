import React, { useState } from "react";
import { FiEdit2, FiSave } from "react-icons/fi";
import ProfileCard from "./components/ProfileCard";
import ProfileForm from "./components/ProfileForm";
import SocialLinksForm from "./components/SocialLinks";
import UpdatePasswordForm from "./components/UpdatePassword";
import { useAuth } from "../../contexts/AuthContext";

// ── Shared input style (exported — components import করবে) ────
export const inputCls = (hasError) =>
  `w-full bg-secondary border rounded-2xl py-3 px-4 text-sm text-foreground
   placeholder:text-muted-foreground focus:outline-none transition-all
   ${
     hasError
       ? "border-destructive/50"
       : "border-border focus:border-primary/50"
   }`;

const AdminProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [watchedLinks, setWatchedLinks] = useState([]);

  return (
    <section className="py-8 min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto px-6">
        {/* ── Page Header ── */}
        <div
          className="mb-12 flex flex-col lg:flex-row lg:items-end
                        lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">
              Account{" "}
              <span className="text-muted-foreground italic font-serif text-3xl">
                Settings.
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 font-sans">
              Manage your identity, contact info, and security protocols.
            </p>
          </div>

          <button
            onClick={() => setIsEditing((s) => !s)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs
              font-bold uppercase tracking-widest transition-all shadow-xl
              ${
                isEditing
                  ? "bg-secondary text-foreground border border-border hover:border-primary/40"
                  : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/10"
              }`}
          >
            {isEditing ? <FiSave /> : <FiEdit2 />}
            {isEditing ? "Save Mode" : "Edit Profile"}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* ── Left: Identity Card ── */}
          <ProfileCard
            user={user}
            isEditing={isEditing}
            watchedLinks={watchedLinks}
          />

          {/* ── Right: Forms ── */}
          <div className="lg:col-span-2 space-y-10">
            <ProfileForm user={user} isEditing={isEditing} />
            <SocialLinksForm user={user} onLinksChange={setWatchedLinks} />
            <UpdatePasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
