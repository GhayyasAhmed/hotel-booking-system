import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const BookingCreatePage = () => (
  <PageShell
    description="Choose dates, confirm guest details, and reserve your room with a clear booking summary."
    eyebrow="Booking"
    title="Create booking"
  >
    <EmptyState title="Select a room to begin" message="Open a room from the hotel collection to check dates and complete your reservation." />
  </PageShell>
);
