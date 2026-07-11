import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { HotelCard } from "../../components/hotel/HotelCard";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { hotelService } from "../../services/hotelService";
import { queryKeys } from "../../services/queryKeys";

export const HotelsPage = () => {
  const [city, setCity] = useState("");
  const [activeCity, setActiveCity] = useState("");

  const hotelsQuery = useQuery({
    queryKey: [...queryKeys.hotels, activeCity],
    queryFn: () => hotelService.getAll(activeCity || undefined),
  });

  return (
    <PageShell
      description="Browse handpicked hotels, compare locations, and open the room collection that fits your trip."
      eyebrow="Explore"
      title="Find your stay"
      actions={
        <form
          className="flex w-full gap-2 sm:w-auto"
          onSubmit={(event) => {
            event.preventDefault();
            setActiveCity(city.trim());
          }}
        >
          <div className="relative flex-1 sm:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a642f]" aria-hidden="true" />
            <input
              className="h-11 w-full rounded-full border border-[#ddc8a3] bg-[#fffaf0] pl-11 pr-4 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4"
              onChange={(event) => setCity(event.target.value)}
              placeholder="Search city"
              value={city}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      }
    >
      {hotelsQuery.isLoading ? <LoadingGrid /> : null}
      {hotelsQuery.isError ? <ErrorState /> : null}
      {hotelsQuery.data?.hotels.length === 0 ? (
        <EmptyState title="No hotels found" message="Try another city or explore all available stays." />
      ) : null}
      {hotelsQuery.data?.hotels.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hotelsQuery.data.hotels.map((hotel) => (
            <HotelCard hotel={hotel} key={hotel._id} />
          ))}
        </div>
      ) : null}
    </PageShell>
  );
};
