'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHotel, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setOpen(false);
  };

  return (
    <header className="bg-brand-600 text-white">
      <div className="container-page flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <FaHotel className="text-accent-500" />
          <span>
            Busca<span className="text-accent-500">Hotéis</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          <Link
            href="/search"
            className="rounded-md px-3 py-1.5 font-medium hover:bg-brand-700 transition-colors"
          >
            Buscar hotéis
          </Link>

          {user ? (
            <>
              <Link
                href="/bookings"
                className="rounded-md px-3 py-1.5 font-medium hover:bg-brand-700 transition-colors"
              >
                Minhas reservas
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium hover:bg-brand-700 transition-colors"
              >
                <FaUserCircle className="text-accent-400" />
                {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="ml-1 rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 font-medium hover:bg-brand-700 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="ml-1 rounded-md bg-accent-500 px-4 py-1.5 font-bold text-brand-800 hover:bg-accent-600 transition-colors"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="flex sm:hidden rounded-md p-2 hover:bg-brand-700"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-brand-700 bg-brand-600 sm:hidden">
          <div className="container-page flex flex-col gap-1 py-3 text-sm">
            <Link href="/search" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 font-medium hover:bg-brand-700">
              Buscar hotéis
            </Link>
            {user ? (
              <>
                <Link href="/bookings" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 font-medium hover:bg-brand-700">
                  Minhas reservas
                </Link>
                <Link href="/profile" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 font-medium hover:bg-brand-700">
                  Meu perfil
                </Link>
                <button onClick={handleLogout} className="rounded-md px-3 py-2 text-left font-medium hover:bg-brand-700 text-red-300">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 font-medium hover:bg-brand-700">
                  Entrar
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="rounded-md bg-accent-500 px-3 py-2 font-bold text-brand-800">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
