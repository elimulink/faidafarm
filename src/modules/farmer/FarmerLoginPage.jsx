import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  ClipboardList,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, setStoredUser } from "../../auth/session";
import { describeAuthError, signInWithEmail, signInWithGoogle } from "../../auth/firebaseAuth";
import { startSession } from "../../auth/startSession";
import { RESEARCH_WORKSPACE_ENABLED } from "../../config/features";
import LoadingScreen from "../../components/LoadingScreen";

// Play requires the policy to be reachable from the app, not only the store
// listing. Opened outside the WebView so a farmer mid-sign-in does not lose
// what they typed.
function PrivacyLink({ className = "" }) {
  return (
    <p className={`text-center text-xs leading-5 text-[#8A9488] ${className}`}>
      <a
        href="https://faidafarm-baa26.web.app/privacy-policy"
        target="_blank"
        rel="noreferrer"
        className="underline decoration-[#C9D2C6] underline-offset-2 hover:text-[#1E6B37]"
      >
        Privacy policy
      </a>
    </p>
  );
}

function GoogleMark() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.7 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.2 5.3-4.6 7l7.1 5.5c4.2-3.8 6.6-9.5 6.6-17z" />
      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.3 0 20 0 24s1 7.7 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.6 2.1-8.8 2.1-6.3 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export default function FarmerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  // Which button is working, so only that one wears a busy label.
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Both ways in end the same: Firebase proves who this is, the backend turns
  // that into a FaidaFarm session, and only then does anything navigate.
  async function completeSignIn(runSignIn, source) {
    setError("");
    setBusy(source);

    try {
      const { idToken, profile } = await runSignIn();
      await startSession({ idToken, profile, loginMode: source });

      if (RESEARCH_WORKSPACE_ENABLED) {
        setShowWorkspaceModal(true);
        return;
      }

      // The crop guard sends them to setup if they have none recorded.
      navigate("/dashboard", { replace: true });
    } catch (signInError) {
      setError(describeAuthError(signInError));
    } finally {
      setBusy("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    completeSignIn(() => signInWithEmail({ email, password }), "email");
  }

  function handleGoogleSignIn() {
    completeSignIn(() => signInWithGoogle(), "google");
  }

  // Development only. The account is real by this point; the picker just says
  // which workspace to open it in.
  function handleWorkspaceSelect(preferredRole) {
    const user = getStoredUser();
    if (user) {
      setStoredUser({ ...user, role: preferredRole });
    }

    setShowWorkspaceModal(false);
    navigate(
      preferredRole === "farmer"
        ? "/dashboard"
        : preferredRole === "admin"
          ? "/research/admin"
          : preferredRole === "field_officer"
            ? "/research/field"
            : "/research",
      { replace: true }
    );
  }

  const shared = {
    busy,
    error,
    onGoogleSignIn: handleGoogleSignIn,
    email,
    handleSubmit,
    navigate,
    password,
    setEmail,
    setPassword,
    setShowPassword,
    showPassword,
  };

  return (
    <div className="min-h-screen bg-[#F6F8F4]">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[1440px]">
        <DesktopLogin {...shared} />
        <MobileLogin {...shared} />
      </div>
      {/* Google runs in its own window, so covering ours would hide the account
          picker. Only the email wait gets the full screen. */}
      {busy === "email" ? <LoadingScreen message="Signing you in" /> : null}
      {RESEARCH_WORKSPACE_ENABLED && showWorkspaceModal ? (
        <WorkspacePickerModal
          onChooseFarmer={() => handleWorkspaceSelect("farmer")}
          onChooseResearch={() => handleWorkspaceSelect("researcher")}
          onChooseField={() => handleWorkspaceSelect("field_officer")}
          onChooseAdmin={() => handleWorkspaceSelect("admin")}
          onClose={() => setShowWorkspaceModal(false)}
        />
      ) : null}
    </div>
  );
}

function WorkspacePickerModal({
  onChooseFarmer,
  onChooseResearch,
  onChooseField,
  onChooseAdmin,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#182118]/45 px-3 pb-3 sm:items-center sm:p-4">
      <div className="max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-[26px] border border-[#E7ECE5] bg-white p-5 shadow-[0_18px_50px_rgba(25,40,20,0.16)] sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-[#EEF2EC] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2F8F46]">
              Choose Workspace
            </p>
            <h3 className="mt-2 text-[24px] font-bold leading-tight text-[#1E2720] sm:text-[30px]">
              Where do you want to work?
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#667164]">
              Pick one workspace for this session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E4EAE1] px-3 py-2 text-sm font-semibold text-[#667164] hover:bg-[#F5F8F3]"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <WorkspaceChoiceCard
            icon={Sprout}
            title="Farmer Workspace"
            description="Farm records, markets, weather, and buyers."
            buttonLabel="Enter Farmer"
            onClick={onChooseFarmer}
          />
          <WorkspaceChoiceCard
            icon={ClipboardList}
            title="Research Mode"
            description="Households, FMNR plots, nutrition, and reports."
            buttonLabel="Enter Research"
            onClick={onChooseResearch}
          />
          <WorkspaceChoiceCard
            icon={Leaf}
            title="Field Collection"
            description="Forms, drafts, devices, and sync queue."
            buttonLabel="Enter Field"
            onClick={onChooseField}
          />
          <WorkspaceChoiceCard
            icon={BarChart3}
            title="Admin Analytics"
            description="Maps, diet scores, county insights, and exports."
            buttonLabel="Enter Admin"
            onClick={onChooseAdmin}
            accent
          />
        </div>
      </div>
    </div>
  );
}

function WorkspaceChoiceCard({ icon, title, description, buttonLabel, onClick, accent = false }) {
  return (
    <div
      className={`rounded-[22px] border p-4 ${
        accent ? "border-[#DCEAD5] bg-[#F7FBF5]" : "border-[#E7ECE5] bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF7EC] text-[#166534]">
          {React.createElement(icon, { className: "h-5 w-5" })}
        </span>
        <div>
          <h4 className="text-[18px] font-bold leading-tight text-[#1F2B1F]">{title}</h4>
          <p className="mt-1.5 text-sm leading-6 text-[#667164]">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
          accent
            ? "bg-[#166534] text-white hover:bg-[#14582D]"
            : "bg-[#F5F8F3] text-[#223022] hover:bg-[#EEF5EA]"
        }`}
      >
        {buttonLabel}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function DesktopLogin({
  busy,
  error,
  onGoogleSignIn,
  email,
  handleSubmit,
  navigate,
  password,
  setEmail,
  setPassword,
  setShowPassword,
  showPassword,
}) {
  return (
    <div className="hidden w-full lg:flex">
      <div className="relative flex w-[44%] flex-col justify-between overflow-hidden border-r border-[#DCE7D8] bg-[#145A32] px-8 py-8 text-white xl:w-[46%] xl:px-11 xl:py-9">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="FaidaFarm logo" className="h-11 w-11 object-contain xl:h-12 xl:w-12" />
            <div>
              <h1 className="text-[27px] font-bold leading-none xl:text-[30px]">FaidaFarm</h1>
              <p className="mt-1 text-sm text-white/80">Farm smarter. Earn more.</p>
            </div>
          </div>

          <div className="mt-10 max-w-[460px] xl:mt-12">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[13px] font-medium">
              Smart farming for profit
            </p>

            <h2 className="mt-5 text-[38px] font-bold leading-[1.08] tracking-tight xl:text-[44px]">
              Smarter farming starts here.
            </h2>

            <p className="mt-4 max-w-[430px] text-[15px] leading-7 text-white/84 xl:text-base xl:leading-7">
              {RESEARCH_WORKSPACE_ENABLED
                ? "Access farm records, market intelligence, weather alerts, buyer matching, and FMNR research workflows in one platform."
                : "Access farm records, market intelligence, weather alerts, and verified buyers in one platform."}
            </p>
          </div>
        </div>

        <div className="relative mt-7 xl:mt-9">
          <div className="grid grid-cols-2 gap-3">
            <FeaturePreviewCard
              badge="Rising"
              sub="Ndengu trending upward"
              title="Price Signal"
              value="KES 80/kg"
            />
            <FeaturePreviewCard
              badge="AI Advice"
              sub="Higher returns expected"
              title="Recommendation"
              value="Wait 10 days"
            />
            <FeaturePreviewCard
              badge="Forecast"
              sub="Moderate rainfall expected"
              title="Weather Alert"
              value="Rain tomorrow"
            />
            <FeaturePreviewCard
              badge="Active"
              sub="Nairobi demand improving"
              title="Buyer Match"
              value="3 buyers"
            />
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <ShieldCheck className="h-5 w-5 text-[#D9F3DF]" />
            <p className="text-sm text-white/85">
              Your farm and market data is handled securely.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-white/5" />
      </div>

      <div className="flex w-[56%] items-center justify-center px-6 py-8 xl:w-[54%] xl:px-10 xl:py-9">
        <div className="w-full max-w-[500px]">
          <div className="rounded-[28px] border border-[#E7ECE5] bg-white p-6 shadow-[0_8px_26px_rgba(25,40,20,0.05)] xl:p-8">
            <div className="mb-5 xl:mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2F8F46]">
                Welcome back
              </p>
              <h3 className="mt-2 text-[30px] font-bold leading-tight text-[#1E2720] xl:text-[34px]">
                Sign in
              </h3>
              <p className="mt-2 text-[14px] leading-6 text-[#667164] xl:text-[15px]">
                Continue to your FaidaFarm workspace.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                icon={Mail}
                label="Email address"
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
                value={email}
              />

              <PasswordField
                onChange={setPassword}
                password={password}
                setShowPassword={setShowPassword}
                showPassword={showPassword}
              />

              <div className="flex items-center justify-between gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-[#5F695D]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#C9D2C6] text-[#166534] focus:ring-[#166534]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-semibold text-[#1E6B37] hover:text-[#14582D]"
                >
                  Forgot?
                </button>
              </div>

              <button
                type="submit"
                disabled={Boolean(busy)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#14582D] disabled:opacity-60"
              >
                {busy === "email" ? "Signing in..." : "Login"}
                {busy === "email" ? null : <ArrowRight className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={Boolean(busy)}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#D8DED5] bg-white px-5 py-3.5 text-[15px] font-semibold text-[#223022] transition hover:bg-[#F8FAF7] disabled:opacity-60"
              >
                <GoogleMark />
                {busy === "google" ? "Signing in..." : "Continue with Google"}
              </button>

              {error ? (
                <p className="rounded-2xl bg-[#FBEEE9] px-4 py-3 text-sm leading-6 text-[#8C3A22]">
                  {error}
                </p>
              ) : null}
            </form>

            <div className="mt-5 rounded-2xl border border-[#E6EEE2] bg-[#F8FBF6] px-4 py-3 xl:mt-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
                <div>
                  <p className="text-sm font-semibold text-[#223022]">Secure access</p>
                  <p className="mt-1 text-sm leading-6 text-[#667164]">
                    Your workspace data stays protected.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-[#667164] xl:mt-6">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-[#1E6B37] hover:text-[#14582D]"
              >
                Create account
              </button>
            </p>

            <PrivacyLink className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileLogin({
  busy,
  error,
  onGoogleSignIn,
  email,
  handleSubmit,
  navigate,
  password,
  setEmail,
  setPassword,
  setShowPassword,
  showPassword,
}) {
  return (
    <div className="flex min-h-[100svh] w-full flex-col bg-[#F6F8F4] lg:hidden">
      <div className="rounded-b-[28px] bg-[#145A32] px-5 pb-6 pt-7 text-white">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FaidaFarm logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-[24px] font-bold leading-none">FaidaFarm</h1>
            <p className="mt-1 text-xs text-white/80">Farm smarter. Earn more.</p>
          </div>
        </div>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">
            Welcome back
          </p>
          <h2 className="mt-2 text-[30px] font-bold leading-tight">Sign in</h2>
          <p className="mt-2 max-w-[310px] text-sm leading-6 text-white/85">
            Continue to your FaidaFarm workspace.
          </p>
        </div>
      </div>

      <div className="-mt-3 flex-1 px-4 pb-7">
        <div className="rounded-[24px] border border-[#E7ECE5] bg-white p-4 shadow-[0_8px_24px_rgba(25,40,20,0.05)]">
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <InputField
              icon={Mail}
              label="Email address"
              mobile
              onChange={setEmail}
              placeholder="you@example.com"
              type="email"
              value={email}
            />

            <PasswordField
              mobile
              onChange={setPassword}
              password={password}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />

            <div className="flex items-center justify-between gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm text-[#5F695D]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#C9D2C6] text-[#166534] focus:ring-[#166534]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-semibold text-[#1E6B37]"
              >
                Forgot?
              </button>
            </div>

            <button
              type="submit"
              disabled={Boolean(busy)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
            >
              {busy === "email" ? "Signing in..." : "Login"}
              {busy === "email" ? null : <ArrowRight className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={onGoogleSignIn}
              disabled={Boolean(busy)}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#D8DED5] bg-white px-5 py-3.5 text-[15px] font-semibold text-[#223022] disabled:opacity-60"
            >
              <GoogleMark />
              {busy === "google" ? "Signing in..." : "Continue with Google"}
            </button>

            {error ? (
              <p className="rounded-2xl bg-[#FBEEE9] px-4 py-3 text-sm leading-6 text-[#8C3A22]">
                {error}
              </p>
            ) : null}
          </form>

          <div className="mt-5 rounded-2xl border border-[#E6EEE2] bg-[#F8FBF6] px-4 py-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
              <p className="text-sm leading-6 text-[#667164]">
                Your data is protected.
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-[#667164]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-[#1E6B37]"
            >
              Create account
            </button>
          </p>

          <PrivacyLink className="mt-4" />
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  value,
  mobile = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#223022]">{label}</label>
      <div
        className={`flex items-center gap-3 rounded-2xl border border-[#DDE4D9] bg-[#FAFCF8] px-4 ${
          mobile ? "py-3.5" : "py-3.5 xl:py-4"
        }`}
      >
        {React.createElement(Icon, { className: "h-5 w-5 text-[#6E796C]" })}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="email"
          className="w-full bg-transparent text-[15px] text-[#1E2720] placeholder:text-[#8A9488] outline-none"
        />
      </div>
    </div>
  );
}

function PasswordField({ showPassword, setShowPassword, password, onChange, mobile = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#223022]">Password</label>
      <div
        className={`flex items-center gap-3 rounded-2xl border border-[#DDE4D9] bg-[#FAFCF8] px-4 ${
          mobile ? "py-3.5" : "py-3.5 xl:py-4"
        }`}
      >
        <Lock className="h-5 w-5 text-[#6E796C]" />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          className="w-full bg-transparent text-[15px] text-[#1E2720] placeholder:text-[#8A9488] outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-[#6E796C]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

function FeaturePreviewCard({ title, value, sub, badge }) {
  return (
    <div className="rounded-[20px] border border-white/12 bg-white/10 p-3.5 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
          {badge}
        </span>
      </div>

      <p className="mt-3 text-[22px] font-bold leading-none text-white xl:text-[24px]">{value}</p>
      <p className="mt-2 text-[13px] leading-5 text-white/80">{sub}</p>
    </div>
  );
}
