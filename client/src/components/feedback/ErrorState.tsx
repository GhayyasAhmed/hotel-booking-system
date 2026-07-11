import { FiAlertCircle } from "react-icons/fi";

type ErrorStateProps = {
  message?: string;
};

export const ErrorState = ({ message = "We could not load this section. Please try again." }: ErrorStateProps) => (
  <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-rose-900">
    <div className="flex items-center gap-3">
      <FiAlertCircle className="size-5" aria-hidden="true" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  </div>
);
