import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FarmerSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [signupMode, setSignupMode] = useState("phone");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    // Placeholder signup flow until backend auth is connected.
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F6F8F4]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <DesktopSignup
          email={email}
          fullName={fullName}
          handleSubmit={handleSubmit}
          location={location}
          navigate={navigate}
          password={password}
          phone={phone}
          setEmail={setEmail}
          setFullName={setFullName}
          setLocation={setLocation}
          setPassword={setPassword}
          setPhone={setPhone}
          setShowPassword={setShowPassword}
          showPassword={showPassword}
          signupMode={signupMode}
          setSignupMode={setSignupMode}
        />
        <MobileSignup
          email={email}
          fullName={fullName}
          handleSubmit={handleSubmit}
          location={location}
          navigate={navigate}
          password={password}
          phone={phone}
          setEmail={setEmail}
          setFullName={setFullName}
          setLocation={setLocation}
          setPassword={setPassword}
          setPhone={setPhone}
          setShowPassword={setShowPassword}
          showPassword={showPassword}
          signupMode={signupMode}
          setSignupMode={setSignupMode}
        />
      </div>
    </div>
  );
}

function DesktopSignup({
  email,
  fullName,
  handleSubmit,
  location,
  navigate,
  password,
  phone,
  setEmail,
  setFullName,
  setLocation,
  setPassword,
  setPhone,
  setShowPassword,
  showPassword,
  signupMode,
  setSignupMode,
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

          <div className="mt-16 max-w-[540px]">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
              Create Your Farmer Account
            </p>

            <h2 className="mt-6 text-[54px] font-bold leading-[1.05] tracking-tight">
              Join the platform
              <br />
              built for smarter
              <br />
              farm decisions.
            </h2>

            <p className="mt-6 max-w-[500px] text-lg leading-8 text-white/85">
              Set up your account and start using crop monitoring, market insights,
              smart selling recommendations and buyer connections.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoCard title="Track Crops" sub="Monitor stage and harvest progress" />
          <InfoCard title="Read Market" sub="See pricing trends before selling" />
          <InfoCard title="Get Alerts" sub="Weather and market risk updates" />
          <InfoCard title="Find Buyers" sub="Connect with matched buyers faster" />
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
          <ShieldCheck className="h-5 w-5 text-[#D9F3DF]" />
          <p className="text-sm text-white/85">
            Safe signup with secure farmer data handling.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-white/5" />
      </div>

      <div className="flex w-[52%] items-center justify-center px-6 py-10 xl:px-12">
        <div className="w-full max-w-[560px]">
          <div className="rounded-[32px] border border-[#E7ECE5] bg-white p-8 shadow-[0_8px_30px_rgba(25,40,20,0.05)] xl:p-10">
            <div className="mb-8">
              <p className="text-sm font-medium text-[#6B7468]">Get started</p>
              <h3 className="mt-2 text-[38px] font-bold leading-tight text-[#1E2720]">
                Create your account
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[#667164]">
                Join the agriculture intelligence platform in a few simple steps.
              </p>
            </div>

            <SignupModeToggle signupMode={signupMode} setSignupMode={setSignupMode} />

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <InputField
                label="Full name"
                placeholder="Victor M."
                icon={User}
                type="text"
                value={fullName}
                onChange={setFullName}
              />

              {signupMode === "phone" ? (
                <InputField
                  label="Phone number"
                  placeholder="+254 7XX XXX XXX"
                  icon={Phone}
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                />
              ) : (
                <InputField
                  label="Email address"
                  placeholder="you@example.com"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
              )}

              <InputField
                label="County / Location"
                placeholder="Kitui, Kenya"
                icon={MapPin}
                type="text"
                value={location}
                onChange={setLocation}
              />

              <PasswordField
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                value={password}
                onChange={setPassword}
                placeholder="Create a password"
              />

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-[#C9D2C6] text-[#166534] focus:ring-[#166534]"
                />
                <p className="text-sm leading-6 text-[#5F695D]">
                  I agree to the Terms of Service and Privacy Policy.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white transition hover:bg-[#14582D]"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="w-full rounded-2xl border border-[#D8DED5] bg-white px-5 py-4 text-[15px] font-semibold text-[#223022] transition hover:bg-[#F8FAF7]"
              >
                Sign up with Google
              </button>
            </form>

            <div className="mt-8 rounded-2xl bg-[#F5F8F3] px-4 py-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
                <div>
                  <p className="text-sm font-semibold text-[#223022]">Trusted onboarding</p>
                  <p className="mt-1 text-sm leading-6 text-[#667164]">
                    Your account will help you manage crops, understand the market,
                    and make smarter selling decisions.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-7 text-center text-sm text-[#667164]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-[#1E6B37] hover:text-[#14582D]"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSignup({
  email,
  fullName,
  handleSubmit,
  location,
  navigate,
  password,
  phone,
  setEmail,
  setFullName,
  setLocation,
  setPassword,
  setPhone,
  setShowPassword,
  showPassword,
  signupMode,
  setSignupMode,
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
          <p className="text-sm text-white/80">Get started</p>
          <h2 className="mt-2 text-[34px] font-bold leading-tight">
            Create your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Join to access crop insights, market signals and smart recommendations.
          </p>
        </div>
      </div>

      <div className="-mt-4 flex-1 px-4 pb-8">
        <div className="rounded-[28px] border border-[#E7ECE5] bg-white p-5 shadow-[0_8px_30px_rgba(25,40,20,0.05)]">
          <SignupModeToggle
            signupMode={signupMode}
            setSignupMode={setSignupMode}
            compact
          />

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Full name"
              placeholder="Victor M."
              icon={User}
              type="text"
              mobile
              value={fullName}
              onChange={setFullName}
            />

            {signupMode === "phone" ? (
              <InputField
                label="Phone number"
                placeholder="+254 7XX XXX XXX"
                icon={Phone}
                type="tel"
                mobile
                value={phone}
                onChange={setPhone}
              />
            ) : (
              <InputField
                label="Email address"
                placeholder="you@example.com"
                icon={Mail}
                type="email"
                mobile
                value={email}
                onChange={setEmail}
              />
            )}

            <InputField
              label="County / Location"
              placeholder="Kitui, Kenya"
              icon={MapPin}
              type="text"
              mobile
              value={location}
              onChange={setLocation}
            />

            <PasswordField
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              mobile
              value={password}
              onChange={setPassword}
              placeholder="Create a password"
            />

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#C9D2C6] text-[#166534] focus:ring-[#166534]"
              />
              <p className="text-sm leading-6 text-[#5F695D]">
                I agree to the Terms and Privacy Policy.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="w-full rounded-2xl border border-[#D8DED5] bg-white px-5 py-4 text-[15px] font-semibold text-[#223022]"
            >
              Sign up with Google
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-[#F5F8F3] px-4 py-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
              <p className="text-sm leading-6 text-[#667164]">
                Your signup details are handled securely.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[#667164]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-[#1E6B37]"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignupModeToggle({ signupMode, setSignupMode, compact = false }) {
  return (
    <div className="rounded-2xl bg-[#F4F7F2] p-1">
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setSignupMode("phone")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            signupMode === "phone"
              ? "bg-white text-[#1E2720] shadow-sm"
              : "text-[#667164]"
          } ${compact ? "py-2.5" : ""}`}
        >
          Phone Sign Up
        </button>
        <button
          type="button"
          onClick={() => setSignupMode("email")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            signupMode === "email"
              ? "bg-white text-[#1E2720] shadow-sm"
              : "text-[#667164]"
          } ${compact ? "py-2.5" : ""}`}
        >
          Email Sign Up
        </button>
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  icon: Icon,
  type = "text",
  value,
  onChange,
  mobile = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#223022]">
        {label}
      </label>
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

function PasswordField({
  showPassword,
  setShowPassword,
  value,
  onChange,
  placeholder,
  mobile = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#223022]">
        Password
      </label>
      <div
        className={`flex items-center gap-3 rounded-2xl border border-[#DDE4D9] bg-[#FAFCF8] px-4 ${
          mobile ? "py-3.5" : "py-4"
        }`}
      >
        <Lock className="h-5 w-5 text-[#6E796C]" />
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] text-[#1E2720] placeholder:text-[#8A9488] outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-[#6E796C]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

function InfoCard({ title, sub }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur">
      <p className="text-[22px] font-bold leading-none text-white">{title}</p>
      <p className="mt-3 text-sm leading-6 text-white/80">{sub}</p>
    </div>
  );
}
