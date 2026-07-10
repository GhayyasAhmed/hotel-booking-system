import { Link } from "react-router-dom";
import { FaBed } from "react-icons/fa";
import { FiBriefcase, FiCalendar } from "react-icons/fi";
import { PageShell } from "../../components/ui/PageShell";

const ownerLinks = [
  { href: "/owner/hotel", label: "Manage hotel", icon: FiBriefcase },
  { href: "/owner/rooms", label: "Manage rooms", icon: FaBed },
  { href: "/owner/bookings", label: "Hotel bookings", icon: FiCalendar },
];

export const OwnerDashboardPage = () => (
  <PageShell
    description="This protected area will manage hotel registration, rooms, availability, and booking statuses."
    eyebrow="Owner"
    title="Owner dashboard"
  >
    <div className="grid gap-4 md:grid-cols-3">
      {ownerLinks.map(({ href, icon: Icon, label }) => (
        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          key={href}
          to={href}
        >
          <Icon className="size-6 text-cyan-700" aria-hidden="true" />
          <p className="mt-6 font-semibold text-slate-950">{label}</p>
        </Link>
      ))}
    </div>
  </PageShell>
);
