import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { env, hasClerkKey } from "../config/env";
import { queryClient } from "../lib/query-client";
import { SetupNotice } from "../components/feedback/SetupNotice";

export const AppProviders = ({ children }: PropsWithChildren) => {
  if (!hasClerkKey) {
    return <SetupNotice />;
  }

  return (
    <ClerkProvider publishableKey={env.clerkPublishableKey}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  );
};
