'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import api from '@/lib/api';
import { Hotel } from '@/lib/types';
import FacilitiesList from '@/components/FacilitiesList';
import BookingForm from '@/components/BookingForm';
import ReviewSection from '@/components/ReviewSection';

const ratingLabel = (r: number) =>
  r >= 9 ? 'Excepcional' : r >= 8 ? 'Ótimo' : r >= 7 ? 'Muito bom' : r >= 6 ? 'Bom' : 'Satisfatório';

function HotelDetailsContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true); setError('');
      try {
        const qp: Record<string, string> = {};
        const ci = searchParams.get('checkIn');
        const co = searchParams.get('checkOut');
        if (ci) qp.checkIn = ci;
        if (co) qp.checkOut = co;
        const { data } = await api.get<Hotel>(`/hotels/${params.id}`, { params: qp });
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
    return (
      <div className="container-page flex items-center justify-center py-24 gap-3 text-gray-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        Carregando hotel...
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-lg font-semibold text-red-600">{error || 'Hotel não encontrado.'}</p>
      </div>
    );
  }

  const images = hotel.images?.length ? hotel.images : hotel.image ? [hotel.image] : [];

  return (
    <div className="container-page py-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{hotel.name}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          {hotel.city && (
            <span className="flex items-center gap-1 text-sm text-brand-500 font-medium">
              <FaMapMarkerAlt className="shrink-0" />
              {hotel.address ? `${hotel.address}, ${hotel.city}` : hotel.city}
            </span>
          )}
          {hotel.rating != null && (
            <span className="flex items-center gap-1.5 rounded-md bg-green-600 px-2 py-0.5 text-sm font-bold text-white">
              <FaStar className="text-xs" /> {hotel.rating.toFixed(1)} · {ratingLabel(hotel.rating)}
            </span>
          )}
          {hotel.reviewCount > 0 && (
            <span className="text-sm text-gray-500">{hotel.reviewCount.toLocaleString('pt-BR')} avaliações</span>
          )}
        </div>
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div className="mb-6 grid grid-cols-4 gap-2">
          <div className="relative col-span-4 h-72 overflow-hidden rounded-xl sm:col-span-3 sm:h-96">
            <Image src={images[0]} alt={hotel.name} fill className="object-cover" sizes="(max-width:640px)100vw,75vw" />
          </div>
          <div className="col-span-4 grid grid-rows-2 gap-2 sm:col-span-1">
            {images.slice(1, 3).map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl h-28 sm:h-auto">
                <Image src={src} alt={`${hotel.name} ${i + 2}`} fill className="object-cover" sizes="25vw" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Facilities */}
          <div className="card p-5">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Comodidades</h2>
            <FacilitiesList facilities={hotel.facilities} size="md" />
          </div>

          {/* Description */}
          {hotel.description && (
            <div className="card p-5">
              <h2 className="mb-3 text-lg font-bold text-gray-900">Sobre o hotel</h2>
              <p className="leading-relaxed text-gray-600">{hotel.description}</p>
            </div>
          )}

          <ReviewSection hotelId={hotel.id} hotelName={hotel.name} />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
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
