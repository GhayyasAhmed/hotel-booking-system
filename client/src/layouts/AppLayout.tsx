import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { NavLink, Outlet } from "react-router-dom";
import { FiBriefcase, FiCalendar, FiHome, FiMenu, FiSearch } from "react-icons/fi";
import { useSyncUser } from "../hooks/use-sync-user";
import { Button } from "../components/ui/Button";

const navItems = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/hotels", label: "Hotels", icon: FiSearch },
  { href: "/my-bookings", label: "My bookings", icon: FiCalendar },
  { href: "/owner", label: "Owner", icon: FiBriefcase },
];

export const AppLayout = () => {
  useSyncUser();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink className="flex items-center gap-3 font-semibold text-slate-950" to="/">
            <span className="grid size-9 place-items-center rounded-md bg-cyan-700 text-white">HB</span>
            <span className="hidden sm:inline">Hotel Booking</span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navItems.map(({ href, icon: Icon, label }) => (
              <NavLink
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
                key={href}
                to={href}
              >
                <Icon aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Sign in</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <button
              aria-label="Open navigation"
              className="inline-grid size-10 place-items-center rounded-md border border-slate-200 text-slate-700 md:hidden"
              type="button"
            >
              <FiMenu aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>Hotel Booking System</p>
          <p>Built with React, Vite, TypeScript, Tailwind, Clerk, and TanStack Query.</p>
        </div>
      </footer>
    </div>
  );
};
