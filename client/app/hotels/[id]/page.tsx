'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';
import api from '@/lib/api';
import { Hotel } from '@/lib/types';
import StarRating from '@/components/StarRating';
import FacilitiesList from '@/components/FacilitiesList';
import BookingForm from '@/components/BookingForm';

function HotelDetailsContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError('');

      try {
        const queryParams: Record<string, string> = {};
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        if (checkIn) queryParams.checkIn = checkIn;
        if (checkOut) queryParams.checkOut = checkOut;

        const { data } = await api.get<Hotel>(`/hotels/${params.id}`, { params: queryParams });
        setHotel(data);
      } catch {
        setError('Não foi possível carregar os detalhes deste hotel.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchHotel();
  }, [params.id, searchParams]);

  if (loading) {
    return <div className="container-page py-16 text-center text-gray-500">Carregando...</div>;
  }

  if (error || !hotel) {
    return (
      <div className="container-page py-16 text-center text-red-600">
        {error || 'Hotel não encontrado.'}
      </div>
    );
  }

  const images = hotel.images?.length ? hotel.images : hotel.image ? [hotel.image] : [];

  return (
    <div className="container-page py-6">
      <h1 className="text-2xl font-bold text-gray-800">{hotel.name}</h1>
      <p className="mb-4 flex items-center gap-1 text-gray-500">
        <FaMapMarkerAlt /> {hotel.address || hotel.city}
      </p>

      {images.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="relative h-72 overflow-hidden rounded-xl sm:col-span-2 sm:h-96">
            <Image src={images[0]} alt={hotel.name} fill className="object-cover" sizes="100vw" />
          </div>
          {images.slice(1, 3).map((src, i) => (
            <div key={i} className="relative h-48 overflow-hidden rounded-xl">
              <Image
                src={src}
                alt={`${hotel.name} - foto ${i + 2}`}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <StarRating rating={hotel.rating} reviewCount={hotel.reviewCount} />
          </div>

          {hotel.description && (
            <p className="mb-4 leading-relaxed text-gray-700">{hotel.description}</p>
          )}

          <h2 className="mb-2 text-lg font-semibold text-gray-800">Comodidades</h2>
          <FacilitiesList facilities={hotel.facilities} size="md" />
        </div>

        <div>
          <BookingForm hotel={hotel} />
        </div>
      </div>
    </div>
  );
}

export default function HotelDetailsPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-gray-500">Carregando...</div>}>
      <HotelDetailsContent />
    </Suspense>
  );
}
