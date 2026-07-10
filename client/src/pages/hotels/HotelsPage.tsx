import { PageShell } from "../../components/ui/PageShell";
import { EmptyState } from "../../components/feedback/EmptyState";

export const HotelsPage = () => (
  <PageShell
    description="This screen will list hotels from /api/hotel with city search and browsing filters."
    eyebrow="Explore"
    title="Hotels"
  >
    <EmptyState title="Hotel listing comes next" message="Step 4 will connect this page to your backend hotels API." />
  </PageShell>
);
