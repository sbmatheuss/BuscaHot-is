import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Hotel } from '@/lib/types';
import StarRating from './StarRating';
import FacilitiesList from './FacilitiesList';

interface HotelCardProps {
  hotel: Hotel;
  checkIn?: string;
  checkOut?: string;
}

export default function HotelCard({ hotel, checkIn, checkOut }: HotelCardProps) {
  const params = new URLSearchParams();
  if (checkIn) params.set('checkIn', checkIn);
  if (checkOut) params.set('checkOut', checkOut);
  const query = params.toString();

  return (
    <Link
      href={`/hotels/${hotel.id}${query ? `?${query}` : ''}`}
      className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-lg sm:flex-row"
    >
      <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-64">
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 256px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <FaMapMarkerAlt /> {hotel.city}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{hotel.description}</p>
          <div className="mt-2">
            <FacilitiesList facilities={hotel.facilities} />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <StarRating rating={hotel.rating} reviewCount={hotel.reviewCount} />
          <div className="text-right">
            {hotel.price != null ? (
              <>
                <span className="block text-xs text-gray-500">a partir de</span>
                <span className="text-xl font-bold text-primary-600">
                  R$ {hotel.price.toLocaleString('pt-BR')}
                </span>
                <span className="block text-xs text-gray-500">por noite</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">Preço indisponível</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
