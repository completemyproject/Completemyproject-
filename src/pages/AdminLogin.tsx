import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, hasRole, signOut, mapAuthError } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await signInWithEmail(email, password);

    if (error) {
      toast.error(mapAuthError(error.message));
      setLoading(false);
      return;
    }

    if (!data.user) {
      toast.error("Login failed. Please try again.");
      setLoading(false);
      return;
    }

    const isAdmin = await hasRole(data.user.id, "admin");
    if (!isAdmin) {
      await signOut();
      toast.error("You don't have admin access");
      setLoading(false);
      return;
    }

    navigate("/admin");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-brand-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center">
            <Lock className="w-6 h-6 text-accent" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
          Admin Login
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-6">
          Complete My Project — CRM Dashboard
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full text-base font-semibold py-6"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
