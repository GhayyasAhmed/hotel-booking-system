import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const BookingDetailPage = () => (
  <PageShell
    description="This page will show booking details, payment status, cancellation, and review action."
    eyebrow="Booking"
    title="Booking details"
  >
    <EmptyState title="Booking detail page is ready" message="We will connect this to /api/booking/:id." />
  </PageShell>
);
