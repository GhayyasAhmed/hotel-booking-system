import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const OwnerBookingsPage = () => (
  <PageShell
    description="This page will show hotel bookings, revenue summary, and status update controls."
    eyebrow="Owner"
    title="Hotel bookings"
  >
    <EmptyState title="Booking operations are ready" message="Step 6 will connect this page to /api/booking/hotel." />
  </PageShell>
);
