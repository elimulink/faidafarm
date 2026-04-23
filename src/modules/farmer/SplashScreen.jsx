export default function SplashScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#145A32]">
      <div className="text-center">
        <img src="/logo.png" alt="FaidaFarm" className="mx-auto mb-6 w-32" />

        <h1 className="text-3xl font-bold text-white">FaidaFarm</h1>

        <p className="mt-2 text-sm text-white/80">Turn your farm into profit</p>
      </div>
    </div>
  );
}
