'use client';

import {
  FaSwimmingPool,
  FaParking,
  FaSnowflake,
  FaWifi,
  FaCoffee,
} from 'react-icons/fa';
import { SearchFilters } from '@/lib/types';

const FILTER_OPTIONS: { key: keyof SearchFilters; label: string; icon: React.ReactNode }[] = [
  { key: 'pool', label: 'Piscina', icon: <FaSwimmingPool /> },
  { key: 'parking', label: 'Estacionamento', icon: <FaParking /> },
  { key: 'ac', label: 'Ar-condicionado', icon: <FaSnowflake /> },
  { key: 'wifi', label: 'Wi-Fi', icon: <FaWifi /> },
  { key: 'breakfast', label: 'Café da manhã', icon: <FaCoffee /> },
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
  filters,
  maxPrice,
  sortBy,
  onFilterChange,
  onMaxPriceChange,
  onSortByChange,
}: FilterSidebarProps) {
  return (
    <aside className="w-full shrink-0 rounded-xl border bg-white p-4 shadow-sm lg:w-64">
      <h3 className="mb-3 font-semibold text-gray-800">Ordenar por</h3>
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as 'price' | 'rating')}
        className="mb-4 w-full rounded-md border px-3 py-2 text-sm text-gray-700"
      >
        <option value="price">Mais econômicos</option>
        <option value="rating">Melhor avaliados</option>
      </select>

      <h3 className="mb-3 font-semibold text-gray-800">Comodidades</h3>
      <div className="flex flex-col gap-2">
        {FILTER_OPTIONS.map((option) => (
          <label key={option.key} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={filters[option.key]}
              onChange={(e) => onFilterChange(option.key, e.target.checked)}
              className="h-4 w-4 accent-primary-600"
            />
            {option.icon}
            {option.label}
          </label>
        ))}
      </div>

      <h3 className="mb-2 mt-4 font-semibold text-gray-800">Preço máximo (por noite)</h3>
      <input
        type="number"
        min={0}
        placeholder="Ex: 250"
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm text-gray-700"
      />
    </aside>
  );
}
