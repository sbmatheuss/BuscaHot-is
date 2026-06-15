'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { Booking } from '@/lib/types';
import ProtectedRoute from '@/components/ProtectedRoute';

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get<Booking[]>('/bookings');
      setBookings(data);
    } catch {
      setError('Não foi possível carregar suas reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch {
      setError('Não foi possível cancelar esta reserva.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="container-page py-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Minhas reservas</h1>

      {loading && <p className="text-gray-500">Carregando reservas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && bookings.length === 0 && !error && (
        <p className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
          Você ainda não tem reservas.{' '}
          <Link href="/search" className="font-semibold text-primary-600 hover:underline">
            Buscar hotéis
          </Link>
        </p>
      )}

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row"
          >
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-48">
              {booking.hotelImage ? (
                <Image
                  src={booking.hotelImage}
                  alt={booking.hotelName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                  Sem imagem
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">{booking.hotelName}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{booking.hotelAddress}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Check-in: <strong>{formatDate(booking.checkIn)}</strong> · Check-out:{' '}
                  <strong>{formatDate(booking.checkOut)}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  {booking.nights} noite(s) · {booking.guests} hóspede(s)
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">
                  R$ {booking.totalPrice.toLocaleString('pt-BR')}
                </span>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {cancellingId === booking._id ? 'Cancelando...' : 'Cancelar reserva'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}
