import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiArrowLeft, FiLoader, FiStar } from "react-icons/fi";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { getHotelName, getRoomType } from "../../lib/format";
import { getErrorMessage } from "../../lib/api-error";
import { useAuthToken } from "../../hooks/use-auth-token";
import { bookingService } from "../../services/bookingService";
import { reviewService } from "../../services/reviewService";
import { queryKeys } from "../../services/queryKeys";

type FormValues = {
  title: string;
  comment: string;
};

const inputClass =
  "h-11 w-full rounded-lg border border-[#ddc8a3] bg-white px-4 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4";

const StarPicker = ({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (value: number) => void;
}) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((value) => (
      <button
        key={value}
        type="button"
        aria-label={`Rate ${value} star${value !== 1 ? "s" : ""}`}
        onClick={() => onChange(value)}
        className="p-1"
      >
        <FiStar
          className={`size-7 transition ${
            value <= rating ? "fill-[#d7a85f] text-[#d7a85f]" : "text-[#ddc8a3]"
          }`}
        />
      </button>
    ))}
  </div>
);

export const ReviewCreatePage = () => {
  const { bookingId = "" } = useParams();
  const navigate = useNavigate();
  const getToken = useAuthToken();
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const bookingQuery = useQuery({
    queryKey: queryKeys.booking(bookingId),
    queryFn: async () => {
      const token = await getToken();
      return bookingService.getById(bookingId, token);
    },
    enabled: Boolean(bookingId),
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await getToken();
      return reviewService.create(
        {
          booking: bookingId,
          rating,
          title: values.title?.trim() || undefined,
          comment: values.comment.trim(),
        },
        token,
      );
    },
    onSuccess: () => {
      toast.success("Review submitted. Thank you!");
      navigate("/my-reviews");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const onSubmit = (values: FormValues) => {
    if (rating < 1) {
      setRatingError("Please select a star rating.");
      return;
    }
    setRatingError("");
    mutation.mutate(values);
  };

  if (bookingQuery.isLoading)
    return (
      <PageShell title="Loading booking" eyebrow="Review">
        <LoadingGrid />
      </PageShell>
    );

  if (bookingQuery.isError || !bookingQuery.data)
    return (
      <PageShell title="Booking unavailable" eyebrow="Review">
        <ErrorState />
      </PageShell>
    );

  const { booking } = bookingQuery.data;

  return (
    <PageShell
      eyebrow="Review"
      title="Write a review"
      description={`Share your experience at ${getHotelName(booking.hotel)}.`}
      actions={
        <Link to={`/bookings/${bookingId}`}>
          <Button variant="secondary">
            <FiArrowLeft aria-hidden="true" />
            Back to booking
          </Button>
        </Link>
      }
    >
      <div className="max-w-2xl">
        <form
          className="space-y-6 rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <p className="text-sm font-medium text-[#31423a]">
              {getRoomType(booking.room)} · {getHotelName(booking.hotel)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#31423a]">Rating</label>
            <div className="mt-1.5">
              <StarPicker rating={rating} onChange={setRating} />
            </div>
            {ratingError && <p className="mt-1 text-xs text-rose-600">{ratingError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#31423a]" htmlFor="title">
              Title (optional)
            </label>
            <input
              id="title"
              className={`mt-1.5 ${inputClass}`}
              placeholder="A relaxing stay"
              {...register("title")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#31423a]" htmlFor="comment">
              Your review
            </label>
            <textarea
              id="comment"
              rows={5}
              className="mt-1.5 w-full rounded-lg border border-[#ddc8a3] bg-white px-4 py-3 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4"
              placeholder="Tell other guests about your stay..."
              {...register("comment", {
                required: "Please write a comment.",
                maxLength: { value: 1000, message: "Comment cannot exceed 1000 characters." },
              })}
            />
            {errors.comment && (
              <p className="mt-1 text-xs text-rose-600">{errors.comment.message}</p>
            )}
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <FiLoader className="animate-spin" aria-hidden="true" />}
            Submit review
          </Button>
        </form>
      </div>
    </PageShell>
  );
};