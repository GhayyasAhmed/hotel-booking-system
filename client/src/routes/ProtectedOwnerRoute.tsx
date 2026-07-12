import { useUser } from "@clerk/clerk-react";
import { type PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedOwnerRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "owner") {
      navigate("/");
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded) {
    return null;
  }

  if (user?.publicMetadata?.role !== "owner") {
    return null;
  }

  return <>{children}</>;
};