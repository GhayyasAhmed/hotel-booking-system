import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiCheck,
  FiCreditCard,
  FiLoader,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { useAuthToken } from "../../hooks/use-auth-token";
import { getErrorMessage, ApiRequestError } from "../../lib/api-error";
import { formatCurrency, getHotelCity, getRoomType } from "../../lib/format";
import { bookingService } from "../../services/bookingService";
import { queryKeys } from "../../services/queryKeys";
import { type Booking, type BookingStatus, type User } from "../../types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-700",
};

const STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled"];

const getGuestName = (user: string | User) =>
  typeof user === "string" ? "Guest" : user.username;

const getGuestEmail = (user: string | User) =>
  typeof user === "string" ? "" : user.email;

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm">
    <Icon className="size-5 text-[#8a642f]" aria-hidden="true" />
    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#8a642f]">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-[#17201b]">{value}</p>
  </div>
);

// ─── Status selector ──────────────────────────────────────────────────────────
const StatusSelect = ({
  bookingId,
  current,
}: {
  bookingId: string;
  current: BookingStatus;
}) => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (status: BookingStatus) => {
      const token = await getToken();
      return bookingService.updateStatus(bookingId, status, token);
    },
    onSuccess: (_, status) => {
      toast.success(`Status updated to ${status}.`);
      queryClient.invalidateQueries({ queryKey: queryKeys.hotelBookings });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="flex items-center gap-2">
      <select
        className="h-9 rounded-lg border border-[#ddc8a3] bg-white px-3 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4 disabled:opacity-60"
        value={current}
        disabled={mutation.isPending}
        onChange={(e) => mutation.mutate(e.target.value as BookingStatus)}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      {mutation.isPending && (
        <FiLoader className="animate-spin size-4 text-[#8a642f]" aria-hidden="true" />
      )}
    </div>
  );
};

// ─── Booking row ──────────────────────────────────────────────────────────────
const BookingRow = ({ booking }: { booking: Booking }) => {
  const guestName = getGuestName(booking.user);
  const guestEmail = getGuestEmail(booking.user);
  const roomLabel = getRoomType(booking.room);

  return (
    <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Guest + room info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
            >
              {booking.status}
            </span>
            {booking.isPaid && (
              <span className="flex items-center gap-1 rounded-full bg-[#102f2f]/10 px-2.5 py-0.5 text-xs font-semibold text-[#102f2f]">
                <FiCheck aria-hidden="true" />
                Paid
              </span>
            )}
          </div>
          <p className="mt-1 font-semibold text-[#17201b]">{guestName}</p>
          {guestEmail && (
            <p className="text-xs text-[#7a6652]">{guestEmail}</p>
          )}
          <p className="text-sm text-[#53645b]">{roomLabel}</p>
        </div>

        {/* Price */}
        <p className="text-xl font-semibold text-[#102f2f]">
          {formatCurrency(booking.totalPrice)}
        </p>
      </div>

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#53645b]">
        <span className="flex items-center gap-1.5">
          <FiCalendar aria-hidden="true" className="shrink-0" />
          {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <FiUsers aria-hidden="true" className="shrink-0" />
          {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1.5">
          <FiCreditCard aria-hidden="true" className="shrink-0" />
          {booking.paymentMethod}
        </span>
      </div>

      {/* Status control */}
      <div className="mt-4 flex items-center gap-3">
        <p className="text-sm font-medium text-[#31423a]">Update status:</p>
        <StatusSelect bookingId={booking._id} current={booking.status} />
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const OwnerBookingsPage = () => {
  const getToken = useAuthToken();

  const bookingsQuery = useQuery<Awaited<ReturnType<typeof bookingService.getHotelBookings>>, ApiRequestError>({
    queryKey: queryKeys.hotelBookings,
    queryFn: async () => {
      const token = await getToken();
      return bookingService.getHotelBookings(token);
    },
  });

  const data = bookingsQuery.data?.data;

  return (
    <PageShell
      eyebrow="Owner"
      title="Hotel bookings"
      description="Monitor reservations, update booking status, and track your property's revenue."
    >
      {bookingsQuery.isLoading && (
        <div className="flex items-center gap-2 text-sm text-[#53645b]">
          <FiLoader className="animate-spin" aria-hidden="true" />
          Loading bookings…
        </div>
      )}

      {bookingsQuery.isError && bookingsQuery?.error?.status !== 404  && <ErrorState />}

      {/* {!data && (
        <> */}
          {/* Summary stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={FiTrendingUp}
              label="Total revenue"
              value={formatCurrency(data?.totalRevenue ?? 0)}
            />
            <StatCard
              icon={FiCalendar}
              label="Total bookings"
              value={String(data?.totalBookings ?? 0)}
            />
            <StatCard
              icon={FiCheck}
              label="Confirmed"
              value={String(
                data?.bookings?.filter((b) => b.status === "confirmed")?.length ?? 0
              )}
            />
          </div>

          {data?.bookings?.length === 0 ? (
            <EmptyState
              title="No hotel bookings yet"
              message="New reservations will appear here with guest details, revenue, and status controls."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {data?.bookings?.map((booking) => (
                <BookingRow booking={booking} key={booking._id} />
              ))}
            </div>
          )}
        {/* </>
      )} */}
    </PageShell>
  );
};