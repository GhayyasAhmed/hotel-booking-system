import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiMapPin, FiShield, FiStar } from "react-icons/fi";
import { Button } from "../components/ui/Button";
import { useUser } from "@clerk/clerk-react";

export const HomePage = () => {
  const { user } = useUser();
  return (
    <section className="relative overflow-hidden">
      <div
        className="min-h-[calc(100vh-4rem)] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(16, 47, 47, 0.92) 0%, rgba(16, 47, 47, 0.68) 42%, rgba(16, 47, 47, 0.2) 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=85')",
        }}
      >
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-[#fffaf0]">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f5d49b] backdrop-blur">
              Curated hotel stays
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
              Book your next stay with calm confidence.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
              Discover comfortable rooms, compare availability, and reserve trusted stays for work trips, family escapes,
              and quiet weekends away.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/hotels">
                <Button className="bg-[#d7a85f] text-[#102f2f] hover:bg-[#e2bb78]">
                  Explore stays
                  <FiArrowRight aria-hidden="true" />
                </Button>
              </Link>
              {user && user?.publicMetadata?.role === "owner" && (
                <Link to="/owner">
                  <Button className="border-white/25 bg-white/10 text-white hover:bg-white/20" variant="secondary">
                    List your hotel
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-12 grid max-w-4xl gap-3 rounded-lg border border-white/20 bg-[#fffaf0]/95 p-3 shadow-2xl shadow-black/20 backdrop-blur md:grid-cols-4">
            <div className="rounded-md bg-[#102f2f] p-5 text-[#fffaf0] md:col-span-1">
              <FiMapPin className="size-5 text-[#d7a85f]" aria-hidden="true" />
              <p className="mt-7 text-xs uppercase tracking-[0.18em] text-white/60">Featured city</p>
              <p className="mt-1 text-2xl font-semibold">Lahore</p>
            </div>
            <div className="rounded-md bg-[#f3e8d4] p-5">
              <FiCalendar className="size-5 text-[#8a642f]" aria-hidden="true" />
              <p className="mt-7 text-xs uppercase tracking-[0.18em] text-[#7a6652]">Flexible stays</p>
              <p className="mt-1 text-xl font-semibold text-[#17201b]">Weekend ready</p>
            </div>
            <div className="rounded-md bg-[#f3e8d4] p-5">
              <FiShield className="size-5 text-[#8a642f]" aria-hidden="true" />
              <p className="mt-7 text-xs uppercase tracking-[0.18em] text-[#7a6652]">Trusted flow</p>
              <p className="mt-1 text-xl font-semibold text-[#17201b]">Secure booking</p>
            </div>
            <div className="rounded-md bg-[#f3e8d4] p-5">
              <FiStar className="size-5 text-[#8a642f]" aria-hidden="true" />
              <p className="mt-7 text-xs uppercase tracking-[0.18em] text-[#7a6652]">Guest reviews</p>
              <p className="mt-1 text-xl font-semibold text-[#17201b]">Real feedback</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
