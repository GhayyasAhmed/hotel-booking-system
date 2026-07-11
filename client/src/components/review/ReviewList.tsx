import { FiStar } from "react-icons/fi";
import { type Review, type User } from "../../types/api";

type ReviewListProps = {
  reviews: Review[];
};

const getReviewer = (user: string | User) => (typeof user === "string" ? "Guest" : user.username);

export const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return <p className="text-sm text-[#53645b]">No reviews yet. Be the first guest to share an experience.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <article className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm" key={review._id}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-[#17201b]">{getReviewer(review.user)}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f3e8d4] px-3 py-1 text-sm font-semibold text-[#8a642f]">
              <FiStar aria-hidden="true" />
              {review.rating}
            </span>
          </div>
          {review.title ? <h3 className="mt-4 text-lg font-semibold text-[#17201b]">{review.title}</h3> : null}
          <p className="mt-2 text-sm leading-6 text-[#53645b]">{review.comment}</p>
        </article>
      ))}
    </div>
  );
};
