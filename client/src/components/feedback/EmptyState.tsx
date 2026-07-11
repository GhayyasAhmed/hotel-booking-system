import { FiInbox } from "react-icons/fi";

type EmptyStateProps = {
  title: string;
  message: string;
};

export const EmptyState = ({ message, title }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-[#ddc8a3] bg-[#fffaf0] px-6 py-12 text-center shadow-sm">
    <FiInbox className="mx-auto size-10 text-[#8a642f]" aria-hidden="true" />
    <h2 className="mt-4 text-lg font-semibold text-[#17201b]">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#53645b]">{message}</p>
  </div>
);
