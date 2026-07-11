import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiCreditCard,
  FiInfo,
  FiLoader,
  FiMapPin,
  FiStar,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { useAuthToken } from "../../hooks/use-auth-token";
import { getErrorMessage } from "../../lib/api-error";
import { formatCurrency, getHotelCity, getHotelName } from "../../lib/format";
import { getRoomImage } from "../../lib/images";
import { bookingService } from "../../services/bookingService";
import { queryKeys } from "../../services/queryKeys";
import { type BookingStatus, type Room } from "../../types/api";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-700",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const calcNights = (checkIn: string, checkOut: string) => {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 size-4 shrink-0 text-[#8a642f]" aria-hidden="true" />
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#8a642f]">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[#17201b]">{value}</p>
    </div>
  </div>
);

export const BookingDetailPage = () => {
  const { bookingId = "" } = useParams();
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const bookingQuery = useQuery({
    queryKey: queryKeys.booking(bookingId),
    queryFn: async () => {
      const token = await getToken();
      return bookingService.getById(bookingId, token);
    },
    enabled: Boolean(bookingId),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return bookingService.cancel(bookingId, token);
    },
    onSuccess: () => {
      toast.success("Booking cancelled.");
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(bookingId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.userBookings });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return bookingService.createStripePayment(bookingId, token);
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleCancel = () => {
    if (!window.confirm("Cancel this booking? This cannot be undone.")) return;
    cancelMutation.mutate();
  };

  if (bookingQuery.isLoading)
    return (
      <PageShell title="Loading booking" eyebrow="Booking">
        <LoadingGrid />
      </PageShell>
    );

  if (bookingQuery.isError || !bookingQuery.data)
    return (
      <PageShell title="Booking unavailable" eyebrow="Booking">
        <ErrorState />
      </PageShell>
    );

  const { booking } = bookingQuery.data;
  const room = booking.room as Room;
  const nights = calcNights(booking.checkInDate, booking.checkOutDate);
  
  const isCancelled = booking.status === "cancelled";
  const isPending = booking.status === "pending";
  const canPay = !booking.isPaid && booking.status === "confirmed";
  const canCancel = !isCancelled;

  return (
    <PageShell
      eyebrow="Booking"
      title="Booking details"
      description="Review your reservation, make a payment, or manage your stay."
      actions={
        <Link to="/my-bookings">
          <Button variant="secondary">
            <FiArrowLeft aria-hidden="true" />
            My bookings
          </Button>
        </Link>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main detail */}
        <div className="space-y-6">
          {/* Status banner */}
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusStyles[booking.status]}`}
            >
              {booking.status}
            </span>
            {booking.isPaid ? (
              <span className="flex items-center gap-1.5 rounded-full bg-[#102f2f]/10 px-3 py-1 text-sm font-semibold text-[#102f2f]">
                <FiCheck aria-hidden="true" />
                Paid via {booking.paymentMethod}
              </span>
            ) : (
              <span className="rounded-full bg-[#f3e8d4] px-3 py-1 text-sm font-semibold text-[#8a642f]">
                Payment pending
              </span>
            )}
            <p className="ml-auto text-xs text-[#7a6652]">
              Booking #{booking._id.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Stay info */}
          <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[#17201b]">Stay details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={FiCalendar}
                label="Check-in"
                value={formatDate(booking.checkInDate)}
              />
              <InfoRow
                icon={FiCalendar}
                label="Check-out"
                value={formatDate(booking.checkOutDate)}
              />
              <InfoRow
                icon={FiUsers}
                label="Guests"
                value={`${booking.guests} guest${booking.guests !== 1 ? "s" : ""}`}
              />
              <InfoRow
                icon={FiMapPin}
                label="Hotel"
                value={getHotelName(booking.hotel)}
              />
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[#17201b]">Price summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              {typeof room === "object" && room.pricePerNight ? (
                <div className="flex justify-between text-[#53645b]">
                  <dt>
                    {formatCurrency(room.pricePerNight)} × {nights} night{nights !== 1 ? "s" : ""}
                  </dt>
                  <dd>{formatCurrency(booking.totalPrice)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-[#53645b]">
                <dt>Taxes &amp; fees</dt>
                <dd>Pay at hotel</dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-[#eadcc6] pt-4 font-semibold text-[#17201b]">
              <span>Total</span>
              <span>{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>

          {/* Actions & Notices */}
          <div className="space-y-4">
            {isPending && !booking.isPaid && (
              <div className="flex items-center gap-2 rounded-lg border border-[#eadcc6] bg-[#fdf8f0] px-4 py-3 text-sm text-[#8a642f]">
                <FiInfo className="size-4 shrink-0" aria-hidden="true" />
                <span>You can pay once the owner confirms your booking.</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {canPay && (
                <Button
                  onClick={() => payMutation.mutate()}
                  disabled={payMutation.isPending}
                >
                  {payMutation.isPending ? (
                    <FiLoader className="animate-spin" aria-hidden="true" />
                  ) : (
                    <FiCreditCard aria-hidden="true" />
                  )}
                  Pay with Stripe
                </Button>
              )}

              {!isCancelled && (
                <Link to={`/bookings/${booking._id}/review`}>
                  <Button variant="secondary">
                    <FiStar aria-hidden="true" />
                    Write a review
                  </Button>
                </Link>
              )}

              {canCancel && (
                <Button
                  variant="danger"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? (
                    <FiLoader className="animate-spin" aria-hidden="true" />
                  ) : (
                    <FiX aria-hidden="true" />
                  )}
                  Cancel booking
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Room card */}
        <aside>
          {typeof room === "object" ? (
            <Link
              to={`/rooms/${room._id}`}
              className="group block overflow-hidden rounded-lg border border-[#eadcc6] bg-[#fffaf0] shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8f6a3a]/10"
            >
              <img
                src={getRoomImage(room.images)}
                alt={room.roomType}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a642f]">
                  {getHotelCity(booking.hotel) || "Room"}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[#17201b]">{room.roomType}</h3>
                <p className="mt-1 text-sm text-[#53645b]">{getHotelName(booking.hotel)}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {room.amenities?.slice(0, 3).map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-[#f3e8d4] px-2.5 py-0.5 text-xs font-medium text-[#5f4a31]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-lg border border-dashed border-[#ddc8a3] bg-[#fffaf0] p-8 text-center text-sm text-[#8a642f]">
              Room details unavailable
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  );
};