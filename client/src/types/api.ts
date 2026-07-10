export type ApiSuccess<T> = {
  success: true;
} & T;

export type ApiError = {
  success: false;
  message: string;
};

export type UserRole = "user" | "owner";

export type User = {
  _id: string;
  username: string;
  email: string;
  image: string;
  role: UserRole;
  recentSearchCities: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Hotel = {
  _id: string;
  name: string;
  address: string;
  contact: string;
  city: string;
  owner: string | User;
  createdAt?: string;
  updatedAt?: string;
};

export type Room = {
  _id: string;
  hotel: string | Hotel;
  roomType: string;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  _id: string;
  user: string | User;
  room: string | Room;
  hotel: string | Hotel;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  guests: number;
  status: BookingStatus;
  paymentMethod: string;
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Review = {
  _id: string;
  user: string | User;
  hotel: string | Hotel;
  room: string | Room;
  booking: string | Booking;
  rating: number;
  title?: string;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
};
