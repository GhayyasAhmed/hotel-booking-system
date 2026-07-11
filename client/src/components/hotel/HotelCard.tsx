import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin, FiPhone } from "react-icons/fi";
import { type Hotel } from "../../types/api";
import { hotelImage } from "../../lib/images";

type HotelCardProps = {
  hotel: Hotel;
};

export const HotelCard = ({ hotel }: HotelCardProps) => (
  <Link
    className="group overflow-hidden rounded-lg border border-[#eadcc6] bg-[#fffaf0] shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8f6a3a]/10"
    to={`/hotels/${hotel._id}`}
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img className="size-full object-cover transition duration-500 group-hover:scale-105" src={hotelImage} alt={hotel.name} />
      <span className="absolute left-3 top-3 rounded-full bg-[#102f2f]/90 px-3 py-1 text-xs font-semibold text-[#fffaf0]">
        {hotel.city}
      </span>
    </div>
    <div className="p-5">
      <h2 className="text-xl font-semibold text-[#17201b]">{hotel.name}</h2>
      <p className="mt-3 flex items-center gap-2 text-sm text-[#53645b]">
        <FiMapPin aria-hidden="true" />
        {hotel.address}
      </p>
      <p className="mt-2 flex items-center gap-2 text-sm text-[#53645b]">
        <FiPhone aria-hidden="true" />
        {hotel.contact}
      </p>
      <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8a642f]">
        View rooms <FiArrowRight aria-hidden="true" />
      </p>
    </div>
  </Link>
);
