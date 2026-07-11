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
    description="Run your property from one calm workspace: rooms, reservations, availability, and guest experience."
    eyebrow="Owner"
    title="Owner dashboard"
  >
    <div className="grid gap-4 md:grid-cols-3">
      {ownerLinks.map(({ href, icon: Icon, label }) => (
        <Link
          className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8f6a3a]/10"
          key={href}
          to={href}
        >
          <Icon className="size-6 text-[#8a642f]" aria-hidden="true" />
          <p className="mt-6 font-semibold text-[#17201b]">{label}</p>
        </Link>
      ))}
    </div>
  </PageShell>
);
