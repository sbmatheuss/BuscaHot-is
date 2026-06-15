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
      <div className="mb-6">
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
            <h1 className="mb-4 text-xl font-semibold text-gray-800">
              Hotéis em {destination}
            </h1>
          )}

          {loading && <p className="text-gray-500">Buscando hotéis...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && hotels.length === 0 && (
            <p className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
              Nenhum hotel encontrado com esses filtros. Tente ajustar a busca.
            </p>
          )}

          {!loading && hotels.length > 0 && (
            <>
              <p className="mb-3 text-sm text-gray-500">{total} hotéis encontrados</p>
              <div className="grid gap-4">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-md border bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {page} de {pages}
                  </span>
                  <button
                    disabled={page >= pages}
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    className="rounded-md border bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    Próxima
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
