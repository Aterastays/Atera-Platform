import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useLocation } from "wouter";

export function HubLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
      setLocation("/hub/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)"
      }} />

      <div className="relative w-full max-w-[360px]">
        {/* Logo + title */}
        <div className="flex flex-col items-center mb-10">
          <img src="/atera-logo.png" alt="Atera Stays" className="h-14 w-auto mb-6" />
          <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1">Operations Hub</h1>
          <p className="text-[#636366] text-[13px]">Internal access only</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            className="w-full bg-[#1c1c1e] border border-[#2c2c2e] text-white text-[15px] px-4 py-3 rounded-[12px] outline-none placeholder:text-[#636366] focus:border-[#636366] transition-colors duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="input-email"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            className="w-full bg-[#1c1c1e] border border-[#2c2c2e] text-white text-[15px] px-4 py-3 rounded-[12px] outline-none placeholder:text-[#636366] focus:border-[#636366] transition-colors duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="input-password"
          />

          {error && (
            <div className="bg-[#2c1c1c] border border-[#ff3b30]/30 text-[#ff3b30] text-[13px] text-center px-4 py-2.5 rounded-[10px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-3 rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200 disabled:opacity-40 mt-2"
            data-testid="btn-signin"
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
