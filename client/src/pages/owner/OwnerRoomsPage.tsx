import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const OwnerRoomsPage = () => (
  <PageShell
    description="This page will create rooms, upload images, update details, toggle availability, and delete rooms."
    eyebrow="Owner"
    title="Manage rooms"
  >
    <EmptyState title="Room management is ready" message="Step 6 will connect this page to /api/room owner endpoints." />
  </PageShell>
);
