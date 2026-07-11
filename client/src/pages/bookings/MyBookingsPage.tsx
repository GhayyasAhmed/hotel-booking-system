import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const MyBookingsPage = () => (
  <PageShell
    description="Track upcoming stays, review reservation details, and manage your travel plans."
    eyebrow="Guest"
    title="My bookings"
  >
    <EmptyState title="No stays booked yet" message="Browse available rooms and reserve the stay that fits your schedule." />
  </PageShell>
);
