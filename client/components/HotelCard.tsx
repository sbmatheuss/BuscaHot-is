import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { Hotel } from '@/lib/types';
import FacilitiesList from './FacilitiesList';

interface HotelCardProps {
  hotel: Hotel;
  checkIn?: string;
  checkOut?: string;
}

const ratingLabel = (r: number) =>
  r >= 9 ? 'Excepcional' : r >= 8 ? 'Ótimo' : r >= 7 ? 'Muito bom' : r >= 6 ? 'Bom' : 'Satisfatório';

const ratingColor = (r: number) =>
  r >= 8.5 ? 'bg-green-600' : r >= 7 ? 'bg-brand-600' : 'bg-gray-500';

export default function HotelCard({ hotel, checkIn, checkOut }: HotelCardProps) {
  const params = new URLSearchParams();
  if (checkIn)  params.set('checkIn', checkIn);
  if (checkOut) params.set('checkOut', checkOut);
  const query = params.toString();

  return (
    <Link
      href={`/hotels/${hotel.id}${query ? `?${query}` : ''}`}
      className="card flex flex-col overflow-hidden sm:flex-row hover:border-brand-400 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-60">
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 240px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300 text-4xl">
            🏨
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{hotel.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-500 font-medium">
            <FaMapMarkerAlt className="shrink-0" />
            {hotel.city}
          </p>
          {hotel.description && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-500">{hotel.description}</p>
          )}
          <div className="mt-3">
            <FacilitiesList facilities={hotel.facilities} />
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-end justify-between gap-4 border-t border-gray-100 pt-3">
          {/* Rating */}
          <div className="flex items-center gap-2">
            {hotel.rating != null && (
              <>
                <span className={`${ratingColor(hotel.rating)} inline-flex items-center rounded-md px-2 py-0.5 text-sm font-bold text-white`}>
                  {hotel.rating.toFixed(1)}
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{ratingLabel(hotel.rating)}</p>
                  {hotel.reviewCount > 0 && (
                    <p className="text-xs text-gray-400">{hotel.reviewCount.toLocaleString('pt-BR')} avaliações</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            {hotel.price != null ? (
              <>
                <p className="text-2xl font-extrabold text-brand-600 leading-none">
                  R$ {hotel.price.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-400">por noite</p>
                <p className="mt-1 flex items-center justify-end gap-1 text-xs text-green-600 font-medium">
                  <FaCheckCircle className="shrink-0" /> Reserva gratuita
                </p>
              </>
            ) : (
              <span className="text-sm text-gray-400">Consulte o preço</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
