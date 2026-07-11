import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const MyReviewsPage = () => (
  <PageShell
    description="This page will show user reviews"
    eyebrow="Review"
    title="My Reviews"
  >
    <EmptyState title="No review yet" message="New review will appear here." />
  </PageShell>
);
