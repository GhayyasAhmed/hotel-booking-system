import { FiInbox } from "react-icons/fi";

type EmptyStateProps = {
  title: string;
  message: string;
};

export const EmptyState = ({ message, title }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <FiInbox className="mx-auto size-10 text-slate-400" aria-hidden="true" />
    <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>
  </div>
);
