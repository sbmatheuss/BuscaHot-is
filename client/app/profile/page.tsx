'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, loading, loginWithToken, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?redirect=/profile');
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, loading]);

  if (loading || !user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, string> = { name, email };
      if (newPassword) {
        payload.password = newPassword;
        payload.currentPassword = currentPassword;
      }

      const { data } = await api.put('/auth/profile', payload);
      await loginWithToken(data.token);
      setSuccess('Perfil atualizado com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Meu perfil</h1>
          <div className="flex gap-3">
            <Link
              href="/bookings"
              className="text-sm text-primary-600 hover:underline font-medium"
            >
              Minhas reservas
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="text-sm text-red-500 hover:underline font-medium"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <section>
              <h2 className="mb-3 text-base font-semibold text-gray-700">Dados pessoais</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            <hr />

            <section>
              <h2 className="mb-1 text-base font-semibold text-gray-700">Alterar senha</h2>
              <p className="mb-3 text-xs text-gray-400">Deixe em branco para manter a senha atual.</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Senha atual</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nova senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Confirmar nova senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-gray-800 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary-600 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
