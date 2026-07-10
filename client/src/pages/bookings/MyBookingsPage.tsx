import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const MyBookingsPage = () => (
  <PageShell
    description="This protected page will list bookings for the signed-in user."
    eyebrow="Guest"
    title="My bookings"
  >
    <EmptyState title="No bookings loaded yet" message="Step 5 will connect this page to /api/booking/user." />
  </PageShell>
);
