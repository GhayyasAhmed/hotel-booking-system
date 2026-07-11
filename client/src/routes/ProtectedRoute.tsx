import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { type PropsWithChildren } from "react";
import { Button } from "../components/ui/Button";

export const ProtectedRoute = ({ children }: PropsWithChildren) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a642f]">Members only</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#17201b]">Sign in to manage your stay</h1>
        <p className="mt-3 text-sm leading-6 text-[#53645b]">
          Access bookings, payments, reviews, and owner tools with a secure guest profile.
        </p>
        <SignInButton mode="modal">
          <Button className="mt-6">Sign in</Button>
        </SignInButton>
      </main>
    </SignedOut>
  </>
);
