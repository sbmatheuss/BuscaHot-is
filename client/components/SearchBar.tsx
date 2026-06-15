'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  initialDestination?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: string;
}

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

export default function SearchBar({
  initialDestination = '',
  initialCheckIn,
  initialCheckOut,
  initialAdults = '2',
}: SearchBarProps) {
  const router = useRouter();
  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState(initialCheckIn || defaultCheckIn());
  const [checkOut, setCheckOut] = useState(initialCheckOut || defaultCheckOut());
  const [adults, setAdults] = useState(initialAdults);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      adults,
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full gap-3 rounded-xl bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className="lg:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-gray-500">Destino</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Para onde você vai?"
          className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">Check-out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-gray-500">Hóspedes</label>
          <input
            type="number"
            min={1}
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-auto flex h-[42px] items-center gap-2 rounded-md bg-primary-600 px-4 font-semibold text-white hover:bg-primary-700"
        >
          <FaSearch /> Buscar
        </button>
      </div>
    </form>
  );
}
