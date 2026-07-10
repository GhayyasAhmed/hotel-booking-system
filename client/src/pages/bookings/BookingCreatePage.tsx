import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const BookingCreatePage = () => (
  <PageShell
    description="This protected page will check room availability and create a booking."
    eyebrow="Booking"
    title="Create booking"
  >
    <EmptyState title="Booking form comes after browsing" message="We will wire this to /api/booking/check-availability and /api/booking/book." />
  </PageShell>
);
