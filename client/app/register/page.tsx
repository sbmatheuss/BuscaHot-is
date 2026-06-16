'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaGoogle, FaHotel } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,           setError]           = useState(
    searchParams.get('error') === 'google' ? 'Não foi possível entrar com Google. Tente novamente.' : ''
  );
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    sessionStorage.setItem('oauth_redirect', redirect);
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('As senhas não coincidem.'); return; }
    if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível criar sua conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-brand-600">
            <FaHotel className="text-accent-500" />
            Busca<span className="text-accent-500">Hotéis</span>
          </Link>
        </div>

        <div className="card p-7">
          <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Criar conta gratuita</h1>
          <p className="mb-6 text-sm text-gray-500">
            Já tem conta?{' '}
            <Link href="/login" className="font-semibold text-brand-500 hover:underline">Entrar</Link>
          </p>

          {/* Google */}
          <button type="button" onClick={handleGoogleLogin}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <FaGoogle className="text-red-500 text-base" />
            Continuar com Google
          </button>

          <div className="mb-4 flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200" /> ou <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Nome completo</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome" className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Senha</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres" className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Confirmar senha</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha" className="input-field" />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-md bg-brand-600 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-60 transition-colors">
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-gray-500">Carregando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
