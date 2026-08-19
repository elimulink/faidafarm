import { createElement, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ClipboardList,
  Leaf,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sprout,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createMockUser, setStoredUser } from "../auth/session";
import { RESEARCH_WORKSPACE_ENABLED } from "../config/features";

const workspaceOptions = [
  {
    role: "farmer",
    title: "Farmer Workspace",
    description: "Farm records, markets, weather, buyers, and selling tools.",
    icon: Sprout,
    path: "/dashboard",
  },
  {
    role: "researcher",
    title: "Research Mode",
    description: "FMNR monitoring, households, nutrition, and reports.",
    icon: ClipboardList,
    path: "/research",
  },
  {
    role: "field_officer",
    title: "Field Collection",
    description: "Forms, drafts, submissions, devices, and sync queue.",
    icon: Leaf,
    path: "/research/field",
  },
  {
    role: "admin",
    title: "Admin Analytics",
    description: "Maps, county comparison, diet scores, exports, and evidence.",
    icon: BarChart3,
    path: "/research/admin",
  },
];

// Research workspaces exist on localhost only, so a production build offers
// the farmer workspace alone and skips the picker step entirely.
const availableWorkspaces = RESEARCH_WORKSPACE_ENABLED
  ? workspaceOptions
  : workspaceOptions.filter((option) => option.role === "farmer");
const showWorkspaceStep = availableWorkspaces.length > 1;

