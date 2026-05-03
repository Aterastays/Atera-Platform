import { Link } from "wouter";

export function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#6e6e73] mb-6">404</p>
      <h1 className="text-[56px] md:text-[76px] font-bold tracking-[-0.03em] text-white leading-[1.0] mb-6">
        Page not found.
      </h1>
      <p className="text-[17px] text-[#a1a1a6] mb-10 max-w-sm leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <button className="bg-white text-black px-7 py-[12px] rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
