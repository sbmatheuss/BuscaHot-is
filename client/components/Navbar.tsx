'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHotel, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <FaHotel />
          BuscaHotéis
        </Link>

        <nav className="flex items-center gap-4 text-sm sm:text-base">
          <Link href="/search" className="hover:underline">
            Buscar hotéis
          </Link>

          {user ? (
            <>
              <Link href="/bookings" className="hover:underline">
                Minhas reservas
              </Link>
              <span className="hidden items-center gap-1 sm:flex">
                <FaUserCircle />
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-primary-700 px-3 py-1.5 hover:bg-primary-500"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-white px-3 py-1.5 font-semibold text-primary-700 hover:bg-primary-50"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
