import { type Hotel, type Room } from "../types/api";

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export const getHotelName = (hotel: string | Hotel) =>
  typeof hotel === "string" ? "Selected hotel" : hotel.name;

export const getHotelCity = (hotel: string | Hotel) =>
  typeof hotel === "string" ? "" : hotel.city;

export const getRoomType = (room: string | Room) =>
  typeof room === "string" ? "Room" : room.roomType;