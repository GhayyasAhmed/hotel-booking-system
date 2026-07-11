import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const OwnerRoomsPage = () => (
  <PageShell
    description="This page will create rooms, upload images, update details, toggle availability, and delete rooms."
    eyebrow="Owner"
    title="Manage rooms"
  >
    <EmptyState title="No rooms listed yet" message="Create polished room listings with photos, amenities, pricing, and availability." />
  </PageShell>
);
