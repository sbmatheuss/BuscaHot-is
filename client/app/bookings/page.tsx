'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaMoon, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import api from '@/lib/api';
import { Booking } from '@/lib/types';
import ProtectedRoute from '@/components/ProtectedRoute';

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get<Booking[]>('/bookings');
      setBookings(data);
    } catch {
      setError('Não foi possível carregar suas reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch {
      setError('Não foi possível cancelar esta reserva.');
    } finally {
      setCancellingId(null);
    }
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Minhas reservas</h1>
        <Link href="/search" className="btn-blue hidden sm:inline-flex">+ Nova reserva</Link>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-12 text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          Carregando reservas...
        </div>
      )}
      {error && <div className="card p-4 text-red-600">{error}</div>}

      {!loading && bookings.length === 0 && !error && (
        <div className="card p-10 text-center">
          <p className="mb-2 text-xl font-bold text-gray-700">Nenhuma reserva ainda</p>
          <p className="mb-5 text-sm text-gray-500">Explore hotéis e faça sua primeira reserva.</p>
          <Link href="/search" className="btn-blue inline-flex">Buscar hotéis</Link>
        </div>
      )}

      <div className="grid gap-4">
        {bookings.map((b) => (
          <div key={b._id} className="card flex flex-col overflow-hidden sm:flex-row">
            {/* Image */}
            <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-52">
              {b.hotelImage ? (
                <Image src={b.hotelImage} alt={b.hotelName} fill className="object-cover" sizes="(max-width:640px)100vw,208px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-5xl text-gray-300">🏨</div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-gray-900">{b.hotelName}</h2>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold
                    ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.status === 'confirmed'
                      ? <><FaCheckCircle /> Confirmada</>
                      : <><FaTimesCircle /> Cancelada</>}
                  </span>
                </div>
                {b.hotelAddress && <p className="mb-3 text-sm text-gray-500">{b.hotelAddress}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-brand-400 shrink-0" />
                    {fmt(b.checkIn)} → {fmt(b.checkOut)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaMoon className="text-brand-400 shrink-0" />
                    {b.nights} noite{b.nights > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaUser className="text-brand-400 shrink-0" />
                    {b.guests} hóspede{b.guests > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400">Total pago</p>
                  <p className="text-xl font-extrabold text-brand-600">R$ {b.totalPrice.toLocaleString('pt-BR')}</p>
                </div>
                {b.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    disabled={cancellingId === b._id}
                    className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
                  >
                    {cancellingId === b._id ? 'Cancelando...' : 'Cancelar'}
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
