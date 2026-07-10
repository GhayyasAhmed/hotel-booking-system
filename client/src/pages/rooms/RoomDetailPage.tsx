import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const RoomDetailPage = () => (
  <PageShell
    description="This page will show room images, amenities, availability, pricing, and booking action."
    eyebrow="Room"
    title="Room details"
  >
    <EmptyState title="Room detail view is ready" message="Step 4 will connect this page to /api/room/:id." />
  </PageShell>
);
