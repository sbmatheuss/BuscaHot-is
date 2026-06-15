import {
  FaSwimmingPool,
  FaParking,
  FaSnowflake,
  FaWifi,
  FaCoffee,
  FaDumbbell,
  FaPaw,
} from 'react-icons/fa';
import { Facilities } from '@/lib/types';

const FACILITY_CONFIG: { key: keyof Facilities; label: string; icon: React.ReactNode }[] = [
  { key: 'pool', label: 'Piscina', icon: <FaSwimmingPool /> },
  { key: 'parking', label: 'Estacionamento', icon: <FaParking /> },
  { key: 'ac', label: 'Ar-condicionado', icon: <FaSnowflake /> },
  { key: 'wifi', label: 'Wi-Fi', icon: <FaWifi /> },
  { key: 'breakfast', label: 'Café da manhã', icon: <FaCoffee /> },
  { key: 'gym', label: 'Academia', icon: <FaDumbbell /> },
  { key: 'petFriendly', label: 'Aceita pets', icon: <FaPaw /> },
];

interface FacilitiesListProps {
  facilities: Facilities;
  size?: 'sm' | 'md';
}

export default function FacilitiesList({ facilities, size = 'sm' }: FacilitiesListProps) {
  const active = FACILITY_CONFIG.filter((f) => facilities?.[f.key]);

  if (!active.length) return null;

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex flex-wrap gap-2 ${textSize} text-gray-600`}>
      {active.map((f) => (
        <span key={f.key} className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
          {f.icon}
          {f.label}
        </span>
      ))}
    </div>
  );
}
