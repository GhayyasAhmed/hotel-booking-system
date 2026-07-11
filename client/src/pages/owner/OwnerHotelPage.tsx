import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const OwnerHotelPage = () => (
  <PageShell
    description="This page will register, display, update, and delete the signed-in owner's hotel."
    eyebrow="Owner"
    title="Manage hotel"
  >
    <EmptyState title="Create your hotel profile" message="Add your property details so guests can discover your rooms and make reservations." />
  </PageShell>
);
