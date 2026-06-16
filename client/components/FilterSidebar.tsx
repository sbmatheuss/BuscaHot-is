'use client';

import { FaSwimmingPool, FaParking, FaSnowflake, FaWifi, FaCoffee } from 'react-icons/fa';
import { SearchFilters } from '@/lib/types';

const FILTER_OPTIONS: { key: keyof SearchFilters; label: string; icon: React.ReactNode }[] = [
  { key: 'pool',      label: 'Piscina',           icon: <FaSwimmingPool className="text-brand-500" /> },
  { key: 'parking',   label: 'Estacionamento',     icon: <FaParking className="text-brand-500" /> },
  { key: 'ac',        label: 'Ar-condicionado',    icon: <FaSnowflake className="text-brand-500" /> },
  { key: 'wifi',      label: 'Wi-Fi grátis',       icon: <FaWifi className="text-brand-500" /> },
  { key: 'breakfast', label: 'Café da manhã',      icon: <FaCoffee className="text-brand-500" /> },
];

interface FilterSidebarProps {
  filters: SearchFilters;
  maxPrice: string;
  sortBy: 'price' | 'rating';
  onFilterChange: (key: keyof SearchFilters, value: boolean) => void;
  onMaxPriceChange: (value: string) => void;
  onSortByChange: (value: 'price' | 'rating') => void;
}

export default function FilterSidebar({
  filters, maxPrice, sortBy,
  onFilterChange, onMaxPriceChange, onSortByChange,
}: FilterSidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-60">
      {/* Sort */}
      <div className="card mb-3 p-4">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">Ordenar por</h3>
        <div className="flex flex-col gap-2">
          {(['price', 'rating'] as const).map((v) => (
            <label
              key={v}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors
                ${sortBy === v ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}
            >
              <input
                type="radio"
                className="accent-brand-500"
                checked={sortBy === v}
                onChange={() => onSortByChange(v)}
              />
              {v === 'price' ? 'Mais econômicos' : 'Melhor avaliados'}
            </label>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div className="card mb-3 p-4">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">Comodidades</h3>
        <div className="flex flex-col gap-2.5">
          {FILTER_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium transition-colors
                ${filters[opt.key] ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand-500"
                checked={filters[opt.key]}
                onChange={(e) => onFilterChange(opt.key, e.target.checked)}
              />
              {opt.icon}
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Max price */}
      <div className="card p-4">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">Preço máximo / noite</h3>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
          <input
            type="number"
            min={0}
            placeholder="Qualquer preço"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>
    </aside>
  );
}
