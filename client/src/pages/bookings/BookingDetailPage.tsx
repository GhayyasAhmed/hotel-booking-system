import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const BookingDetailPage = () => (
  <PageShell
    description="This page will show booking details, payment status, cancellation, and review action."
    eyebrow="Booking"
    title="Booking details"
  >
    <EmptyState title="Booking details unavailable" message="Choose a reservation from your bookings to view stay details and next actions." />
  </PageShell>
);
