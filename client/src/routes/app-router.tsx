import { createBrowserRouter } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { BookingCreatePage } from "../pages/bookings/BookingCreatePage";
import { BookingDetailPage } from "../pages/bookings/BookingDetailPage";
import { MyBookingsPage } from "../pages/bookings/MyBookingsPage";
import { StripeSuccessPage } from "../pages/bookings/StripeSuccessPage";
import { HomePage } from "../pages/HomePage";
import { HotelDetailPage } from "../pages/hotels/HotelDetailPage";
import { HotelsPage } from "../pages/hotels/HotelsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { OwnerBookingsPage } from "../pages/owner/OwnerBookingsPage";
import { OwnerDashboardPage } from "../pages/owner/OwnerDashboardPage";
import { OwnerHotelPage } from "../pages/owner/OwnerHotelPage";
import { OwnerRoomsPage } from "../pages/owner/OwnerRoomsPage";
import { OwnerSignupPage } from "../pages/owner/OwnerSignupPage";
import { MyReviewsPage } from "../pages/reviews/MyReviewsPage";
import { ReviewCreatePage } from "../pages/reviews/ReviewCreatePage";
import { RoomDetailPage } from "../pages/rooms/RoomDetailPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProtectedOwnerRoute } from "./ProtectedOwnerRoute";

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
        // Stripe redirects here after successful payment; briefly shown then auto-navigates
        path: "loader/my-bookings",
        element: (
          <ProtectedRoute>
            <StripeSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner",
        element: (
          <ProtectedRoute>
            <ProtectedOwnerRoute>
              <OwnerDashboardPage />
            </ProtectedOwnerRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/hotel",
        element: (
          <ProtectedRoute>
            <ProtectedOwnerRoute>
              <OwnerHotelPage />
            </ProtectedOwnerRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/rooms",
        element: (
          <ProtectedRoute>
            <ProtectedOwnerRoute>
              <OwnerRoomsPage />
            </ProtectedOwnerRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/bookings",
        element: (
          <ProtectedRoute>
            <ProtectedOwnerRoute>
              <OwnerBookingsPage />
            </ProtectedOwnerRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "bookings/:bookingId/review",
        element: <ProtectedRoute><ReviewCreatePage /></ProtectedRoute>,
      },
      {
        path: "my-reviews",
        element: <ProtectedRoute><MyReviewsPage /></ProtectedRoute>,
      },
      {
        path: "owner-signup",
        element: <ProtectedRoute><OwnerSignupPage /></ProtectedRoute>,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);