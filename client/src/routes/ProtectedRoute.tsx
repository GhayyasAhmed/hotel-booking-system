import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { type PropsWithChildren } from "react";
import { Button } from "../components/ui/Button";

export const ProtectedRoute = ({ children }: PropsWithChildren) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Login required</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to continue</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This page needs your Clerk session so the app can call protected backend routes.
        </p>
        <SignInButton mode="modal">
          <Button className="mt-6">Login in</Button>
        </SignInButton>
      </main>
    </SignedOut>
  </>
);
