import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiCalendar, FiCheck, FiLoader, FiMapPin, FiUsers, FiX } from "react-icons/fi";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { formatCurrency, getHotelCity, getHotelName } from "../../lib/format";
import { getRoomImage } from "../../lib/images";
import { bookingService } from "../../services/bookingService";
import { roomService } from "../../services/roomService";
import { queryKeys } from "../../services/queryKeys";
import { useAuthToken } from "../../hooks/use-auth-token";
import { getErrorMessage } from "../../lib/api-error";

type FormValues = {
  checkInDate: string;
  checkOutDate: string;
  guests: number;
};

const today = new Date().toISOString().split("T")[0];

const calcNights = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const BookingCreatePage = () => {
  const { roomId = "" } = useParams();
  const navigate = useNavigate();
  const getToken = useAuthToken();

  const [availability, setAvailability] = useState<boolean | null>(null);
  const [checkingAvail, setCheckingAvail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { guests: 1 } });

  const checkIn = watch("checkInDate");
  const checkOut = watch("checkOutDate");
  const nights = calcNights(checkIn, checkOut);

  // Reset availability result whenever dates change
  useEffect(() => {
    setAvailability(null);
  }, [checkIn, checkOut]);

  const roomQuery = useQuery({
    queryKey: queryKeys.room(roomId),
    queryFn: () => roomService.getById(roomId),
    enabled: Boolean(roomId),
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await getToken();
      return bookingService.create(
        {
          room: roomId,
          checkInDate: values.checkInDate,
          checkOutDate: values.checkOutDate,
          guests: Number(values.guests),
        },
        token,
      );
    },
    onSuccess: (data) => {
      toast.success("Booking confirmed!");
      navigate(`/bookings/${data.booking._id}`);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Select both check-in and check-out dates first.");
      return;
    }
    setCheckingAvail(true);
    setAvailability(null);
    try {
      const res = await bookingService.checkAvailability({
        room: roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });
      setAvailability(res.isAvailable);
    } catch {
      toast.error("Could not check availability. Try again.");
    } finally {
      setCheckingAvail(false);
    }
  };

  const onSubmit = (values: FormValues) => {
    if (availability === false) {
      toast.error("Room is not available for selected dates.");
      return;
    }
    createMutation.mutate(values);
  };

  if (roomQuery.isLoading)
    return (
      <PageShell title="Preparing your booking" eyebrow="Booking">
        <LoadingGrid />
      </PageShell>
    );

  if (roomQuery.isError || !roomQuery.data)
    return (
      <PageShell title="Room unavailable" eyebrow="Booking">
        <ErrorState />
      </PageShell>
    );

  const { room } = roomQuery.data;
  const totalPrice = room.pricePerNight * nights;

  return (
    <PageShell
      description="Choose your dates, confirm guest count, and reserve your room."
      eyebrow="Booking"
      title="Create booking"
      actions={
        <Link to={`/rooms/${roomId}`}>
          <Button variant="secondary">Back to room</Button>
        </Link>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Dates */}
          <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#17201b]">
              <FiCalendar aria-hidden="true" className="text-[#8a642f]" />
              Select dates
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#31423a]" htmlFor="checkInDate">
                  Check-in
                </label>
                <input
                  id="checkInDate"
                  type="date"
                  min={today}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#ddc8a3] bg-white px-4 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4"
                  {...register("checkInDate", { required: "Check-in date is required." })}
                />
                {errors.checkInDate && (
                  <p className="mt-1 text-xs text-rose-600">{errors.checkInDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#31423a]" htmlFor="checkOutDate">
                  Check-out
                </label>
                <input
                  id="checkOutDate"
                  type="date"
                  min={checkIn || today}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#ddc8a3] bg-white px-4 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4"
                  {...register("checkOutDate", {
                    required: "Check-out date is required.",
                    validate: (val) =>
                      !checkIn || val > checkIn || "Check-out must be after check-in.",
                  })}
                />
                {errors.checkOutDate && (
                  <p className="mt-1 text-xs text-rose-600">{errors.checkOutDate.message}</p>
                )}
              </div>
            </div>

            <Button
              className="mt-5"
              variant="secondary"
              type="button"
              disabled={checkingAvail || !checkIn || !checkOut}
              onClick={handleCheckAvailability}
            >
              {checkingAvail ? (
                <FiLoader className="animate-spin" aria-hidden="true" />
              ) : null}
              Check availability
            </Button>

            {availability === true && (
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
                <FiCheck aria-hidden="true" />
                Room is available for your selected dates.
              </p>
            )}
            {availability === false && (
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-rose-600">
                <FiX aria-hidden="true" />
                Room is not available for those dates. Please choose different dates.
              </p>
            )}
          </div>

          {/* Guests */}
          <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#17201b]">
              <FiUsers aria-hidden="true" className="text-[#8a642f]" />
              Guests
            </h2>
            <div className="mt-5">
              <label className="block text-sm font-medium text-[#31423a]" htmlFor="guests">
                Number of guests
              </label>
              <input
                id="guests"
                type="number"
                min={1}
                max={20}
                className="mt-1.5 h-11 w-full rounded-lg border border-[#ddc8a3] bg-white px-4 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4 sm:w-40"
                {...register("guests", {
                  required: "Guest count is required.",
                  min: { value: 1, message: "At least 1 guest is required." },
                })}
              />
              {errors.guests && (
                <p className="mt-1 text-xs text-rose-600">{errors.guests.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={createMutation.isPending || availability === false}
            className="w-full sm:w-auto"
          >
            {createMutation.isPending ? (
              <FiLoader className="animate-spin" aria-hidden="true" />
            ) : null}
            Confirm booking
          </Button>
        </form>

        {/* Summary card */}
        <aside className="space-y-5">
          <div className="overflow-hidden rounded-lg border border-[#eadcc6] bg-[#fffaf0] shadow-sm">
            <img
              src={getRoomImage(room.images)}
              alt={room.roomType}
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a642f]">
                {getHotelCity(room.hotel) || "Room"}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[#17201b]">{room.roomType}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#53645b]">
                <FiMapPin aria-hidden="true" />
                {getHotelName(room.hotel)}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {room.amenities.slice(0, 4).map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-[#f3e8d4] px-2.5 py-0.5 text-xs font-medium text-[#5f4a31]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm">
            <h3 className="font-semibold text-[#17201b]">Price summary</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#53645b]">
                <dt>{formatCurrency(room.pricePerNight)} × {nights || "—"} night{nights !== 1 ? "s" : ""}</dt>
                <dd>{nights > 0 ? formatCurrency(totalPrice) : "—"}</dd>
              </div>
              <div className="flex justify-between text-[#53645b]">
                <dt>Taxes &amp; fees</dt>
                <dd>Pay at hotel</dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-[#eadcc6] pt-4 font-semibold text-[#17201b]">
              <span>Total</span>
              <span>{nights > 0 ? formatCurrency(totalPrice) : "—"}</span>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
};