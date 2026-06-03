import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  getContractorProfile,
  getSession,
  resolveContractorAccess,
  signOut,
  type ContractorProfile,
} from "@/lib/auth";

type ContractorAuthState = {
  loading: boolean;
  profile: ContractorProfile | null;
  isApproved: boolean;
  isPending: boolean;
  isRejected: boolean;
  signOutAndRedirect: () => Promise<void>;
  refreshProfile: () => Promise<ContractorProfile | null>;
};

export function useContractorAuth(options?: { redirectToLogin?: boolean }): ContractorAuthState {
  const navigate = useNavigate();
  const redirectToLogin = options?.redirectToLogin ?? true;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ContractorProfile | null>(null);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (mounted) {
          setProfile(null);
          setLoading(false);
          if (redirectToLogin) navigate("/trades-login", { replace: true });
        }
        return;
      }

      const { isContractor, profile: contractorProfile } = await resolveContractorAccess(
        session.user.id,
      );
      if (!isContractor || !contractorProfile) {
        await signOut();
        if (mounted) {
          setProfile(null);
          setLoading(false);
          if (redirectToLogin) navigate("/trades-login", { replace: true });
        }
        return;
      }

      if (mounted) {
        setProfile(contractorProfile);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      verify();
    });

    verify();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, redirectToLogin]);

  const signOutAndRedirect = async () => {
    await signOut();
    navigate("/trades-login", { replace: true });
  };

  const refreshProfile = async () => {
    const session = await getSession();
    if (!session) return null;
    const next = await getContractorProfile(session.user.id);
    if (next) setProfile(next);
    return next;
  };

  return {
    loading,
    profile,
    isApproved: profile?.status === "approved",
    isPending: profile?.status === "pending",
    isRejected: profile?.status === "rejected",
    signOutAndRedirect,
    refreshProfile,
  };
}
