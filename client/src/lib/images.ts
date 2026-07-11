export const hotelImage =
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80";

export const roomFallbackImage =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";

export const getRoomImage = (images?: string[]) => images?.[0] || roomFallbackImage;
