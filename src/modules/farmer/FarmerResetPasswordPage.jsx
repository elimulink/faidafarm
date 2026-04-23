import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FarmerResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    // Placeholder reset flow until backend auth is connected.
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#F6F8F4]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <DesktopReset
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleSubmit={handleSubmit}
        />
        <MobileReset
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

function DesktopReset({
  showPassword,
  setShowPassword,
  showConfirm,
  setShowConfirm,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
}) {
  return (
    <div className="hidden w-full lg:flex">
      <div className="flex w-[46%] flex-col justify-between border-r border-[#E7ECE5] bg-[#145A32] px-10 py-10 text-white xl:px-14">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="FaidaFarm logo" className="h-14 w-14 object-contain" />
            <div>
              <h1 className="text-[32px] font-bold leading-none">FaidaFarm</h1>
              <p className="mt-1 text-sm text-white/80">Reset Password</p>
            </div>
          </div>

          <div className="mt-16 max-w-[520px]">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
              Step 3 of 3
            </p>
            <h2 className="mt-6 text-[52px] font-bold leading-[1.05]">
              Create a new
              <br />
              secure password
              <br />
              for your account.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/85">
              Choose a strong password you can remember and use it to secure access
              to your account.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-[#D9F3DF]" />
            <p className="text-sm leading-7 text-white/85">
              Use at least 8 characters and avoid very common passwords.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-[54%] items-center justify-center px-6 py-10 xl:px-12">
        <div className="w-full max-w-[540px] rounded-[32px] border border-[#E7ECE5] bg-white p-8 shadow-[0_8px_30px_rgba(25,40,20,0.05)] xl:p-10">
          <p className="text-sm font-medium text-[#6B7468]">Final step</p>
          <h3 className="mt-2 text-[38px] font-bold leading-tight text-[#1E2720]">
            Reset your password
          </h3>
          <p className="mt-3 text-[15px] leading-7 text-[#667164]">
            Enter your new password below.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <PasswordField
              label="New password"
              placeholder="Create a new password"
              show={showPassword}
              setShow={setShowPassword}
              value={password}
              onChange={setPassword}
            />

            <PasswordField
              label="Confirm password"
              placeholder="Re-enter your password"
              show={showConfirm}
              setShow={setShowConfirm}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white hover:bg-[#14582D]"
            >
              Save New Password
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 rounded-2xl bg-[#F5F8F3] px-4 py-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#2F8F46]" />
              <p className="text-sm leading-6 text-[#667164]">
                After resetting, use your new password on your next login.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileReset({
  showPassword,
  setShowPassword,
  showConfirm,
  setShowConfirm,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
}) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:hidden">
      <div className="rounded-b-[32px] bg-[#145A32] px-5 pb-8 pt-8 text-white">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FaidaFarm logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-[28px] font-bold leading-none">FaidaFarm</h1>
            <p className="mt-1 text-xs text-white/80">Reset Password</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-white/80">Final step</p>
          <h2 className="mt-2 text-[34px] font-bold leading-tight">
            Create a new password
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Secure your account with a strong new password.
          </p>
        </div>
      </div>

      <div className="-mt-4 flex-1 px-4 pb-8">
        <div className="rounded-[28px] border border-[#E7ECE5] bg-white p-5 shadow-[0_8px_30px_rgba(25,40,20,0.05)]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <PasswordField
              label="New password"
              placeholder="Create a new password"
              show={showPassword}
              setShow={setShowPassword}
              mobile
              value={password}
              onChange={setPassword}
            />

            <PasswordField
              label="Confirm password"
              placeholder="Re-enter your password"
              show={showConfirm}
              setShow={setShowConfirm}
              mobile
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white"
            >
              Save New Password
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  show,
  setShow,
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
        <Lock className="h-5 w-5 text-[#6E796C]" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] text-[#1E2720] placeholder:text-[#8A9488] outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="text-[#6E796C]"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
