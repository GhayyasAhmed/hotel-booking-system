import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const OwnerBookingsPage = () => (
  <PageShell
    description="This page will show hotel bookings, revenue summary, and status update controls."
    eyebrow="Owner"
    title="Hotel bookings"
  >
    <EmptyState title="No hotel bookings yet" message="New reservations will appear here with guest details, revenue, and status controls." />
  </PageShell>
);
