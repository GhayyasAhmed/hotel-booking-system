import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { FiCheck, FiMapPin } from "react-icons/fi";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { ReviewList } from "../../components/review/ReviewList";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { formatCurrency, getHotelCity, getHotelName } from "../../lib/format";
import { getRoomImage } from "../../lib/images";
import { queryKeys } from "../../services/queryKeys";
import { reviewService } from "../../services/reviewService";
import { roomService } from "../../services/roomService";

export const RoomDetailPage = () => {
  const { roomId = "" } = useParams();

  const roomQuery = useQuery({
    queryKey: queryKeys.room(roomId),
    queryFn: () => roomService.getById(roomId),
    enabled: Boolean(roomId),
  });

  const reviewsQuery = useQuery({
    queryKey: [...queryKeys.reviews, "room", roomId],
    queryFn: () => reviewService.getAll({ room: roomId }),
    enabled: Boolean(roomId),
  });

  if (roomQuery.isLoading) return <PageShell title="Loading room" eyebrow="Room"><LoadingGrid /></PageShell>;
  if (roomQuery.isError || !roomQuery.data) return <PageShell title="Room unavailable" eyebrow="Room"><ErrorState /></PageShell>;

  const { room } = roomQuery.data;

  return (
    <PageShell
      description="Review amenities, nightly pricing, availability, and guest impressions before reserving your stay."
      eyebrow={getHotelCity(room.hotel) || "Room"}
      title={room.roomType}
      actions={
        <Link to={`/book/${room._id}`}>
          <Button>Reserve room</Button>
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-lg border border-[#eadcc6] bg-[#fffaf0] shadow-sm">
          <img className="h-80 w-full object-cover lg:h-[32rem]" src={getRoomImage(room.images)} alt={room.roomType} />
        </div>
        <aside className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a642f]">From</p>
          <p className="mt-2 text-4xl font-semibold text-[#102f2f]">{formatCurrency(room.pricePerNight)}</p>
          <p className="mt-1 text-sm text-[#53645b]">per night</p>
          <p className="mt-6 flex items-center gap-2 text-sm text-[#53645b]">
            <FiMapPin aria-hidden="true" />
            {getHotelName(room.hotel)}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f3e8d4] px-3 py-1 text-sm text-[#5f4a31]" key={amenity}>
                <FiCheck aria-hidden="true" />
                {amenity}
              </span>
            ))}
          </div>
          <Link className="mt-8 block" to={`/book/${room._id}`}>
            <Button className="w-full">Check dates</Button>
          </Link>
        </aside>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#17201b]">Reviews for this room</h2>
        <div className="mt-5">
          {reviewsQuery.isLoading ? <LoadingGrid /> : null}
          {reviewsQuery.isError ? <ErrorState /> : null}
          {reviewsQuery.data ? <ReviewList reviews={reviewsQuery.data.reviews} /> : null}
        </div>
      </section>
    </PageShell>
  );
};
