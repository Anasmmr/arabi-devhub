import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyDashboard } from "@/lib/me.functions";
import { useSession } from "./useSession";

export function useDashboard() {
  const { user, loading } = useSession();
  const fetchDashboard = useServerFn(getMyDashboard);

  const query = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: () => fetchDashboard(),
    enabled: Boolean(user),
  });

  return { ...query, user, authLoading: loading };
}
