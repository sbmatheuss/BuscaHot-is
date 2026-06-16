import SearchBar from '@/components/SearchBar';
import HotelCard from '@/components/HotelCard';
import { FeaturedResponse, Hotel } from '@/lib/types';
import { FaSwimmingPool, FaParking, FaWifi, FaCoffee, FaSnowflake } from 'react-icons/fa';

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

const perks = [
  { icon: <FaSwimmingPool className="text-brand-500 text-2xl" />, label: 'Piscina' },
  { icon: <FaParking className="text-brand-500 text-2xl" />,      label: 'Estacionamento' },
  { icon: <FaWifi className="text-brand-500 text-2xl" />,         label: 'Wi-Fi grátis' },
  { icon: <FaCoffee className="text-brand-500 text-2xl" />,       label: 'Café da manhã' },
  { icon: <FaSnowflake className="text-brand-500 text-2xl" />,    label: 'Ar-condicionado' },
];

export default async function HomePage() {
  const featuredHotels = await getFeaturedHotels();

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-brand-600 pb-28 pt-12 text-white"
        style={{
          backgroundImage:
            'linear-gradient(135deg, #003B95 0%, #0071C2 60%, #1A8FE3 100%)',
        }}
      >
        <div className="container-page">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-accent-400">
            A melhor plataforma de hospedagem
          </p>
          <h1 className="mb-2 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Encontre hotéis econômicos<br className="hidden sm:block" /> para sua próxima viagem
          </h1>
          <p className="mb-8 max-w-xl text-blue-100">
            Compare preços, filtre por comodidades e reserve com segurança — tudo em um só lugar.
          </p>
          <SearchBar />
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-14 w-full fill-surface">
            <path d="M0,32 C360,56 1080,0 1440,32 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </section>

      {/* Perks strip */}
      <section className="container-page -mt-2 mb-10">
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-white p-5 shadow-card sm:grid-cols-5">
          {perks.map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-1.5 text-center">
              {p.icon}
              <span className="text-xs font-semibold text-gray-600">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured hotels */}
      <section className="container-page pb-16">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">Selecionados para você</p>
            <h2 className="text-2xl font-extrabold text-gray-900">Hotéis mais bem avaliados</h2>
          </div>
          <a href="/search" className="text-sm font-semibold text-brand-500 hover:underline">
            Ver todos →
          </a>
        </div>

        {featuredHotels.length === 0 ? (
          <p className="card p-6 text-gray-500">
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
