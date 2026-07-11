import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit2, FiLoader, FiSave, FiStar, FiTrash2, FiX } from "react-icons/fi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { getHotelName, getRoomType } from "../../lib/format";
import { getErrorMessage } from "../../lib/api-error";
import { useAuthToken } from "../../hooks/use-auth-token";
import { reviewService, type UpdateReviewPayload } from "../../services/reviewService";
import { queryKeys } from "../../services/queryKeys";
import { type Review } from "../../types/api";

type FormValues = {
  rating: number;
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
          className={`size-6 transition ${
            value <= rating ? "fill-[#d7a85f] text-[#d7a85f]" : "text-[#ddc8a3]"
          }`}
        />
      </button>
    ))}
  </div>
);

const EditReviewForm = ({ review, onClose }: { review: Review; onClose: () => void }) => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(review.rating);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: review.title || "", comment: review.comment },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await getToken();
      const payload: UpdateReviewPayload = {
        rating,
        title: values.title?.trim() || undefined,
        comment: values.comment.trim(),
      };
      return reviewService.update(review._id, payload, token);
    },
    onSuccess: () => {
      toast.success("Review updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.myReviews });
      onClose();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <form
      className="rounded-lg border border-[#102f2f]/20 bg-[#fffaf0] p-5 shadow-sm"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#17201b]">Edit review</h3>
        <button
          type="button"
          className="rounded-full p-1 text-[#53645b] hover:bg-[#f3e8d4]"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[#31423a]">Rating</label>
        <div className="mt-1.5">
          <StarPicker rating={rating} onChange={setRating} />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[#31423a]">Title</label>
        <input className={`mt-1.5 ${inputClass}`} {...register("title")} />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[#31423a]">Comment</label>
        <textarea
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-[#ddc8a3] bg-white px-4 py-3 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4"
          {...register("comment", { required: "Comment is required." })}
        />
        {errors.comment && <p className="mt-1 text-xs text-rose-600">{errors.comment.message}</p>}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <FiLoader className="animate-spin" aria-hidden="true" />}
          <FiSave aria-hidden="true" />
          Save changes
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [editing, setEditing] = useState(false);
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return reviewService.delete(review._id, token);
    },
    onSuccess: () => {
      toast.success("Review deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.myReviews });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleDelete = () => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    deleteMutation.mutate();
  };

  if (editing) return <EditReviewForm review={review} onClose={() => setEditing(false)} />;

  return (
    <article className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a642f]">
            {getHotelName(review.hotel)}
          </p>
          <p className="mt-0.5 text-sm text-[#53645b]">{getRoomType(review.room)}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f3e8d4] px-3 py-1 text-sm font-semibold text-[#8a642f]">
          <FiStar aria-hidden="true" />
          {review.rating}
        </span>
      </div>

      {review.title ? (
        <h3 className="mt-4 text-lg font-semibold text-[#17201b]">{review.title}</h3>
      ) : null}
      <p className="mt-2 text-sm leading-6 text-[#53645b]">{review.comment}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => setEditing(true)}>
          <FiEdit2 aria-hidden="true" />
          Edit
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
          {deleteMutation.isPending ? (
            <FiLoader className="animate-spin" aria-hidden="true" />
          ) : (
            <FiTrash2 aria-hidden="true" />
          )}
          Delete
        </Button>
      </div>
    </article>
  );
};

export const MyReviewsPage = () => {
  const getToken = useAuthToken();

  const reviewsQuery = useQuery({
    queryKey: queryKeys.myReviews,
    queryFn: async () => {
      const token = await getToken();
      return reviewService.getMyReviews(token);
    },
  });

  return (
    <PageShell
    //   eyebrow="Guest"
      title="My reviews"
      description="View, edit, or remove the reviews you've left for past stays."
    >
      {reviewsQuery.isLoading ? <LoadingGrid /> : null}
      {reviewsQuery.isError ? <ErrorState /> : null}
      {reviewsQuery.data?.reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          message="Complete a stay and share your experience to see it here."
        />
      ) : null}
      {reviewsQuery.data?.reviews.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {reviewsQuery.data.reviews.map((review) => (
            <ReviewCard review={review} key={review._id} />
          ))}
        </div>
      ) : null}
    </PageShell>
  );
};