export default function OnboardingFlow() {
  const [step, setStep] = useState("splash");
  const [workspace, setWorkspace] = useState(availableWorkspaces[0]);
  const [authMode, setAuthMode] = useState("signup");
  const [loginMode, setLoginMode] = useState("phone");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    county: "",
    organization: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (step !== "splash") {
      return undefined;
    }

    const timer = window.setTimeout(() => setStep("welcome"), 1100);
    return () => window.clearTimeout(timer);
  }, [step]);

  const progress = useMemo(() => {
    const steps = showWorkspaceStep
      ? ["welcome", "workspace", "auth", "profile"]
      : ["welcome", "auth", "profile"];
    const index = Math.max(0, steps.indexOf(step));
    return ((index + 1) / steps.length) * 100;
  }, [step]);

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function finishOnboarding() {
    const user = createMockUser({
      loginMode,
      email: form.email,
      phone: form.phone,
      preferredRole: workspace.role,
      name: form.name,
      county: form.county,
      organization: form.organization,
    });

    setStoredUser(user);
    navigate(workspace.path, { replace: true });
  }

  if (step === "splash") {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-white px-6">
        <div className="text-center">
          <img src="/logo.png" alt="FaidaFarm" className="mx-auto h-24 w-24 object-contain" />
          <h1 className="mt-5 text-3xl font-bold text-[#0F1A12]">FaidaFarm</h1>
          <p className="mt-2 text-sm font-medium text-[#2F8F46]">
            {RESEARCH_WORKSPACE_ENABLED ? "Farm smarter. Research better." : "Farm smarter. Earn more."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-white text-[#0F1A12]">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[520px] flex-col px-6 pb-7 pt-7">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              step === "welcome"
                ? navigate("/login")
                : setStep(
                    step === "profile"
                      ? "auth"
                      : step === "auth" && showWorkspaceStep
                        ? "workspace"
                        : "welcome"
                  )
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E1E8DE] text-[#233025]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-[#667164]"
          >
            Sign in
          </button>
        </div>

        <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-[#EEF3EB]">
          <div className="h-full rounded-full bg-[#166534]" style={{ width: `${progress}%` }} />
        </div>

        {step === "welcome" ? (
          <WelcomeStep onNext={() => setStep(showWorkspaceStep ? "workspace" : "auth")} />
        ) : null}

        {step === "workspace" && showWorkspaceStep ? (
          <WorkspaceStep
            selected={workspace}
            onSelect={setWorkspace}
            onNext={() => setStep("auth")}
          />
        ) : null}

        {step === "auth" ? (
          <AuthStep
            authMode={authMode}
            form={form}
            loginMode={loginMode}
            onAuthModeChange={setAuthMode}
            onLoginModeChange={setLoginMode}
            onNext={() => setStep("profile")}
            onUpdate={updateForm}
            workspace={workspace}
          />
        ) : null}

        {step === "profile" ? (
          <ProfileStep
            form={form}
            onFinish={finishOnboarding}
            onUpdate={updateForm}
            workspace={workspace}
          />
        ) : null}
      </div>
    </main>
  );
}

function WelcomeStep({ onNext }) {
  return (
    <section className="flex flex-1 flex-col justify-center py-10">
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[36px] bg-[#EEF8EE]">
        <img src="/logo.png" alt="" className="h-20 w-20 object-contain" />
      </div>
      <h2 className="mt-10 text-center text-[42px] font-bold leading-[1.05]">
        Welcome to FaidaFarm
      </h2>
      <p className="mx-auto mt-5 max-w-[360px] text-center text-base leading-7 text-[#667164]">
        {RESEARCH_WORKSPACE_ENABLED
          ? "Manage farm records, field forms, and FMNR insights in one place."
          : "Manage your farm records, markets, weather, and buyers in one place."}
      </p>
      <button
        type="button"
        onClick={onNext}
        className="mt-12 flex w-full items-center justify-center gap-2 rounded-full bg-[#166534] px-6 py-4 text-base font-semibold text-white"
      >
        Get Started
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}

function WorkspaceStep({ selected, onSelect, onNext }) {
  return (
    <section className="flex-1 py-8">
      <h2 className="text-[38px] font-bold leading-[1.05]">Choose your workspace</h2>
      <p className="mt-4 text-base leading-7 text-[#667164]">
        Select the area you want to use first. You can change view later.
      </p>
      <div className="mt-8 space-y-3">
        {availableWorkspaces.map((option) => {
          const Icon = option.icon;
          const isSelected = selected.role === option.role;
          return (
            <button
              key={option.role}
              type="button"
              onClick={() => onSelect(option)}
              className={`flex w-full items-center gap-4 rounded-[24px] border px-4 py-4 text-left ${
                isSelected
                  ? "border-[#BFE3C5] bg-[#F2FAF2]"
                  : "border-[#E3EAE0] bg-white"
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDF7EC] text-[#166534]">
                <Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-base font-bold text-[#111A13]">{option.title}</span>
                <span className="mt-1 block text-sm leading-6 text-[#667164]">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#166534] px-6 py-4 text-base font-semibold text-white"
      >
        Continue
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}

function AuthStep({
  authMode,
  form,
  loginMode,
  onAuthModeChange,
  onLoginModeChange,
  onNext,
  onUpdate,
  workspace,
}) {
  return (
    <section className="flex-1 py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2F8F46]">
        {workspace.title}
      </p>
      <h2 className="mt-3 text-[38px] font-bold leading-[1.05]">
        {authMode === "signup" ? "Create your account" : "Sign in"}
      </h2>
      <div className="mt-7 grid grid-cols-2 rounded-full bg-[#F1F5EF] p-1">
        {["signup", "login"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onAuthModeChange(mode)}
            className={`rounded-full px-4 py-3 text-sm font-semibold capitalize ${
              authMode === mode ? "bg-white text-[#111A13] shadow-sm" : "text-[#667164]"
            }`}
          >
            {mode === "signup" ? "Create" : "Login"}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 rounded-full bg-[#F1F5EF] p-1">
        {["phone", "email"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onLoginModeChange(mode)}
            className={`rounded-full px-4 py-3 text-sm font-semibold capitalize ${
              loginMode === mode ? "bg-white text-[#111A13] shadow-sm" : "text-[#667164]"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="mt-7 space-y-4">
        {loginMode === "phone" ? (
          <OnboardingField
            icon={Phone}
            label="Phone number"
            onChange={(value) => onUpdate("phone", value)}
            placeholder="+254 7XX XXX XXX"
            type="tel"
            value={form.phone}
          />
        ) : (
          <OnboardingField
            icon={Mail}
            label="Email address"
            onChange={(value) => onUpdate("email", value)}
            placeholder="you@example.com"
            type="email"
            value={form.email}
          />
        )}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#166534] px-6 py-4 text-base font-semibold text-white"
      >
        Continue
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}

function ProfileStep({ form, onFinish, onUpdate, workspace }) {
  const isFarmer = workspace.role === "farmer";

  return (
    <section className="flex-1 py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2F8F46]">
        Profile setup
      </p>
      <h2 className="mt-3 text-[38px] font-bold leading-[1.05]">Finish your profile</h2>
      <p className="mt-4 text-base leading-7 text-[#667164]">
        Add the basics so FaidaFarm opens the right workspace for you.
      </p>
      <div className="mt-7 space-y-4">
        <OnboardingField
          icon={User}
          label="Full name"
          onChange={(value) => onUpdate("name", value)}
          placeholder="Victor M."
          value={form.name}
        />
        <OnboardingField
          icon={MapPin}
          label="County"
          onChange={(value) => onUpdate("county", value)}
          placeholder="Kitui"
          value={form.county}
        />
        {!isFarmer ? (
          <OnboardingField
            icon={ShieldCheck}
            label="Organization / site"
            onChange={(value) => onUpdate("organization", value)}
            placeholder="FMNR programme"
            value={form.organization}
          />
        ) : null}
      </div>
      <button
        type="button"
        onClick={onFinish}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#166534] px-6 py-4 text-base font-semibold text-white"
      >
        Enter {workspace.title}
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}

function OnboardingField({ icon, label, onChange, placeholder, type = "text", value }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#233025]">{label}</span>
      <span className="flex items-center gap-3 rounded-[20px] border border-[#DDE5DA] bg-[#FAFCF8] px-4 py-4">
        {createElement(icon, { className: "h-5 w-5 text-[#6E796C]" })}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-[#111A13] outline-none placeholder:text-[#9AA59A]"
        />
      </span>
    </label>
  );
}
