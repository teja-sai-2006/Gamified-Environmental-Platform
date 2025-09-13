import { Button } from "@/components/ui/button";
// ...existing code...
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useState } from "react";

export default function SignInPage() {
  const { setSession } = useAuth();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // If navigated with ?role=admin, show a hint
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search);
      if (q.get('role') === 'admin') setIsAdminMode(true);
    }
  }, []);

  const signin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      if (!data.ok) throw new Error('Invalid credentials or not approved yet');
  setSession({ role: data.role, username: data.username });
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (e: any) {
      // If login failed, detect if the application is pending
      try {
        const st = await fetch(`/api/application-status/${encodeURIComponent(username)}`).then(r => r.json());
        if (st?.status === 'pending') {
          setPendingUser(username);
          setError(null);
        } else {
          setError(e?.message || 'Login error');
        }
      } catch {
        setError(e?.message || 'Login error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Poll for approval when pending
  useEffect(() => {
    if (!pendingUser) return;
    let timer: number | undefined;
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      setChecking(true);
      try {
        const st = await fetch(`/api/application-status/${encodeURIComponent(pendingUser)}`).then(r => r.json());
        if (st?.status === 'approved') {
          setChecking(false);
          // Try logging in again with same credentials to route correctly
          setPendingUser(null);
          await signin();
          return;
        }
      } catch {}
      setChecking(false);
      timer = window.setTimeout(tick, 3000);
    };
    tick();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [pendingUser]);

  return (
        <div
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        backgroundImage: `url(/api/image/foster-lake.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-black/50"></div>
      
      {/* Glassmorphism container */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-white shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Sign In</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto mt-2"></div>
        </div>
        
        {isAdminMode && (
          <p className="mb-4 text-blue-200 text-sm bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
            Admin sign-in: use username <span className="text-white font-semibold">admin123</span> and your password.
          </p>
        )}
        
        <div className="space-y-4">
          {pendingUser && (
            <div className="p-4 rounded-xl bg-orange-500/20 backdrop-blur-sm border border-orange-400/30">
              <div className="font-medium text-orange-100">@{pendingUser}</div>
              <div className="text-sm text-orange-200">Your application is pending admin approval.</div>
              <div className="text-xs text-orange-300 mt-1">We'll check automatically and continue once approved{checking ? '…' : '.'}</div>
              <div className="mt-3 flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setPendingUser(null)}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20"
                >
                  Back to Sign In
                </Button>
                <Button 
                  variant="secondary" 
                  disabled
                  className="bg-orange-500/20 backdrop-blur-sm border-orange-400/30 cursor-not-allowed"
                >
                  {checking ? 'Checking…' : 'Waiting'}
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Username</label>
              <input 
                className="w-full rounded-xl px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200" 
                placeholder="Enter your username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full rounded-xl px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200" 
                placeholder="Enter your password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-300 text-sm bg-red-500/20 backdrop-blur-sm rounded-lg p-3 border border-red-400/30">
              {error}
            </div>
          )}
          
          <div className="pt-2">
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0" 
              onClick={signin} 
              disabled={loading || !username || !password}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in…
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
          
          <div className="text-center text-blue-200 text-sm">
            New here? 
            <a href="/signup" className="text-white font-semibold hover:text-blue-200 ml-1 underline underline-offset-2 transition-colors duration-200">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
