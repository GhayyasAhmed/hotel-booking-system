export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export const getHotelName = (hotel: string | { name: string }) => (typeof hotel === "string" ? "Selected hotel" : hotel.name);

export const getHotelCity = (hotel: string | { city: string }) => (typeof hotel === "string" ? "" : hotel.city);
