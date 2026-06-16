import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import {
  getSession,
  resolveContractorAccess,
  signInWithEmail,
  signUpContractor,
  requestPasswordReset,
  mapAuthError,
} from "@/lib/auth";
import { notifyAccountPendingReview } from "@/lib/emailService";

type Tab = "login" | "signup";

export default function TradesLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [login, setLogin] = useState({ email: "", password: "" });
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [signup, setSignup] = useState({
    businessName: "",
    companyNumber: "",
    isLtd: false,
    isSoleTrader: false,
    numberOfDirectors: "",
    contactName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        setCheckingSession(false);
        return;
      }
      const { isContractor, profile } = await resolveContractorAccess(session.user.id);
      if (isContractor && profile) {
        navigate("/trades-dashboard", { replace: true });
        return;
      }
      setCheckingSession(false);
    })();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.email.trim() || !login.password.trim()) {
      toast({
        title: "Missing details",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { data, error } = await signInWithEmail(login.email, login.password);
    setLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: mapAuthError(error.message),
        variant: "destructive",
      });
      return;
    }

    if (!data.user) {
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    const { isContractor, profile } = await resolveContractorAccess(data.user.id);

    if (!isContractor || !profile) {
      toast({
        title: "No tradesperson account",
        description:
          "Sign up under Apply to join the panel, or use the email you registered with as a tradesperson.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Welcome back", description: "Loading your dashboard..." });
    navigate("/trades-dashboard", { replace: true });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast({
        title: "Missing email",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await requestPasswordReset(forgotEmail);
    setLoading(false);

    if (error) {
      toast({
        title: "Could not send reset link",
        description: mapAuthError(error.message),
        variant: "destructive",
      });
      return;
    }

    setForgotSent(true);
  };

  const resetForgotState = () => {
    setForgotMode(false);
    setForgotSent(false);
    setForgotEmail("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signup.businessName || !signup.contactName || !signup.email) {
      toast({
        title: "Please complete the required fields",
        description: "Business name, contact name and email are required.",
        variant: "destructive",
      });
      return;
    }
    if (!signup.isLtd && !signup.isSoleTrader) {
      toast({
        title: "Business type required",
        description: "Select Ltd company or Sole trader.",
        variant: "destructive",
      });
      return;
    }
    if (signup.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (signup.password !== signup.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please confirm your password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { data, error } = await signUpContractor({
      email: signup.email,
      password: signup.password,
      businessName: signup.businessName,
      companyNumber: signup.companyNumber,
      businessType: signup.isLtd ? "ltd" : "sole_trader",
      numberOfDirectors: signup.numberOfDirectors,
      contactName: signup.contactName,
      contactPhone: signup.contactNumber,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Sign up failed",
        description: mapAuthError(error.message),
        variant: "destructive",
      });
      return;
    }

    notifyAccountPendingReview({
      email: signup.email.trim().toLowerCase(),
      contactName: signup.contactName,
      businessName: signup.businessName,
      phone: signup.contactNumber || undefined,
      businessType: signup.isLtd ? "Ltd company" : "Sole trader",
    });

    if (data.session) {
      toast({
        title: "Application submitted",
        description: "Your account is pending admin approval (usually within 72 hours).",
      });
      navigate("/trades-dashboard", { replace: true });
      return;
    }

    toast({
      title: "Check your email",
      description:
        "We sent a confirmation link. After confirming, log in to see your application status.",
    });
    setTab("login");
    setLogin({ email: signup.email.trim().toLowerCase(), password: "" });
    setSignup({
      businessName: "",
      companyNumber: "",
      isLtd: false,
      isSoleTrader: false,
      numberOfDirectors: "",
      contactName: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const inputCls =
    "w-full h-11 px-3.5 rounded-xl border border-warm-200 bg-warm-50 text-sm text-ink-900 placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition";
  const labelCls = "block text-xs font-semibold text-ink-900 mb-1.5 tracking-wide";

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-warm-100 flex items-center justify-center">
        <p className="text-sm text-ink-500">Loading...</p>
      </div>
    );
  }

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
              Tradesperson portal
            </h1>
            <p className="text-sm text-ink-500 max-w-md mx-auto">
              Log in to your dashboard or apply to join our vetted panel of multi-trade companies.
            </p>
          </div>

          <div className="bg-warm-50 rounded-2xl shadow-lifted border border-warm-200 overflow-hidden">
            <div className="grid grid-cols-2 border-b border-warm-200">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  resetForgotState();
                }}
                className={`py-3.5 text-sm font-semibold tracking-wide transition ${
                  tab === "login"
                    ? "bg-warm-50 text-ink-900 border-b-2 border-accent -mb-px"
                    : "bg-warm-100 text-ink-500 hover:text-ink-900"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("signup");
                  resetForgotState();
                }}
                className={`py-3.5 text-sm font-semibold tracking-wide transition ${
                  tab === "signup"
                    ? "bg-warm-50 text-ink-900 border-b-2 border-accent -mb-px"
                    : "bg-warm-100 text-ink-500 hover:text-ink-900"
                }`}
              >
                Sign up
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {tab === "login" && forgotMode ? (
                forgotSent ? (
                  <div className="space-y-4 text-center py-4">
                    <p className="text-sm text-ink-900 font-semibold">Check your email</p>
                    <p className="text-sm text-ink-500">
                      If an account exists for <span className="font-medium text-ink-900">{forgotEmail.trim()}</span>,
                      we&apos;ve sent a link to reset your password.
                    </p>
                    <button
                      type="button"
                      onClick={resetForgotState}
                      className="text-accent font-semibold text-sm hover:underline"
                    >
                      Back to login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <p className="text-sm text-ink-500 mb-4">
                        Enter the email address for your account and we&apos;ll send you a link to reset your
                        password.
                      </p>
                      <label className={labelCls} htmlFor="forgot-email">
                        Email address
                      </label>
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className={inputCls}
                        placeholder="you@company.co.uk"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-accent-foreground font-semibold h-12 rounded-xl text-sm transition shadow-lifted"
                    >
                      {loading ? "Sending..." : "Send reset link"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-ink-500 text-center pt-2">
                      <button
                        type="button"
                        onClick={resetForgotState}
                        className="text-accent font-semibold hover:underline"
                      >
                        Back to login
                      </button>
                    </p>
                  </form>
                )
              ) : tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className={labelCls} htmlFor="login-email">
                      Email address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={login.email}
                      onChange={(e) => setLogin({ ...login, email: e.target.value })}
                      className={inputCls}
                      placeholder="you@company.co.uk"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={labelCls + " mb-0"} htmlFor="login-password">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(login.email);
                          setForgotMode(true);
                          setForgotSent(false);
                        }}
                        className="text-xs font-semibold text-accent hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      value={login.password}
                      onChange={(e) => setLogin({ ...login, password: e.target.value })}
                      className={inputCls}
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-accent-foreground font-semibold h-12 rounded-xl text-sm transition shadow-lifted"
                  >
                    {loading ? "Signing in..." : "Log in to dashboard"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-ink-500 text-center pt-2">
                    Don&apos;t have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("signup")}
                      className="text-accent font-semibold hover:underline"
                    >
                      Apply to join the panel
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Business name *</label>
                      <input
                        type="text"
                        value={signup.businessName}
                        onChange={(e) => setSignup({ ...signup, businessName: e.target.value })}
                        className={inputCls}
                        placeholder="Acme Building Ltd"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Company number</label>
                      <input
                        type="text"
                        value={signup.companyNumber}
                        onChange={(e) => setSignup({ ...signup, companyNumber: e.target.value })}
                        className={inputCls}
                        placeholder="12345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Business type *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2.5 px-3.5 h-11 rounded-xl border border-warm-200 bg-warm-50 cursor-pointer hover:border-accent/60 transition">
                        <input
                          type="checkbox"
                          checked={signup.isLtd}
                          onChange={(e) =>
                            setSignup({
                              ...signup,
                              isLtd: e.target.checked,
                              isSoleTrader: e.target.checked ? false : signup.isSoleTrader,
                            })
                          }
                          className="w-4 h-4 accent-accent"
                        />
                        <span className="text-sm text-ink-900">Ltd company</span>
                      </label>
                      <label className="flex items-center gap-2.5 px-3.5 h-11 rounded-xl border border-warm-200 bg-warm-50 cursor-pointer hover:border-accent/60 transition">
                        <input
                          type="checkbox"
                          checked={signup.isSoleTrader}
                          onChange={(e) =>
                            setSignup({
                              ...signup,
                              isSoleTrader: e.target.checked,
                              isLtd: e.target.checked ? false : signup.isLtd,
                            })
                          }
                          className="w-4 h-4 accent-accent"
                        />
                        <span className="text-sm text-ink-900">Sole trader</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Number of directors</label>
                    <input
                      type="number"
                      min={0}
                      value={signup.numberOfDirectors}
                      onChange={(e) => setSignup({ ...signup, numberOfDirectors: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. 2"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Contact name *</label>
                      <input
                        type="text"
                        value={signup.contactName}
                        onChange={(e) => setSignup({ ...signup, contactName: e.target.value })}
                        className={inputCls}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Contact number</label>
                      <input
                        type="tel"
                        value={signup.contactNumber}
                        onChange={(e) => setSignup({ ...signup, contactNumber: e.target.value })}
                        className={inputCls}
                        placeholder="07000 000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Email address *</label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={signup.email}
                      onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                      className={inputCls}
                      placeholder="you@company.co.uk"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Password *</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={signup.password}
                        onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                        className={inputCls}
                        placeholder="Min. 6 characters"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Confirm password *</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={signup.confirmPassword}
                        onChange={(e) => setSignup({ ...signup, confirmPassword: e.target.value })}
                        className={inputCls}
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-ink-500 bg-warm-100 border border-warm-200 rounded-xl p-3">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <p>
                      All applications are reviewed by our team. You&apos;ll be contacted within 72 hours,
                      and access to your dashboard is only granted once your company passes our 6-Point
                      Gold Standard vetting.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-accent-foreground font-semibold h-12 rounded-xl text-sm transition shadow-lifted"
                  >
                    {loading ? "Submitting..." : "Submit application"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-xs text-ink-500 text-center pt-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="text-accent font-semibold hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-ink-500 mt-6">
            Need help?{" "}
            <Link to="/contact" className="text-accent font-semibold hover:underline">
              Contact our team
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
