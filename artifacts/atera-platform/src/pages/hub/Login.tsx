import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type View = "login" | "forgot" | "forgot-sent";

export function HubLogin() {
  const [view, setView] = useState<View>("login");
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
      setIsLoading(false);
      setLocation("/hub/dashboard");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/hub/reset-password`,
    });
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setView("forgot-sent");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)"
      }} />

      <div className="relative w-full max-w-[360px]">
        <div className="flex flex-col items-center mb-10">
          <img src="/atera-logo.png" alt="Atera Stays" className="h-14 w-auto mb-6" />
          <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1">Operations Hub</h1>
          <p className="text-[#636366] text-[13px]">Internal access only</p>
        </div>

        {view === "login" && (
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

            <button
              type="button"
              onClick={() => { setError(null); setView("forgot"); }}
              className="text-[#636366] text-[13px] text-center hover:text-white transition-colors mt-1"
            >
              Forgot password?
            </button>
          </form>
        )}

        {view === "forgot" && (
          <form onSubmit={handleForgot} className="flex flex-col gap-3">
            <p className="text-[#a1a1a6] text-[14px] text-center mb-1">
              Enter your email and we'll send a reset link.
            </p>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              className="w-full bg-[#1c1c1e] border border-[#2c2c2e] text-white text-[15px] px-4 py-3 rounded-[12px] outline-none placeholder:text-[#636366] focus:border-[#636366] transition-colors duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            >
              {isLoading ? "Sending…" : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => { setError(null); setView("login"); }}
              className="text-[#636366] text-[13px] text-center hover:text-white transition-colors mt-1"
            >
              Back to sign in
            </button>
          </form>
        )}

        {view === "forgot-sent" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1c1c1e] flex items-center justify-center text-[24px]">
              ✉️
            </div>
            <p className="text-white text-[17px] font-semibold">Check your email</p>
            <p className="text-[#a1a1a6] text-[14px] leading-relaxed">
              A password reset link has been sent to <span className="text-white">{email}</span>.
              Click the link to set a new password.
            </p>
            <button
              type="button"
              onClick={() => { setError(null); setView("login"); }}
              className="text-[#636366] text-[13px] hover:text-white transition-colors mt-2"
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
