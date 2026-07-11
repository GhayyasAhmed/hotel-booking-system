import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { FiMapPin, FiPhone } from "react-icons/fi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { ReviewList } from "../../components/review/ReviewList";
import { RoomCard } from "../../components/room/RoomCard";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { hotelImage } from "../../lib/images";
import { hotelService } from "../../services/hotelService";
import { queryKeys } from "../../services/queryKeys";
import { reviewService } from "../../services/reviewService";
import { roomService } from "../../services/roomService";

export const HotelDetailPage = () => {
  const { hotelId = "" } = useParams();

  const hotelQuery = useQuery({
    queryKey: queryKeys.hotel(hotelId),
    queryFn: () => hotelService.getById(hotelId),
    enabled: Boolean(hotelId),
  });

  const roomsQuery = useQuery({
    queryKey: [...queryKeys.rooms, hotelId],
    queryFn: () => roomService.getAll({ hotel: hotelId }),
    enabled: Boolean(hotelId),
  });

  const reviewsQuery = useQuery({
    queryKey: [...queryKeys.reviews, hotelId],
    queryFn: () => reviewService.getAll({ hotel: hotelId }),
    enabled: Boolean(hotelId),
  });

  if (hotelQuery.isLoading) return <PageShell title="Loading stay" eyebrow="Hotel"><LoadingGrid /></PageShell>;
  if (hotelQuery.isError || !hotelQuery.data) return <PageShell title="Hotel unavailable" eyebrow="Hotel"><ErrorState /></PageShell>;

  const { hotel } = hotelQuery.data;

  return (
    <PageShell
      description="Choose from available rooms, review guest feedback, and reserve the stay that matches your plans."
      eyebrow={hotel.city}
      title={hotel.name}
      actions={
        <Link to="/hotels">
          <Button variant="secondary">Back to hotels</Button>
        </Link>
      }
    >
      <div className="overflow-hidden rounded-lg border border-[#eadcc6] bg-[#fffaf0] shadow-sm">
        <img className="h-72 w-full object-cover md:h-96" src={hotelImage} alt={hotel.name} />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <p className="flex items-center gap-2 text-sm text-[#53645b]">
            <FiMapPin aria-hidden="true" /> {hotel.address}
          </p>
          <p className="flex items-center gap-2 text-sm text-[#53645b]">
            <FiPhone aria-hidden="true" /> {hotel.contact}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#17201b]">Available rooms</h2>
        <div className="mt-5">
          {roomsQuery.isLoading ? <LoadingGrid /> : null}
          {roomsQuery.isError ? <ErrorState /> : null}
          {roomsQuery.data?.rooms.length === 0 ? <EmptyState title="No rooms available" message="Check back soon for new rooms at this hotel." /> : null}
          {roomsQuery.data?.rooms.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {roomsQuery.data.rooms.map((room) => <RoomCard room={room} key={room._id} />)}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#17201b]">Guest reviews</h2>
        <div className="mt-5">
          {reviewsQuery.isLoading ? <LoadingGrid /> : null}
          {reviewsQuery.isError ? <ErrorState /> : null}
          {reviewsQuery.data ? <ReviewList reviews={reviewsQuery.data.reviews} /> : null}
        </div>
      </section>
    </PageShell>
  );
};
