import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number | null;
  reviewCount?: number;
}

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  if (rating == null) {
    return <span className="text-sm text-gray-400">Sem avaliações</span>;
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="flex items-center gap-1 rounded bg-primary-600 px-2 py-0.5 font-semibold text-white">
        <FaStar className="text-yellow-300" />
        {rating.toFixed(1)}
      </span>
      {typeof reviewCount === 'number' && (
        <span className="text-gray-500">({reviewCount} avaliações)</span>
      )}
    </div>
  );
}
