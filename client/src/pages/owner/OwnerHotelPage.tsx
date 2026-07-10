import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const OwnerHotelPage = () => (
  <PageShell
    description="This page will register, display, update, and delete the signed-in owner's hotel."
    eyebrow="Owner"
    title="Manage hotel"
  >
    <EmptyState title="Hotel management is ready" message="Step 6 will connect this page to the hotel CRUD APIs." />
  </PageShell>
);
