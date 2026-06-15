import SearchBar from '@/components/SearchBar';
import HotelCard from '@/components/HotelCard';
import { FeaturedResponse, Hotel } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getFeaturedHotels(): Promise<Hotel[]> {
  try {
    const res = await fetch(`${API_URL}/hotels/featured`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: FeaturedResponse = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredHotels = await getFeaturedHotels();

  return (
    <div>
      <section className="bg-primary-600 pb-24 pt-12 text-white">
        <div className="container-page">
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
            Encontre hotéis econômicos para sua próxima viagem
          </h1>
          <p className="mb-8 text-primary-50">
            Compare preços, filtre por comodidades e reserve direto pelo site.
          </p>
          <SearchBar />
        </div>
      </section>

      <section className="container-page -mt-14 pb-16">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Hotéis recomendados e mais bem avaliados
        </h2>

        {featuredHotels.length === 0 ? (
          <p className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
            Não foi possível carregar os hotéis recomendados agora. Tente novamente em instantes.
          </p>
        ) : (
          <div className="grid gap-4">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
