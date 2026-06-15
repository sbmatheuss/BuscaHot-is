'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Token não encontrado. Tente fazer login novamente.');
      return;
    }

    const redirect = sessionStorage.getItem('oauth_redirect') || '/';
    sessionStorage.removeItem('oauth_redirect');

    loginWithToken(token)
      .then(() => router.replace(redirect))
      .catch(() => {
        setError('Não foi possível autenticar com o Google. Tente novamente.');
      });
  }, []);

  if (error) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <a href="/login" className="text-primary-600 hover:underline font-semibold">
            Voltar ao login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <div className="text-center text-gray-500">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent mx-auto" />
        Autenticando com Google...
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-gray-500">Carregando...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
