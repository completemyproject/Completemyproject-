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
import { cn } from "@/lib/utils";

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
    contactName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateSignup = () => {
    const next: Record<string, string> = {};
    if (!signup.businessName.trim()) next.businessName = "Business name is required.";
    // no business type selection required (default to sole_trader)
    if (!signup.contactName.trim()) next.contactName = "Contact name is required.";
    if (signup.contactNumber.trim()) {
      const digits = signup.contactNumber.replace(/[\s()+-]/g, "");
      if (!/^(?:44|0)\d{9,10}$/.test(digits)) next.contactNumber = "Enter a valid UK phone number.";
    }
    if (!signup.email.trim()) next.email = "Email address is required.";
    else if (!EMAIL_RE.test(signup.email.trim())) next.email = "Enter a valid email address.";
    if (!signup.password) next.password = "Password is required.";
    else if (signup.password.length < 6) next.password = "Use at least 6 characters.";
    if (!signup.confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (signup.password !== signup.confirmPassword) next.confirmPassword = "Passwords don't match.";
    return next;
  };

  const setSignupField = (field: keyof typeof signup, value: string | boolean) => {
    setSignup((s) => ({ ...s, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const rest = { ...prev };
      delete rest[field];
      return rest;
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSignup();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Please check the form",
        description: "Some details need fixing before you can submit.",
        variant: "destructive",
      });
      return;
    }
    setErrors({});

    setLoading(true);
    const { data, error } = await signUpContractor({
      email: signup.email,
      password: signup.password,
      businessName: signup.businessName,
      // default business type now set by server/frontend to 'sole_trader'
      businessType: "sole_trader",
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
      contactName: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const inputCls =
    "w-full h-11 px-3.5 rounded-xl border border-warm-200 bg-warm-50 text-sm text-ink-900 placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition";
  const errInputCls = "border-red-400 focus:ring-red-400/40 focus:border-red-400";
  const errTextCls = "text-xs text-red-500 mt-1.5";
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
              Tradesperson Portal
            </h1>
            <p className="text-sm text-ink-500 max-w-md mx-auto">
              Log in to your dashboard or apply to join our vetted panel of multi-trade companies.
            </p>
          </div>

          <div className="bg-warm-50 rounded-2xl shadow-lifted border border-warm-200 overflow-hidden">
            <div className="grid grid-cols-2 gap-2 p-2 border-b border-warm-200">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  resetForgotState();
                }}
                className={`flex items-center justify-center py-3 text-sm font-semibold tracking-wide rounded-xl border-2 transition ${
                  tab === "login"
                    ? "bg-warm-50 text-ink-900 border-warm-200 shadow-sm"
                    : "bg-warm-100 text-ink-500 border-transparent hover:text-ink-900"
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
                className={`flex items-center justify-center py-3 text-sm font-semibold tracking-wide rounded-xl border-4 border-accent transition ${
                  tab === "signup"
                    ? "bg-accent text-accent-foreground"
                    : "bg-warm-50 text-ink-900 hover:bg-warm-100"
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
                  <div>
                    <label className={labelCls}>Business name *</label>
                    <input
                      type="text"
                      value={signup.businessName}
                      onChange={(e) => setSignupField("businessName", e.target.value)}
                      className={cn(inputCls, errors.businessName && errInputCls)}
                      placeholder="Acme Building Ltd"
                    />
                    {errors.businessName && <p className={errTextCls}>{errors.businessName}</p>}
                  </div>

                  {/* Business type removed — default set to 'sole_trader' on signup */}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Contact name *</label>
                      <input
                        type="text"
                        value={signup.contactName}
                        onChange={(e) => setSignupField("contactName", e.target.value)}
                        className={cn(inputCls, errors.contactName && errInputCls)}
                        placeholder="Jane Smith"
                      />
                      {errors.contactName && <p className={errTextCls}>{errors.contactName}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Contact number</label>
                      <input
                        type="tel"
                        value={signup.contactNumber}
                        onChange={(e) => setSignupField("contactNumber", e.target.value)}
                        className={cn(inputCls, errors.contactNumber && errInputCls)}
                        placeholder="07000 000000"
                      />
                      {errors.contactNumber && <p className={errTextCls}>{errors.contactNumber}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Email address *</label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={signup.email}
                      onChange={(e) => setSignupField("email", e.target.value)}
                      className={cn(inputCls, errors.email && errInputCls)}
                      placeholder="you@company.co.uk"
                    />
                    {errors.email && <p className={errTextCls}>{errors.email}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Password *</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={signup.password}
                        onChange={(e) => setSignupField("password", e.target.value)}
                        className={cn(inputCls, errors.password && errInputCls)}
                        placeholder="Min. 6 characters"
                      />
                      {errors.password && <p className={errTextCls}>{errors.password}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Confirm password *</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={signup.confirmPassword}
                        onChange={(e) => setSignupField("confirmPassword", e.target.value)}
                        className={cn(inputCls, errors.confirmPassword && errInputCls)}
                        placeholder="Repeat password"
                      />
                      {errors.confirmPassword && <p className={errTextCls}>{errors.confirmPassword}</p>}
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
