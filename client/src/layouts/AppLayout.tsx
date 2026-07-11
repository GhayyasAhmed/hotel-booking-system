import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { FiBriefcase, FiCalendar, FiHome, FiMenu, FiSearch, FiStar } from "react-icons/fi";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useSyncUser } from "../hooks/use-sync-user";

const navItems = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/hotels", label: "Hotels", icon: FiSearch },
  { href: "/my-bookings", label: "My bookings", icon: FiCalendar },
  { href: "/my-reviews", label: "My reviews", icon: FiStar },
  { href: "/owner", label: "Owner", icon: FiBriefcase },
];

export const AppLayout = () => {
  useSyncUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2ea] text-[#17201b]">
      <header className="sticky top-0 z-30 border-b border-[#eadcc6] bg-[#fffaf0]/90 shadow-sm shadow-[#8f6a3a]/5 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink className="flex items-center gap-3 font-semibold text-[#17201b]" to="/">
            <span className="grid size-10 place-items-center rounded-full bg-[#102f2f] text-sm tracking-tight text-[#fffaf0] shadow-sm shadow-[#102f2f]/20">
              SN
            </span>
            <span className="hidden text-base sm:inline">StayNest</span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navItems.map(({ href, icon: Icon, label }) => (
              <NavLink
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#102f2f] text-[#fffaf0] shadow-sm"
                      : "text-[#53645b] hover:bg-[#efe2cd] hover:text-[#17201b]"
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
              className="inline-grid size-10 place-items-center rounded-full border border-[#ddc8a3] bg-[#fffaf0] text-[#31423a] md:hidden"
              type="button"
            >
              <FiMenu aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#eadcc6] bg-[#fffaf0]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-[#53645b] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-semibold text-[#17201b]">StayNest</p>
          <p>Curated stays, secure reservations, and effortless hosting.</p>
        </div>
      </footer>
    </div>
  );
};
