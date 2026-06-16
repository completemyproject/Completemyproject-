import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mapAuthError, updatePassword } from "@/lib/auth";

export default function TradesResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please confirm your new password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      toast({
        title: "Could not update password",
        description: mapAuthError(error.message),
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Password updated", description: "You can now log in with your new password." });
    navigate("/trades-login", { replace: true });
  };

  const inputCls =
    "w-full h-11 px-3.5 rounded-xl border border-warm-200 bg-warm-50 text-sm text-ink-900 placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition";
  const labelCls = "block text-xs font-semibold text-ink-900 mb-1.5 tracking-wide";

  return (
    <div className="min-h-screen bg-warm-100 flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
              For tradespeople
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 mb-3">
              Reset your password
            </h1>
            <p className="text-sm text-ink-500 max-w-md mx-auto">
              Choose a new password for your tradesperson account.
            </p>
          </div>

          <div className="bg-warm-50 rounded-2xl shadow-lifted border border-warm-200 overflow-hidden p-6 sm:p-8">
            {!ready ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-ink-500">
                  This link is invalid or has expired. Please request a new password reset link from the login
                  page.
                </p>
                <Link to="/trades-login" className="text-accent font-semibold text-sm hover:underline">
                  Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls} htmlFor="new-password">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputCls}
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="confirm-password">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputCls}
                    placeholder="Repeat password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-accent-foreground font-semibold h-12 rounded-xl text-sm transition shadow-lifted"
                >
                  {loading ? "Updating..." : "Update password"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
