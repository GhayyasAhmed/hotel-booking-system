import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const HotelDetailPage = () => (
  <PageShell
    description="This page will show hotel details, rooms, and reviews for the selected hotel."
    eyebrow="Hotel"
    title="Hotel details"
  >
    <EmptyState title="Hotel detail view is ready for data" message="Next we will connect rooms and reviews here." />
  </PageShell>
);
