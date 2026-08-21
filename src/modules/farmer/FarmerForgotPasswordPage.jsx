import React, { useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { describeAuthError, sendPasswordReset } from "../../auth/firebaseAuth";

export default function FarmerForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter the email address on the account.");
      return;
    }

    setError("");
    setBusy(true);

    try {
      await sendPasswordReset(email);
      // Firebase will not say whether the address has an account, and neither
      // do we - saying so would tell a stranger which emails are registered.
      setSent(true);
    } catch (resetError) {
      setError(describeAuthError(resetError, "Could not send the reset email. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8F4]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <DesktopForgot
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
          navigate={navigate}
          busy={busy}
          sent={sent}
          error={error}
        />
        <MobileForgot
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
          navigate={navigate}
          busy={busy}
          sent={sent}
          error={error}
        />
      </div>
    </div>
  );
}

function DesktopForgot({ email, setEmail, handleSubmit, navigate, busy, sent, error }) {
  return (
    <div className="hidden w-full lg:flex">
      <div className="flex w-[46%] flex-col justify-between border-r border-[#E7ECE5] bg-[#145A32] px-10 py-10 text-white xl:px-14">
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
              Password Recovery
            </p>
            <h2 className="mt-6 text-[52px] font-bold leading-[1.05]">
              Recover access
              <br />
              to your account
              <br />
              securely.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/85">
              Enter your phone number or email and we will send a verification code
              to reset your password.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-[#D9F3DF]" />
            <p className="text-sm leading-7 text-white/85">
              For Kenyan users, phone-based recovery with OTP is recommended for faster
              access and easier identity confirmation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-[54%] items-center justify-center px-6 py-10 xl:px-12">
        <div className="w-full max-w-[540px] rounded-[32px] border border-[#E7ECE5] bg-white p-8 shadow-[0_8px_30px_rgba(25,40,20,0.05)] xl:p-10">
          <p className="text-sm font-medium text-[#6B7468]">Account recovery</p>
          <h3 className="mt-2 text-[38px] font-bold leading-tight text-[#1E2720]">
            Forgot your password?
          </h3>
          <p className="mt-3 text-[15px] leading-7 text-[#667164]">
            Choose how you want to receive your verification code.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <InputField
              label="Email address"
              placeholder="you@example.com"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
            />

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white hover:bg-[#14582D] disabled:opacity-60"
            >
              {busy ? "Sending..." : "Send reset link"}
              {busy ? null : <ArrowRight className="h-4 w-4" />}
            </button>

            {sent ? (
              <p className="rounded-2xl bg-[#EDF7EE] px-4 py-3 text-sm leading-6 text-[#1E6B37]">
                If that email has an account, a reset link is on its way. Open it
                on this device to choose a new password.
              </p>
            ) : null}

            {error ? (
              <p className="rounded-2xl bg-[#FBEEE9] px-4 py-3 text-sm leading-6 text-[#8C3A22]">
                {error}
              </p>
            ) : null}
          </form>

          <div className="mt-8 rounded-2xl bg-[#F5F8F3] px-4 py-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
              <p className="text-sm leading-6 text-[#667164]">
                The reset link goes to your email and expires shortly after it is
                sent, so nobody else can use it.
              </p>
            </div>
          </div>

          <p className="mt-7 text-center text-sm text-[#667164]">
            Remembered your password?{" "}
            <button type="button" onClick={() => navigate("/login")} className="font-semibold text-[#1E6B37]">
              Back to login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileForgot({ email, setEmail, handleSubmit, navigate, busy, sent, error }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:hidden">
      <div className="rounded-b-[32px] bg-[#145A32] px-5 pb-8 pt-8 text-white">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FaidaFarm logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-[28px] font-bold leading-none">FaidaFarm</h1>
            <p className="mt-1 text-xs text-white/80">Password Recovery</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-white/80">Recover account</p>
          <h2 className="mt-2 text-[34px] font-bold leading-tight">
            Forgot your password?
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Choose phone or email to receive a one-time verification code.
          </p>
        </div>
      </div>

      <div className="-mt-4 flex-1 px-4 pb-8">
        <div className="rounded-[28px] border border-[#E7ECE5] bg-white p-5 shadow-[0_8px_30px_rgba(25,40,20,0.05)]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Email address"
              placeholder="you@example.com"
              icon={Mail}
              type="email"
              mobile
              value={email}
              onChange={setEmail}
            />

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Sending..." : "Send reset link"}
              {busy ? null : <ArrowRight className="h-4 w-4" />}
            </button>

            {sent ? (
              <p className="rounded-2xl bg-[#EDF7EE] px-4 py-3 text-sm leading-6 text-[#1E6B37]">
                If that email has an account, a reset link is on its way.
              </p>
            ) : null}

            {error ? (
              <p className="rounded-2xl bg-[#FBEEE9] px-4 py-3 text-sm leading-6 text-[#8C3A22]">
                {error}
              </p>
            ) : null}
          </form>

          <div className="mt-6 rounded-2xl bg-[#F5F8F3] px-4 py-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
              <p className="text-sm leading-6 text-[#667164]">
                The reset link goes to your email and expires shortly after it is sent.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[#667164]">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-[#1E6B37]"
            >
              Back to login
            </button>
          </p>
        </div>
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
