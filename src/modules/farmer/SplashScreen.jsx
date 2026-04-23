import React from "react";

export default function SplashScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#145A32] px-6 text-white">
      <div className="text-center">
        <img src="/logo.png" alt="FaidaFarm" className="mx-auto mb-6 w-32 object-contain" />
        <h1 className="text-3xl font-bold leading-none">FaidaFarm</h1>
      </div>

      <p className="absolute bottom-14 left-6 right-6 text-center text-sm font-medium text-white/80">
        Turn your farm into profit
      </p>
    </div>
  );
}
