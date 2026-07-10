import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiMapPin } from "react-icons/fi";
import { Button } from "../components/ui/Button";

export const HomePage = () => (
  <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Hotel booking system</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
        Find rooms, manage stays, and run hotel bookings from one clean app.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
        A full-stack booking experience connected to your Express, MongoDB, Clerk, Cloudinary, and Stripe backend.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/hotels">
          <Button>
            Browse hotels
            <FiArrowRight aria-hidden="true" />
          </Button>
        </Link>
        <Link to="/owner">
          <Button variant="secondary">Owner dashboard</Button>
        </Link>
      </div>
    </div>

    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-cyan-700 p-5 text-white">
          <FiMapPin className="size-6" aria-hidden="true" />
          <p className="mt-8 text-sm text-cyan-50">Destination</p>
          <p className="text-2xl font-semibold">Lahore</p>
        </div>
        <div className="rounded-md bg-slate-950 p-5 text-white">
          <FiCalendar className="size-6" aria-hidden="true" />
          <p className="mt-8 text-sm text-slate-300">Next stay</p>
          <p className="text-2xl font-semibold">2 nights</p>
        </div>
      </div>
    </div>
  </section>
);
