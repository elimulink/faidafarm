import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FarmerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    // Placeholder auth flow until real backend authentication is connected.
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F6F8F4]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <DesktopLogin
          email={email}
          handleSubmit={handleSubmit}
          loginMode={loginMode}
          navigate={navigate}
          password={password}
          phone={phone}
          setEmail={setEmail}
          setLoginMode={setLoginMode}
          setPassword={setPassword}
          setPhone={setPhone}
          setShowPassword={setShowPassword}
          showPassword={showPassword}
        />
        <MobileLogin
          email={email}
          handleSubmit={handleSubmit}
          loginMode={loginMode}
          navigate={navigate}
          password={password}
          phone={phone}
          setEmail={setEmail}
          setLoginMode={setLoginMode}
          setPassword={setPassword}
          setPhone={setPhone}
          setShowPassword={setShowPassword}
          showPassword={showPassword}
        />
      </div>
    </div>
  );
}

function DesktopLogin({
  email,
  handleSubmit,
  loginMode,
  navigate,
  password,
  phone,
  setEmail,
  setLoginMode,
  setPassword,
  setPhone,
  setShowPassword,
  showPassword,
}) {
  return (
    <div className="hidden w-full lg:flex">
      <div className="relative flex w-[48%] flex-col justify-between overflow-hidden border-r border-[#E7ECE5] bg-[#145A32] px-10 py-10 text-white xl:px-14">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="FaidaFarm logo" className="h-14 w-14 object-contain" />
            <div>
              <h1 className="text-[32px] font-bold leading-none">FaidaFarm</h1>
              <p className="mt-1 text-sm text-white/80">Farm smarter. Earn more.</p>
            </div>
          </div>

          <div className="mt-16 max-w-[520px]">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
              Smart farming for profit
            </p>

            <h2 className="mt-6 text-[54px] font-bold leading-[1.05] tracking-tight">
              Smarter farming
              <br />
              starts with
              <br />
              one simple login.
            </h2>

            <p className="mt-6 max-w-[500px] text-lg leading-8 text-white/85">
              Access crop insights, market intelligence, weather alerts, buyer matching,
              and smart selling recommendations in one clean platform.
            </p>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
            <ShieldCheck className="h-5 w-5 text-[#D9F3DF]" />
            <p className="text-sm text-white/85">
              Your farm and market data is handled securely.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-white/5" />
      </div>

      <div className="flex w-[52%] items-center justify-center px-6 py-10 xl:px-12">
        <div className="w-full max-w-[520px]">
          <div className="rounded-[32px] border border-[#E7ECE5] bg-white p-8 shadow-[0_8px_30px_rgba(25,40,20,0.05)] xl:p-10">
            <div className="mb-8">
              <p className="text-sm font-medium text-[#6B7468]">Welcome back</p>
              <h3 className="mt-2 text-[38px] font-bold leading-tight text-[#1E2720]">
                Sign in to your account
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[#667164]">
                Continue to your agriculture intelligence dashboard.
              </p>
            </div>

            <LoginModeToggle loginMode={loginMode} setLoginMode={setLoginMode} />

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              {loginMode === "phone" ? (
                <InputField
                  icon={Phone}
                  label="Phone number"
                  onChange={setPhone}
                  placeholder="+254 7XX XXX XXX"
                  type="tel"
                  value={phone}
                />
              ) : (
                <InputField
                  icon={Mail}
                  label="Email address"
                  onChange={setEmail}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              )}

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
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white transition hover:bg-[#14582D]"
              >
                Login
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="w-full rounded-2xl border border-[#D8DED5] bg-white px-5 py-4 text-[15px] font-semibold text-[#223022] transition hover:bg-[#F8FAF7]"
              >
                Login with Google
              </button>
            </form>

            <div className="mt-8 rounded-2xl bg-[#F5F8F3] px-4 py-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
                <div>
                  <p className="text-sm font-semibold text-[#223022]">Secure access</p>
                  <p className="mt-1 text-sm leading-6 text-[#667164]">
                    Your data stays protected while you access market signals, crop monitoring,
                    and buyer connections.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-7 text-center text-sm text-[#667164]">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-[#1E6B37] hover:text-[#14582D]"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileLogin({
  email,
  handleSubmit,
  loginMode,
  navigate,
  password,
  phone,
  setEmail,
  setLoginMode,
  setPassword,
  setPhone,
  setShowPassword,
  showPassword,
}) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:hidden">
      <div className="rounded-b-[32px] bg-[#145A32] px-5 pb-8 pt-8 text-white">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FaidaFarm logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-[28px] font-bold leading-none">FaidaFarm</h1>
            <p className="mt-1 text-xs text-white/80">Farm smarter. Earn more.</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-white/80">Welcome back</p>
          <h2 className="mt-2 text-[34px] font-bold leading-tight">Sign in to continue</h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Access your farm insights, market trends and selling recommendations.
          </p>
        </div>
      </div>

      <div className="-mt-4 flex-1 px-4 pb-8">
        <div className="rounded-[28px] border border-[#E7ECE5] bg-white p-5 shadow-[0_8px_30px_rgba(25,40,20,0.05)]">
          <LoginModeToggle compact loginMode={loginMode} setLoginMode={setLoginMode} />

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {loginMode === "phone" ? (
              <InputField
                icon={Phone}
                label="Phone number"
                mobile
                onChange={setPhone}
                placeholder="+254 7XX XXX XXX"
                type="tel"
                value={phone}
              />
            ) : (
              <InputField
                icon={Mail}
                label="Email address"
                mobile
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            )}

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
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="w-full rounded-2xl border border-[#D8DED5] bg-white px-5 py-4 text-[15px] font-semibold text-[#223022]"
            >
              Login with Google
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-[#F5F8F3] px-4 py-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
              <p className="text-sm leading-6 text-[#667164]">
                Your data is secure and protected.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[#667164]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-[#1E6B37]"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginModeToggle({ loginMode, setLoginMode, compact = false }) {
  return (
    <div className="rounded-2xl bg-[#F4F7F2] p-1">
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setLoginMode("phone")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            loginMode === "phone" ? "bg-white text-[#1E2720] shadow-sm" : "text-[#667164]"
          } ${compact ? "py-2.5" : ""}`}
        >
          Phone Login
        </button>
        <button
          type="button"
          onClick={() => setLoginMode("email")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            loginMode === "email" ? "bg-white text-[#1E2720] shadow-sm" : "text-[#667164]"
          } ${compact ? "py-2.5" : ""}`}
        >
          Email Login
        </button>
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
          mobile ? "py-3.5" : "py-4"
        }`}
      >
        {React.createElement(Icon, { className: "h-5 w-5 text-[#6E796C]" })}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
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
          mobile ? "py-3.5" : "py-4"
        }`}
      >
        <Lock className="h-5 w-5 text-[#6E796C]" />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter your password"
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
    <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
          {badge}
        </span>
      </div>

      <p className="mt-4 text-[26px] font-bold leading-none text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-white/80">{sub}</p>
    </div>
  );
}
