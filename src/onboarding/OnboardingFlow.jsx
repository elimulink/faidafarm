// The way in for someone who has never opened FaidaFarm: a splash, a sentence
// about what it is, and a door to the real sign-up.
//
// This used to collect a name, a phone number and crops itself, then call
// createMockUser and let the person straight into the dashboard. That was a
// full authentication bypass - no Firebase account, no password, no backend
// record - and it sat beside a login screen that does the job properly. It also
// meant a farmer typed a name and county here, then typed them again on the
// real signup form.
//
// So it introduces and hands off. Accounts are created in one place, by
// Firebase, and crops are collected by the crop guard once there is an account
// to attach them to.

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RESEARCH_WORKSPACE_ENABLED } from "../config/features";

const SPLASH_MS = 1500;

export default function OnboardingFlow() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-white px-6">
        <div className="text-center">
          <img src="/logo.png" alt="FaidaFarm" className="mx-auto h-24 w-24 object-contain" />
          <h1 className="mt-5 text-3xl font-bold text-[#0F1A12]">FaidaFarm</h1>
          <p className="mt-2 text-sm font-medium text-[#2F8F46]">
            {RESEARCH_WORKSPACE_ENABLED
              ? "Farm smarter. Research better."
              : "Farm smarter. Earn more."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-white text-[#0F1A12]">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[520px] flex-col px-6 pb-7 pt-7">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-[#1E6B37]"
          >
            Sign in
          </button>
        </div>

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
              : "Know when to sell, what markets are paying, and which buyers are worth the transport."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="mt-12 flex w-full items-center justify-center gap-2 rounded-full bg-[#166534] px-6 py-4 text-base font-semibold text-white"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="mt-5 text-center text-sm text-[#667164]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-[#1E6B37]"
            >
              Sign in
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
