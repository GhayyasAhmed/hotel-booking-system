import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { formatCurrency, getHotelCity, getHotelName } from "../../lib/format";
import { getRoomImage } from "../../lib/images";
import { type Room } from "../../types/api";

type RoomCardProps = {
  room: Room;
};

export const RoomCard = ({ room }: RoomCardProps) => (
  <Link
    className="group overflow-hidden rounded-lg border border-[#eadcc6] bg-[#fffaf0] shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8f6a3a]/10"
    to={`/rooms/${room._id}`}
  >
    <div className="aspect-[4/3] overflow-hidden">
      <img className="size-full object-cover transition duration-500 group-hover:scale-105" src={getRoomImage(room.images)} alt={room.roomType} />
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#17201b]">{room.roomType}</h2>
          <p className="mt-1 text-sm text-[#53645b]">{getHotelName(room.hotel)}</p>
          {getHotelCity(room.hotel) ? <p className="text-sm text-[#8a642f]">{getHotelCity(room.hotel)}</p> : null}
        </div>
        <p className="text-right text-lg font-semibold text-[#102f2f]">{formatCurrency(room.pricePerNight)}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {room.amenities.slice(0, 3).map((amenity) => (
          <span className="rounded-full bg-[#f3e8d4] px-3 py-1 text-xs font-medium text-[#5f4a31]" key={amenity}>
            {amenity}
          </span>
        ))}
      </div>
      <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8a642f]">
        See details <FiArrowRight aria-hidden="true" />
      </p>
    </div>
  </Link>
);
