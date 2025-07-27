import { useQuery } from "@tanstack/react-query";
import { getUserConnections } from "@/app/server/followUsersActions";

export const useUserConnectionsQuery = (profileId: string) =>
  useQuery({
    queryKey: ["followers", profileId],
    queryFn: () => getUserConnections(profileId),
  });
