import { createBrowserRouter } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { BookingDetailPage } from "../pages/bookings/BookingDetailPage";
import { BookingCreatePage } from "../pages/bookings/BookingCreatePage";
import { HotelDetailPage } from "../pages/hotels/HotelDetailPage";
import { HotelsPage } from "../pages/hotels/HotelsPage";
import { HomePage } from "../pages/HomePage";
import { MyBookingsPage } from "../pages/bookings/MyBookingsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { OwnerDashboardPage } from "../pages/owner/OwnerDashboardPage";
import { OwnerHotelPage } from "../pages/owner/OwnerHotelPage";
import { OwnerRoomsPage } from "../pages/owner/OwnerRoomsPage";
import { OwnerBookingsPage } from "../pages/owner/OwnerBookingsPage";
import { RoomDetailPage } from "../pages/rooms/RoomDetailPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "hotels", element: <HotelsPage /> },
      { path: "hotels/:hotelId", element: <HotelDetailPage /> },
      { path: "rooms/:roomId", element: <RoomDetailPage /> },
      {
        path: "book/:roomId",
        element: (
          <ProtectedRoute>
            <BookingCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookings/:bookingId",
        element: (
          <ProtectedRoute>
            <BookingDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner",
        element: (
          <ProtectedRoute>
            <OwnerDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/hotel",
        element: (
          <ProtectedRoute>
            <OwnerHotelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/rooms",
        element: (
          <ProtectedRoute>
            <OwnerRoomsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/bookings",
        element: (
          <ProtectedRoute>
            <OwnerBookingsPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
