'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Hotel } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

const toISODate = (date: Date) => date.toISOString().split('T')[0];

const defaultCheckIn = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return toISODate(date);
};

const defaultCheckOut = () => {
  const date = new Date();
  date.setDate(date.getDate() + 9);
  return toISODate(date);
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export default function BookingForm({ hotel }: { hotel: Hotel }) {
  const { user } = useAuth();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState(defaultCheckIn());
  const [checkOut, setCheckOut] = useState(defaultCheckOut());
  const [guests, setGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / MS_PER_DAY)
  );
  const totalPrice = hotel.price != null ? hotel.price * nights : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push(`/login?redirect=/hotels/${hotel.id}`);
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('A data de check-out deve ser posterior ao check-in.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/bookings', {
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelAddress: hotel.address,
        hotelImage: hotel.image,
        checkIn,
        checkOut,
        guests,
        pricePerNight: hotel.price ?? 0,
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
      <div className="rounded-xl border bg-green-50 p-4 text-green-800">
        <p className="font-semibold">Reserva confirmada com sucesso!</p>
        <p className="mt-1 text-sm">
          Você pode acompanhar os detalhes em{' '}
          <a href="/bookings" className="font-semibold underline">
            Minhas Reservas
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">Reserve agora</h3>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm text-gray-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm text-gray-800"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-semibold text-gray-500">Hóspedes</label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2 text-sm text-gray-800"
        />
      </div>

      {hotel.price != null && (
        <div className="mb-4 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>
              R$ {hotel.price.toLocaleString('pt-BR')} x {nights} noite(s)
            </span>
            <span>R$ {totalPrice?.toLocaleString('pt-BR')}</span>
          </div>
          <div className="mt-1 flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>R$ {totalPrice?.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      )}

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-primary-600 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {submitting ? 'Reservando...' : user ? 'Reservar agora' : 'Entrar para reservar'}
      </button>
    </form>
  );
}
