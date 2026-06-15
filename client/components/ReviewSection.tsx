'use client';

import { useState, useEffect, FormEvent } from 'react';
import { FaStar, FaTrash } from 'react-icons/fa';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsData {
  reviews: Review[];
  average: number | null;
  total: number;
}

export default function ReviewSection({ hotelId, hotelName }: { hotelId: string; hotelName: string }) {
  const { user } = useAuth();

  const [data, setData] = useState<ReviewsData>({ reviews: [], average: null, total: 0 });
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(8);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchReviews = async () => {
    try {
      const { data: res } = await api.get<ReviewsData>(`/reviews/${hotelId}`);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [hotelId]);

  const myReview = user ? data.reviews.find((r) => r.user._id === (user as any)._id) : null;

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    }
  }, [myReview]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!comment.trim()) { setFormError('Escreva um comentário.'); return; }
    setSubmitting(true);
    try {
      await api.post('/reviews', { hotelId, hotelName, rating, comment });
      setComment('');
      await fetchReviews();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Erro ao enviar avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Remover sua avaliação?')) return;
    try {
      await api.delete(`/reviews/${hotelId}`);
      setComment('');
      setRating(8);
      await fetchReviews();
    } catch {}
  };

  const ratingLabel = (n: number) =>
    n >= 9 ? 'Excepcional' : n >= 8 ? 'Ótimo' : n >= 7 ? 'Bom' : n >= 6 ? 'Satisfatório' : 'Regular';

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Avaliações dos hóspedes
        {data.average && (
          <span className="ml-2 rounded-md bg-primary-600 px-2 py-0.5 text-sm font-semibold text-white">
            {data.average} / 10
          </span>
        )}
        {data.total > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-400">{data.total} avaliação{data.total > 1 ? 'ões' : ''}</span>
        )}
      </h2>

      {user && (
        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-gray-700">
            {myReview ? 'Editar sua avaliação' : 'Deixe sua avaliação'}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nota: <span className="text-primary-600 font-bold">{rating}</span>/10 — {ratingLabel(rating)}
              </label>
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    className="text-xl transition-transform hover:scale-110"
                  >
                    <FaStar className={(hover || rating) >= n ? 'text-yellow-400' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Comentário</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte sua experiência..."
                className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none resize-none"
              />
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-primary-600 px-5 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {submitting ? 'Enviando...' : myReview ? 'Atualizar' : 'Enviar avaliação'}
              </button>
              {myReview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1 rounded-md border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  <FaTrash size={12} /> Remover
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Carregando avaliações...</p>
      ) : data.reviews.length === 0 ? (
        <p className="text-gray-400">Ainda não há avaliações para este hotel. Seja o primeiro!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {data.reviews.map((review) => (
            <div key={review._id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-gray-800">{review.user.name}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary-600 px-2 py-0.5 text-sm font-bold text-white">
                    {review.rating}/10
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
