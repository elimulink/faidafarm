import {
  ArrowLeft,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Palette,
  Phone,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getStoredUser } from "../auth/session";
import {
  applyAppTheme,
  buildSettingsUser,
  saveSettingsUser,
} from "./settingsStorage";

const panels = {
  profile: "Profile",
  security: "Security",
  preferences: "Preferences",
  notifications: "Notifications",
  help: "Help",
};

const roleLabels = {
  admin: "Admin",
  analyst: "Analyst",
  farmer: "Farmer",
  field_officer: "Field Officer",
  researcher: "Researcher",
  supervisor: "Supervisor",
  viewer: "Viewer",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function isValidEmail(value) {
  const email = String(value || "").trim();
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function fieldClass() {
  return "w-full border-0 border-b border-slate-200 bg-transparent px-0 py-3 text-lg text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-green-700";
}

function getBasePath(workspace) {
  return workspace === "farmer" ? "/settings" : "/research/settings";
}

function getHomePath(workspace, user) {
  if (workspace === "farmer") {
    return "/dashboard";
  }

  if (user.role === "admin") {
    return "/research/admin";
  }

  if (user.role === "field_officer") {
    return "/research/field";
  }

  return "/research";
}

function SettingsFrame({ children }) {
  return (
    <main className="settings-clean min-h-screen bg-white text-slate-950">
      <div className="mx-auto min-h-screen max-w-2xl px-5 pb-10 pt-5 sm:px-8 lg:py-8">
        {children}
      </div>
    </main>
  );
}

function TopBar({ user, workspace, isDetail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = getBasePath(workspace);

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(basePath);
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={isDetail ? goBack : () => navigate(getHomePath(workspace, user))}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
        aria-label={isDetail ? "Go back" : "Close settings"}
      >
        {isDetail ? <ArrowLeft className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </button>

      {!isDetail ? (
        <div className="min-w-0 flex-1 text-center text-base font-semibold text-slate-950 sm:text-lg">
          {user.email || user.phone || "FaidaFarm account"}
        </div>
      ) : (
        <div className="min-w-0 flex-1" />
      )}

      {!isDetail ? (
        <button
          type="button"
          onClick={() => navigate(location.pathname.includes("/research") ? "/research/settings/profile" : "/settings/profile")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#9B7A6C] text-xs font-bold text-white"
          aria-label="Open profile"
        >
          {(user.name || "F").charAt(0).toUpperCase()}
        </button>
      ) : (
        <div className="h-10 w-10 shrink-0" />
      )}
    </div>
  );
}

function AccountHero({ user, workspace }) {
  const navigate = useNavigate();
  const basePath = getBasePath(workspace);
  const initials = useMemo(() => {
    const name = user.name || user.email || "FF";
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user.email, user.name]);

  return (
    <section className="mb-6 text-center">
      <button
        type="button"
        onClick={() => navigate(`${basePath}/profile`)}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#9B7A6C] text-2xl font-medium text-white"
      >
        {initials || "FF"}
      </button>
      <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-normal text-slate-950 sm:text-4xl">
        Hi, {user.name || "FaidaFarm User"}!
      </h1>
      <button
        type="button"
        onClick={() => navigate(`${basePath}/profile`)}
        className="mt-4 rounded-full border border-slate-400 px-6 py-2.5 text-base font-medium text-blue-700 transition hover:bg-slate-50"
      >
        Manage your account
      </button>
    </section>
  );
}

function Row({ icon: Icon, title, subtitle, onClick, trailing }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-slate-200 bg-white px-5 py-4 text-left last:border-b-0"
    >
      <Icon className="h-6 w-6 shrink-0 text-slate-700" />
      <span className="min-w-0 flex-1">
        <span className="block text-[19px] font-normal leading-6 text-slate-950">{title}</span>
        {subtitle ? <span className="mt-1 block text-sm leading-5 text-slate-500">{subtitle}</span> : null}
      </span>
      {trailing || <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />}
    </button>
  );
}

function RowGroup({ title, children }) {
  return (
    <section className="mb-5">
      {title ? <h2 className="mb-2 px-5 text-[15px] font-normal text-slate-600">{title}</h2> : null}
      <div className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-[0_1px_8px_rgba(15,23,42,0.035)]">
        {children}
      </div>
    </section>
  );
}

function SettingsHome({ user, workspace }) {
  const navigate = useNavigate();
  const basePath = getBasePath(workspace);

  return (
    <>
      <AccountHero user={user} workspace={workspace} />

      <RowGroup>
        <Row
          icon={UserRound}
          title="Profile"
          subtitle={user.county || "Name, county, phone, and organization"}
          onClick={() => navigate(`${basePath}/profile`)}
        />
        <Row
          icon={ShieldCheck}
          title="Security"
          subtitle="Email and password"
          onClick={() => navigate(`${basePath}/security`)}
        />
      </RowGroup>

      <RowGroup title="App">
        <Row
          icon={Palette}
          title="Theme"
          subtitle={`${user.preferences.theme.charAt(0).toUpperCase()}${user.preferences.theme.slice(1)}`}
          onClick={() => navigate(`${basePath}/preferences`)}
        />
        <Row
          icon={Bell}
          title="Notifications"
          subtitle={user.preferences.notifications ? "Enabled" : "Off"}
          onClick={() => navigate(`${basePath}/notifications`)}
        />
      </RowGroup>

      <RowGroup>
        <Row
          icon={SlidersHorizontal}
          title="Settings"
          subtitle="Language, layout, and sync preferences"
          onClick={() => navigate(`${basePath}/preferences`)}
        />
        <Row
          icon={MessageSquare}
          title="Feedback"
          subtitle="Share what should improve"
          onClick={() => navigate(`${basePath}/help`)}
        />
        <Row
          icon={CircleHelp}
          title="Help"
          subtitle="Support and app information"
          onClick={() => navigate(`${basePath}/help`)}
        />
      </RowGroup>

      <footer className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-600">
        <span>Privacy Policy</span>
        <span>•</span>
        <span>Terms of Service</span>
      </footer>
    </>
  );
}

function DetailHeader({ title, subtitle }) {
  return (
    <header className="mb-7">
      <h1 className="text-4xl font-normal leading-tight tracking-normal text-slate-950 sm:text-5xl">
        {title}
      </h1>
      {subtitle ? <p className="mt-3 max-w-2xl text-lg leading-7 text-slate-700">{subtitle}</p> : null}
    </header>
  );
}

function ProfilePanel({ profile, setProfile, onSave }) {
  const fields = [
    { key: "name", label: "Full name", icon: UserRound, type: "text" },
    { key: "email", label: "Email", icon: Mail, type: "email" },
    { key: "phone", label: "Phone", icon: Phone, type: "tel" },
    { key: "county", label: "County", icon: MapPin, type: "text" },
    { key: "organization", label: "Organization", icon: Building2, type: "text" },
  ];

  return (
    <div>
      <DetailHeader title="Profile" subtitle="Manage the identity used across FaidaFarm." />
      <div className="space-y-5">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <label key={field.key} className="grid grid-cols-[32px_minmax(0,1fr)] gap-5">
              <Icon className="mt-4 h-6 w-6 text-slate-600" />
              <span>
                <span className="block text-base text-slate-600">{field.label}</span>
                <input
                  type={field.type}
                  value={profile[field.key]}
                  onChange={(event) => setProfile((value) => ({ ...value, [field.key]: event.target.value }))}
                  className={fieldClass()}
                />
              </span>
            </label>
          );
        })}
      </div>
      <SaveButton onClick={onSave}>Save Profile</SaveButton>
    </div>
  );
}

