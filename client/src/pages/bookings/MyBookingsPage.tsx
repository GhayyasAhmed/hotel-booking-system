import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight, FiCalendar, FiMapPin } from "react-icons/fi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { PageShell } from "../../components/ui/PageShell";
import { formatCurrency, getHotelCity, getHotelName } from "../../lib/format";
import { bookingService } from "../../services/bookingService";
import { queryKeys } from "../../services/queryKeys";
import { useAuthToken } from "../../hooks/use-auth-token";
import { type Booking, type BookingStatus } from "../../types/api";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-700",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BookingCard = ({ booking }: { booking: Booking }) => {
  const hotelName = getHotelName(booking.hotel);
  const city = getHotelCity(booking.hotel);

  return (
    <Link
      to={`/bookings/${booking._id}`}
      className="group flex flex-col gap-4 rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8f6a3a]/10 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
          >
            {booking.status}
          </span>
          {booking.isPaid && (
            <span className="rounded-full bg-[#102f2f]/10 px-2.5 py-0.5 text-xs font-semibold text-[#102f2f]">
              Paid
            </span>
          )}
        </div>
        <h2 className="text-base font-semibold text-[#17201b]">{hotelName}</h2>
        {city ? (
          <p className="flex items-center gap-1.5 text-sm text-[#53645b]">
            <FiMapPin aria-hidden="true" className="shrink-0" />
            {city}
          </p>
        ) : null}
        <p className="flex items-center gap-1.5 text-sm text-[#53645b]">
          <FiCalendar aria-hidden="true" className="shrink-0" />
          {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
        </p>
        <p className="text-sm text-[#53645b]">
          {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className="text-xl font-semibold text-[#102f2f]">
          {formatCurrency(booking.totalPrice)}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8a642f] group-hover:underline">
          View details
          <FiArrowRight aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export const MyBookingsPage = () => {
  const getToken = useAuthToken();

  const bookingsQuery = useQuery({
    queryKey: queryKeys.userBookings,
    queryFn: async () => {
      const token = await getToken();
      return bookingService.getUserBookings(token);
    },
  });

  return (
    <PageShell
      description="Track upcoming stays, review reservation details, and manage your travel plans."
      eyebrow="Guest"
      title="My bookings"
    >
      {bookingsQuery.isLoading ? <LoadingGrid /> : null}
      {bookingsQuery.isError ? <ErrorState /> : null}
      {bookingsQuery.data?.bookings.length === 0 ? (
        <EmptyState
          title="No stays booked yet"
          message="Browse available rooms and reserve the stay that fits your schedule."
        />
      ) : null}
      {bookingsQuery.data?.bookings.length ? (
        <div className="flex flex-col gap-4">
          {bookingsQuery.data.bookings.map((booking) => (
            <BookingCard booking={booking} key={booking._id} />
          ))}
        </div>
      ) : null}
    </PageShell>
  );
};