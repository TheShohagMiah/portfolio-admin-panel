import React from "react";
import { FiUser, FiMail, FiMapPin, FiShield } from "react-icons/fi";
import { getPlatformMeta } from "../constants/platforms";

const ProfileCard = ({ user, isEditing, isProfileDirty, watchedLinks }) => {
  return (
    <aside className="lg:sticky lg:top-8 space-y-6">
      <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-3xl bg-secondary border border-border
                          flex items-center justify-center"
          >
            <FiUser className="text-xl text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold truncate">
              {user?.fullName || "Admin"}
            </h2>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 pt-8 border-t border-border space-y-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FiMail className="text-primary" />
            <span className="truncate">{user?.email || "—"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FiMapPin className="text-primary" />
            <span className="truncate">{user?.location || "—"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FiShield className="text-primary" />
            <span>Role: {user?.role || "—"}</span>
          </div>
        </div>

        {/* Social links live preview */}
        {watchedLinks?.some((l) => l.url?.trim()) && (
          <div className="mt-8 pt-8 border-t border-border">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em]
                          text-muted-foreground mb-4"
            >
              Social Presence
            </p>
            <div className="flex flex-wrap gap-2">
              {watchedLinks
                .filter((l) => l.url?.trim())
                .map((link, i) => {
                  const meta = getPlatformMeta(link.platform);
                  const Icon = meta.Icon;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.label || meta.label}
                      className="w-9 h-9 rounded-2xl border border-border
                                 bg-secondary flex items-center justify-center
                                 text-muted-foreground transition-all
                                 hover:scale-110 hover:-translate-y-0.5"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = meta.color;
                        e.currentTarget.style.borderColor = meta.color + "60";
                        e.currentTarget.style.background = meta.color + "15";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "";
                        e.currentTarget.style.borderColor = "";
                        e.currentTarget.style.background = "";
                      }}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mt-8 p-6 rounded-3xl bg-secondary/50 border border-border">
          <p className="text-[10px] leading-relaxed text-muted-foreground font-sans">
            <span className="font-bold text-foreground">Note:</span> Keep your
            email accurate for recovery alerts and system notifications.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 px-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            isEditing && isProfileDirty
              ? "bg-chart-3 animate-pulse"
              : "bg-chart-2"
          }`}
        />
        <span
          className="text-[10px] font-mono uppercase tracking-tighter
                         text-muted-foreground"
        >
          {isEditing && isProfileDirty ? "Unsaved Changes" : "State Synced"}
        </span>
      </div>
    </aside>
  );
};

export default ProfileCard;
