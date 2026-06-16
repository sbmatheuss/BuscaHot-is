'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  initialDestination?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: string;
}

const toISODate = (date: Date) => date.toISOString().split('T')[0];

const defaultCheckIn = () => {
  const d = new Date(); d.setDate(d.getDate() + 7); return toISODate(d);
};
const defaultCheckOut = () => {
  const d = new Date(); d.setDate(d.getDate() + 9); return toISODate(d);
};

export default function SearchBar({
  initialDestination = '',
  initialCheckIn,
  initialCheckOut,
  initialAdults = '2',
}: SearchBarProps) {
  const router = useRouter();
  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn]   = useState(initialCheckIn  || defaultCheckIn());
  const [checkOut, setCheckOut] = useState(initialCheckOut || defaultCheckOut());
  const [adults, setAdults]     = useState(initialAdults);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/search?${new URLSearchParams({ destination, checkIn, checkOut, adults })}`);
  };

  const fieldClass =
    'w-full bg-white rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100';

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full gap-2 rounded-xl bg-accent-500 p-2 shadow-xl sm:grid-cols-2 lg:grid-cols-9"
    >
      {/* Destino */}
      <div className="relative lg:col-span-3">
        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Para onde você vai?"
          className={`${fieldClass} pl-8`}
        />
      </div>

      {/* Check-in */}
      <div className="relative lg:col-span-2">
        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className={`${fieldClass} pl-8`}
        />
      </div>

      {/* Check-out */}
      <div className="relative lg:col-span-2">
        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className={`${fieldClass} pl-8`}
        />
      </div>

      {/* Hóspedes */}
      <div className="relative lg:col-span-1">
        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        <input
          type="number"
          min={1}
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          className={`${fieldClass} pl-8`}
        />
      </div>

      {/* Botão */}
      <button
        type="submit"
        className="lg:col-span-1 flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 font-bold text-white hover:bg-brand-700 transition-colors text-sm"
      >
        <FaSearch />
        <span className="lg:hidden">Buscar</span>
      </button>
    </form>
  );
}