function SecurityPanel({ security, setSecurity, onSave }) {
  return (
    <div>
      <DetailHeader title="Security" subtitle="Keep email and password access up to date." />
      <div className="space-y-5">
        {[
          ["email", "Email", "email", Mail, "email"],
          ["currentPassword", "Current password", "password", Lock, "current-password"],
          ["newPassword", "New password", "password", Lock, "new-password"],
          ["confirmPassword", "Confirm password", "password", ShieldCheck, "new-password"],
        ].map(([key, label, type, Icon, autoComplete]) => (
          <label key={key} className="grid grid-cols-[32px_minmax(0,1fr)] gap-5">
            <Icon className="mt-4 h-6 w-6 text-slate-600" />
            <span>
              <span className="block text-base text-slate-600">{label}</span>
              <input
                type={type}
                value={security[key]}
                onChange={(event) => setSecurity((value) => ({ ...value, [key]: event.target.value }))}
                className={fieldClass()}
                autoComplete={autoComplete}
              />
            </span>
          </label>
        ))}
      </div>
      <SaveButton onClick={onSave}>Update Security</SaveButton>
    </div>
  );
}

function OptionRow({ icon: Icon, title, subtitle, active, onClick, trailing }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[32px_minmax(0,1fr)_auto] gap-5 py-5 text-left"
    >
      <Icon className="mt-1 h-6 w-6 text-slate-600" />
      <span>
        <span className="block text-xl font-normal text-slate-950">{title}</span>
        {subtitle ? <span className="mt-1 block text-base leading-6 text-slate-600">{subtitle}</span> : null}
      </span>
      {trailing || (active ? <CheckCircle2 className="mt-1 h-6 w-6 text-blue-700" /> : null)}
    </button>
  );
}

