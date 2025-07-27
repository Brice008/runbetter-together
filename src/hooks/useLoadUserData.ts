import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRunStore } from "@/stores/runStore";

export const useLoadUserData = () => {
  const { user, loading: authLoading } = useAuth();
  const { loadRuns } = useRunStore();

  useEffect(() => {
    if (user && !authLoading) {
      loadRuns();
    }
  }, [user, authLoading, loadRuns]);
};