import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";

export const StripeSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/my-bookings"), 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-emerald-100">
        <FiCheck className="size-8 text-emerald-700" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-[#17201b]">Payment successful</h1>
      <p className="mt-2 text-sm text-[#53645b]">
        Your booking has been paid. Redirecting to your bookings…
      </p>
    </main>
  );
};