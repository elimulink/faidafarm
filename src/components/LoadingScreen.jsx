import React, { useEffect, useState } from "react";

/**
 * A full-screen wait, for the moments the app genuinely cannot continue until
 * the backend answers.
 *
 * The explanation about the server is held back for five seconds. Most waits
 * end well before that, and a farmer who is told the server is asleep every
 * time they sign in learns to distrust the app. Only a wait long enough to
 * look broken gets explained.
 *
 * Borrowed from MUCO, which does the same thing for the same reason.
 */
export default function LoadingScreen({ message = "Loading", slowAfterMs = 5000 }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), slowAfterMs);
    return () => clearTimeout(timer);
  }, [slowAfterMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[#F6F8F4] px-6"
    >
      <div className="relative grid h-[92px] w-[92px] place-items-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#166534]/20 border-t-[#166534]"
        />
        <img
          src="/logo.png"
          alt=""
          className="h-[68px] w-[68px] rounded-full bg-white p-1.5 shadow-[0_6px_22px_rgba(0,0,0,0.14)]"
        />
      </div>

      <span className="text-[16px] font-extrabold tracking-[0.14em] text-[#1E2720]">
        FaidaFarm
      </span>

      <p className="text-sm text-[#667164]">{message}</p>

      {slow ? (
        <p className="max-w-[320px] text-center text-[12.5px] leading-5 text-[#667164]">
          Waking up the server &mdash; the first load after a quiet period can take
          up to a minute. Hang tight.
        </p>
      ) : null}
    </div>
  );
}
