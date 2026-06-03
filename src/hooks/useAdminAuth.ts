import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { hasRole, signOut } from "@/lib/auth";
import { toast } from "sonner";

export function useAdminAuth() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/admin/login", { replace: true });
      }
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const isAdmin = await hasRole(session.user.id, "admin");
      if (!isAdmin) {
        toast.error("You don't have admin access");
        await signOut();
        navigate("/admin/login", { replace: true });
        return;
      }

      setAuthChecked(true);
    })();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const logout = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return { authChecked, logout };
}
