// import { Link } from "react-router-dom";
// import { FaBed } from "react-icons/fa";
// import { FiBriefcase, FiCalendar } from "react-icons/fi";
// import { PageShell } from "../../components/ui/PageShell";

// const ownerLinks = [
//   { href: "/owner/hotel", label: "Manage hotel", icon: FiBriefcase },
//   { href: "/owner/rooms", label: "Manage rooms", icon: FaBed },
//   { href: "/owner/bookings", label: "Hotel bookings", icon: FiCalendar },
// ];

// export const OwnerDashboardPage = () => (
//   <PageShell
//     description="Run your property from one calm workspace: rooms, reservations, availability, and guest experience."
//     eyebrow="Owner"
//     title="Owner dashboard"
//   >
//     <div className="grid gap-4 md:grid-cols-3">
//       {ownerLinks.map(({ href, icon: Icon, label }) => (
//         <Link
//           className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8f6a3a]/10"
//           key={href}
//           to={href}
//         >
//           <Icon className="size-6 text-[#8a642f]" aria-hidden="true" />
//           <p className="mt-6 font-semibold text-[#17201b]">{label}</p>
//         </Link>
//       ))}
//     </div>
//   </PageShell>
// );


import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiPlus } from "react-icons/fi";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { LoadingGrid } from "../../components/feedback/LoadingGrid";
import { getErrorMessage } from "../../lib/api-error";
import { useAuthToken } from "../../hooks/use-auth-token";
import { hotelService } from "../../services/hotelService";
import { queryKeys } from "../../services/queryKeys";

export const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const getToken = useAuthToken();

  const hotelQuery = useQuery({
    queryKey: queryKeys.myHotel,
    queryFn: async () => {
      const token = await getToken();
      return hotelService.getMyHotel(token);
    },
  });

  // Redirect to hotel registration if no hotel exists
  useEffect(() => {
    if (hotelQuery.isError) {
      navigate("/owner/hotel");
    }
  }, [hotelQuery.isError, navigate]);

  if (hotelQuery.isLoading) return <LoadingGrid />;

  const hotel = hotelQuery.data?.hotel;

  return (
    <PageShell
      eyebrow="Owner"
      title={hotel ? `Manage ${hotel.name}` : "No hotel registered"}
      description={
        hotel
          ? "Overview of your property and bookings"
          : "Register a hotel to get started."
      }
    >
      {!hotel ? (
        <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 text-center">
          <p className="text-sm text-[#53645b] mb-4">
            You haven't registered a hotel yet.
          </p>
          <Button onClick={() => navigate("/owner/hotel")}>
            <FiPlus aria-hidden="true" />
            Register hotel
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/owner/rooms"
            className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-[#17201b]">Manage rooms</h3>
            <p className="mt-1 text-sm text-[#53645b]">
              Add, edit, or remove rooms in your hotel
            </p>
          </Link>
          <Link
            to="/owner/bookings"
            className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-[#17201b]">Hotel bookings</h3>
            <p className="mt-1 text-sm text-[#53645b]">
              View and manage bookings for your property
            </p>
          </Link>
          <Link
            to="/owner/hotel"
            className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-[#17201b]">Hotel details</h3>
            <p className="mt-1 text-sm text-[#53645b]">
              Update your hotel information and images
            </p>
          </Link>
        </div>
      )}
    </PageShell>
  );
};