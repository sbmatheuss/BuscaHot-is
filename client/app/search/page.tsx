'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Hotel, HotelSearchResponse, SearchFilters } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import HotelCard from '@/components/HotelCard';

const DEFAULT_FILTERS: SearchFilters = {
  pool: false,
  parking: false,
  ac: false,
  wifi: false,
  breakfast: false,
};

function SearchPageContent() {
  const searchParams = useSearchParams();

  const destination = searchParams.get('destination') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = searchParams.get('adults') || '2';

  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const [page, setPage] = useState(1);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params: Record<string, string> = {
        destination,
        checkIn,
        checkOut,
        adults,
        sortBy,
        page: String(page),
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = 'true';
      });

      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await api.get<HotelSearchResponse>('/hotels/search', { params });
      setHotels(data.results);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      setError('Não foi possível buscar hotéis agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [destination, checkIn, checkOut, adults, filters, maxPrice, sortBy, page]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    setPage(1);
  }, [filters, maxPrice, sortBy, destination]);

  const handleFilterChange = (key: keyof SearchFilters, value: boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container-page py-6">
      <div className="mb-6 rounded-xl bg-brand-600 p-4">
        <SearchBar
          initialDestination={destination}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialAdults={adults}
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <FilterSidebar
          filters={filters}
          maxPrice={maxPrice}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onMaxPriceChange={setMaxPrice}
          onSortByChange={setSortBy}
        />

        <div className="flex-1">
          {destination && (
            <h1 className="mb-4 text-xl font-extrabold text-gray-900">
              Hotéis em <span className="text-brand-600">{destination}</span>
            </h1>
          )}

          {loading && (
            <div className="flex items-center gap-3 py-8 text-gray-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              Buscando hotéis...
            </div>
          )}
          {error && <div className="card p-5 text-red-600">{error}</div>}

          {!loading && !error && hotels.length === 0 && (
            <div className="card p-8 text-center text-gray-500">
              <p className="text-lg font-semibold text-gray-700">Nenhum hotel encontrado</p>
              <p className="mt-1 text-sm">Tente ajustar os filtros ou buscar outro destino.</p>
            </div>
          )}

          {!loading && hotels.length > 0 && (
            <>
              <p className="mb-3 text-sm font-medium text-gray-500"><span className="font-bold text-gray-800">{total}</span> hotéis encontrados</p>
              <div className="grid gap-4">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} checkIn={checkIn} checkOut={checkOut} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-md border bg-white px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    {page} / {pages}
                  </span>
                  <button
                    disabled={page >= pages}
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    className="rounded-md border bg-white px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-gray-500">Carregando...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
