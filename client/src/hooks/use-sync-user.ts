import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { useAuthToken } from "./use-auth-token";

export const useSyncUser = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const getToken = useAuthToken();

  const syncMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();

      return userService.sync(
        {
          username: user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "Guest User",
          email: user?.primaryEmailAddress?.emailAddress || "",
          image: user?.imageUrl,
        },
        token,
      );
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !syncMutation.isPending && !syncMutation.isSuccess) {
      syncMutation.mutate();
    }
  }, [isLoaded, isSignedIn, user, syncMutation]);

  return syncMutation;
};
