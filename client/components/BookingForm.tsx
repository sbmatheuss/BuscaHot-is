'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaCalendarAlt, FaUser } from 'react-icons/fa';
import api from '@/lib/api';
import { Hotel } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

const toISODate = (d: Date) => d.toISOString().split('T')[0];
const defaultCheckIn  = () => { const d = new Date(); d.setDate(d.getDate() + 7); return toISODate(d); };
const defaultCheckOut = () => { const d = new Date(); d.setDate(d.getDate() + 9); return toISODate(d); };
const MS_PER_DAY = 864e5;

export default function BookingForm({ hotel }: { hotel: Hotel }) {
  const { user } = useAuth();
  const router = useRouter();

  const [checkIn,  setCheckIn]  = useState(defaultCheckIn());
  const [checkOut, setCheckOut] = useState(defaultCheckOut());
  const [guests,   setGuests]   = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / MS_PER_DAY));
  const total  = hotel.price != null ? hotel.price * nights : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) { router.push(`/login?redirect=/hotels/${hotel.id}`); return; }
    if (new Date(checkOut) <= new Date(checkIn)) { setError('Check-out deve ser posterior ao check-in.'); return; }
    setSubmitting(true); setError('');
    try {
      await api.post('/bookings', {
        hotelId: hotel.id, hotelName: hotel.name,
        hotelAddress: hotel.address, hotelImage: hotel.image,
        checkIn, checkOut, guests, pricePerNight: hotel.price ?? 0,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível concluir a reserva.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card p-5 text-center">
        <FaCheckCircle className="mx-auto mb-3 text-4xl text-green-500" />
        <p className="font-bold text-gray-800">Reserva confirmada!</p>
        <p className="mt-1 text-sm text-gray-500">
          Acompanhe em{' '}
          <a href="/bookings" className="font-semibold text-brand-500 hover:underline">Minhas reservas</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card overflow-hidden">
      {/* Header */}
      <div className="bg-brand-600 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">A partir de</p>
        {hotel.price != null ? (
          <p className="text-3xl font-extrabold">
            R$ {hotel.price.toLocaleString('pt-BR')}
            <span className="text-sm font-normal text-blue-200"> / noite</span>
          </p>
        ) : (
          <p className="text-lg font-semibold">Preço sob consulta</p>
        )}
      </div>

      <div className="p-5">
        {/* Dates */}
        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
              <FaCalendarAlt className="text-brand-400" /> Check-in
            </label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
              className="input-field text-sm" />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
              <FaCalendarAlt className="text-brand-400" /> Check-out
            </label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
              className="input-field text-sm" />
          </div>
        </div>

        {/* Guests */}
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
            <FaUser className="text-brand-400" /> Hóspedes
          </label>
          <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))}
            className="input-field text-sm" />
        </div>

        {/* Price summary */}
        {total != null && (
          <div className="mb-4 rounded-lg bg-surface p-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>R$ {hotel.price?.toLocaleString('pt-BR')} × {nights} noite{nights > 1 ? 's' : ''}</span>
              <span>R$ {total.toLocaleString('pt-BR')}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-800">
              <span>Total</span>
              <span className="text-brand-600">R$ {total.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        )}

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-accent-500 py-3 font-bold text-brand-800 hover:bg-accent-600 disabled:opacity-60 transition-colors text-sm"
        >
          {submitting ? 'Reservando...' : user ? 'Reservar agora' : 'Entrar para reservar'}
        </button>
        <p className="mt-2 text-center text-xs text-gray-400">Sem taxas ocultas · Cancelamento grátis</p>
      </div>
    </form>
  );
}
