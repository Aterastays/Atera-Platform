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
    <div className="min-h-screen bg-[#080709] flex flex-col items-center justify-center p-4 relative grain-overlay">
      <div className="w-full max-w-[420px] bg-[#0D0C0F] border border-[rgba(201,168,76,0.15)] p-10 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src="/atera-logo.svg" height="64" alt="Atera Stays" className="mb-6 w-16 h-16" />
          <h3 className="font-display text-2xl text-white mb-2">Atera Stays</h3>
          <div className="label-style text-grey-1">Hub Access — Internal Only</div>
        </div>

        <div className="gold-rule mb-8"></div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <input 
              type="email" 
              required
              placeholder="Email Address"
              className="w-full bg-[#0D0C0F] border border-border-light border-b-[rgba(201,168,76,0.3)] text-white p-3 font-body font-light focus:border-gold outline-none transition-colors"
              value={email}
              onChange={e => setEmail(e.target.value)}
              data-testid="input-email"
            />
          </div>
          <div>
            <input 
              type="password" 
              required
              placeholder="Password"
              className="w-full bg-[#0D0C0F] border border-border-light border-b-[rgba(201,168,76,0.3)] text-white p-3 font-body font-light focus:border-gold outline-none transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
              data-testid="input-password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-gold w-full justify-center py-4 mt-4 disabled:opacity-50"
            data-testid="btn-signin"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>

          {error && (
            <div className="text-error text-sm text-center mt-2 bg-error/10 p-2 border border-error/20">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