function Switch({ checked }) {
  return (
    <span className={cn("relative mt-1 h-9 w-16 rounded-full transition", checked ? "bg-blue-600" : "bg-slate-300")}>
      <span
        className={cn(
          "absolute top-1 h-7 w-7 rounded-full bg-white shadow-sm transition",
          checked ? "left-8" : "left-1"
        )}
      />
    </span>
  );
}

function PreferencesPanel({ preferences, setPreferences, onSave }) {
  function updatePreference(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }));
    if (key === "theme") {
      applyAppTheme(value);
    }
  }

  return (
    <div>
      <DetailHeader title="Settings" />
      <div className="space-y-2">
        {[
          ["light", "Light", "Official white app theme"],
          ["system", "System", "Follow device preference"],
          ["dark", "Dark", "Low-light app theme"],
        ].map(([theme, title, subtitle]) => (
          <OptionRow
            key={theme}
            icon={Palette}
            title={title}
            subtitle={subtitle}
            active={preferences.theme === theme}
            onClick={() => updatePreference("theme", theme)}
          />
        ))}
        <OptionRow
          icon={SlidersHorizontal}
          title="Compact layout"
          subtitle="Use tighter spacing on data-heavy screens"
          onClick={() => updatePreference("compactLayout", !preferences.compactLayout)}
          trailing={<Switch checked={preferences.compactLayout} />}
        />
        <OptionRow
          icon={ChevronDown}
          title="Language"
          subtitle={preferences.language}
          onClick={() => updatePreference("language", preferences.language === "English" ? "Kiswahili" : "English")}
        />
      </div>
      <SaveButton onClick={onSave}>Save Settings</SaveButton>
    </div>
  );
}

function NotificationsPanel({ preferences, setPreferences, onSave }) {
  function updatePreference(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  return (
    <div>
      <DetailHeader title="Notifications" subtitle="Choose what the app can alert you about." />
      <div className="space-y-2">
        <OptionRow
          icon={Bell}
          title="App notifications"
          subtitle="Account alerts, reminders, and important updates"
          onClick={() => updatePreference("notifications", !preferences.notifications)}
          trailing={<Switch checked={preferences.notifications} />}
        />
        <OptionRow
          icon={ShieldCheck}
          title="Sync alerts"
          subtitle="Show warnings when field data needs attention"
          onClick={() => updatePreference("syncAlerts", !preferences.syncAlerts)}
          trailing={<Switch checked={preferences.syncAlerts} />}
        />
      </div>
      <SaveButton onClick={onSave}>Save Notifications</SaveButton>
    </div>
  );
}

function HelpPanel() {
  return (
    <div>
      <DetailHeader title="Help" subtitle="Support information for the current app build." />
      <div className="space-y-2">
        <OptionRow icon={MessageSquare} title="Send feedback" subtitle="Tell us what should improve next" />
        <OptionRow icon={CircleHelp} title="Help center" subtitle="Guides, troubleshooting, and support" />
        <OptionRow icon={ShieldCheck} title="Privacy" subtitle="Review privacy and safeguarding information" />
      </div>
    </div>
  );
}

function SaveButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-4 text-base font-semibold text-white transition hover:bg-green-800 sm:w-auto"
    >
      <Save className="h-5 w-5" />
      {children}
    </button>
  );
}

