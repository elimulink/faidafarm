import React, { useRef, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FarmerOtpVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  function handleVerify() {
    // Placeholder OTP verification until backend auth is connected.
    navigate("/reset-password");
  }

  return (
    <div className="min-h-screen bg-[#F6F8F4]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <DesktopOtp
          otp={otp}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
          inputsRef={inputsRef}
          handleVerify={handleVerify}
        />
        <MobileOtp
          otp={otp}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
          inputsRef={inputsRef}
          handleVerify={handleVerify}
        />
      </div>
    </div>
  );
}

function DesktopOtp({ otp, handleChange, handleKeyDown, inputsRef, handleVerify }) {
  return (
    <div className="hidden w-full lg:flex">
      <div className="flex w-[46%] flex-col justify-between border-r border-[#E7ECE5] bg-[#145A32] px-10 py-10 text-white xl:px-14">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="FaidaFarm logo" className="h-14 w-14 object-contain" />
            <div>
              <h1 className="text-[32px] font-bold leading-none">FaidaFarm</h1>
              <p className="mt-1 text-sm text-white/80">OTP Verification</p>
            </div>
          </div>

          <div className="mt-16 max-w-[520px]">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
              Secure Verification
            </p>
            <h2 className="mt-6 text-[52px] font-bold leading-[1.05]">
              Enter the code
              <br />
              sent to your
              <br />
              account.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/85">
              We sent a 6-digit verification code to your phone or email. Enter it
              below to continue securely.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-[#D9F3DF]" />
            <p className="text-sm leading-7 text-white/85">
              OTP verification helps prevent unauthorized password resets.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-[54%] items-center justify-center px-6 py-10 xl:px-12">
        <div className="w-full max-w-[540px] rounded-[32px] border border-[#E7ECE5] bg-white p-8 shadow-[0_8px_30px_rgba(25,40,20,0.05)] xl:p-10">
          <p className="text-sm font-medium text-[#6B7468]">Step 2 of 3</p>
          <h3 className="mt-2 text-[38px] font-bold leading-tight text-[#1E2720]">
            Verify OTP code
          </h3>
          <p className="mt-3 text-[15px] leading-7 text-[#667164]">
            Enter the 6-digit code sent to <span className="font-semibold">+254 7XX XXX XXX</span>
          </p>

          <div className="mt-8 flex items-center justify-between gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputsRef.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(event.target.value, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className="h-16 w-16 rounded-2xl border border-[#DDE4D9] bg-[#FAFCF8] text-center text-2xl font-bold text-[#1E2720] outline-none focus:border-[#166534]"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white hover:bg-[#14582D]"
          >
            Verify Code
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button type="button" className="font-semibold text-[#1E6B37]">
              Resend code
            </button>
            <span className="text-[#667164]">Code expires in 01:45</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileOtp({ otp, handleChange, handleKeyDown, inputsRef, handleVerify }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:hidden">
      <div className="rounded-b-[32px] bg-[#145A32] px-5 pb-8 pt-8 text-white">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FaidaFarm logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-[28px] font-bold leading-none">FaidaFarm</h1>
            <p className="mt-1 text-xs text-white/80">OTP Verification</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-white/80">Step 2 of 3</p>
          <h2 className="mt-2 text-[34px] font-bold leading-tight">
            Enter your OTP code
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Enter the 6-digit code sent to your phone or email.
          </p>
        </div>
      </div>

      <div className="-mt-4 flex-1 px-4 pb-8">
        <div className="rounded-[28px] border border-[#E7ECE5] bg-white p-5 shadow-[0_8px_30px_rgba(25,40,20,0.05)]">
          <div className="grid grid-cols-6 gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputsRef.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(event.target.value, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className="h-14 w-full rounded-2xl border border-[#DDE4D9] bg-[#FAFCF8] text-center text-xl font-bold text-[#1E2720] outline-none focus:border-[#166534]"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-4 text-[15px] font-semibold text-white"
          >
            Verify Code
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="mt-5 flex items-center justify-between text-sm">
            <button type="button" className="font-semibold text-[#1E6B37]">
              Resend
            </button>
            <span className="text-[#667164]">01:45</span>
          </div>
        </div>
      </div>
    </div>
  );
}