export default function SettingsPage({ workspace = "farmer" }) {
  const { panel } = useParams();
  const navigate = useNavigate();
  const basePath = getBasePath(workspace);
  const storedUser = buildSettingsUser(getStoredUser());
  const activePanel = panel && panels[panel] ? panel : null;
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState({
    name: storedUser.name,
    email: storedUser.email,
    phone: storedUser.phone,
    county: storedUser.county,
    organization: storedUser.organization,
  });
  const [preferences, setPreferences] = useState(storedUser.preferences);
  const [security, setSecurity] = useState({
    email: storedUser.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [displayUser, setDisplayUser] = useState(storedUser);

  useEffect(() => {
    applyAppTheme(preferences.theme);
  }, [preferences.theme]);

  useEffect(() => {
    if (panel && !panels[panel]) {
      navigate(basePath, { replace: true });
    }
  }, [basePath, navigate, panel]);

  function flash(message) {
    setStatus(message);
    window.setTimeout(() => setStatus(""), 2400);
  }

  function saveProfile() {
    if (!isValidEmail(profile.email)) {
      flash("Enter a valid email address");
      return;
    }

    const nextUser = saveSettingsUser({
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      county: profile.county.trim(),
      organization: profile.organization.trim(),
    });
    setDisplayUser(buildSettingsUser(nextUser));
    setSecurity((value) => ({ ...value, email: profile.email.trim() }));
    flash("Profile updated");
  }

  function saveSecurity() {
    if (!isValidEmail(security.email)) {
      flash("Enter a valid email address");
      return;
    }

    const wantsPasswordChange =
      security.currentPassword || security.newPassword || security.confirmPassword;

    if (wantsPasswordChange && security.newPassword.length < 8) {
      flash("Password must be at least 8 characters");
      return;
    }

    if (wantsPasswordChange && security.newPassword !== security.confirmPassword) {
      flash("Passwords do not match");
      return;
    }

    const nextUser = saveSettingsUser({
      email: security.email.trim(),
      security: {
        passwordUpdatedAt: wantsPasswordChange ? new Date().toISOString() : displayUser.security.passwordUpdatedAt,
        emailUpdatedAt: security.email.trim() !== displayUser.email ? new Date().toISOString() : displayUser.security.emailUpdatedAt,
      },
    });

    setDisplayUser(buildSettingsUser(nextUser));
    setProfile((value) => ({ ...value, email: security.email.trim() }));
    setSecurity((value) => ({
      ...value,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    flash("Security updated");
  }

  function savePreferences(message = "Settings saved") {
    const nextUser = saveSettingsUser({ preferences });
    setDisplayUser(buildSettingsUser(nextUser));
    flash(message);
  }

  return (
    <SettingsFrame>
      <TopBar user={{ ...displayUser, preferences }} workspace={workspace} isDetail={Boolean(activePanel)} />

      {status ? (
        <div className="fixed left-4 right-4 top-5 z-50 mx-auto flex max-w-md items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4" />
          {status}
        </div>
      ) : null}

      {!activePanel ? <SettingsHome user={{ ...displayUser, preferences }} workspace={workspace} /> : null}
      {activePanel === "profile" ? <ProfilePanel profile={profile} setProfile={setProfile} onSave={saveProfile} /> : null}
      {activePanel === "security" ? <SecurityPanel security={security} setSecurity={setSecurity} onSave={saveSecurity} /> : null}
      {activePanel === "preferences" ? (
        <PreferencesPanel preferences={preferences} setPreferences={setPreferences} onSave={() => savePreferences("Settings saved")} />
      ) : null}
      {activePanel === "notifications" ? (
        <NotificationsPanel preferences={preferences} setPreferences={setPreferences} onSave={() => savePreferences("Notifications saved")} />
      ) : null}
      {activePanel === "help" ? <HelpPanel /> : null}
    </SettingsFrame>
  );
}
