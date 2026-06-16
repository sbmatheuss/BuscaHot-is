import Link from 'next/link';
import { FaHotel, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-12 bg-brand-800 text-blue-100">
      <div className="container-page py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-lg font-extrabold text-white">
              <FaHotel className="text-accent-500" />
              Busca<span className="text-accent-500">Hotéis</span>
            </div>
            <p className="text-sm text-blue-200">
              Encontre e reserve hotéis econômicos em todo o Brasil com os melhores preços garantidos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-300">Navegação</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Buscar hotéis</Link></li>
              <li><Link href="/bookings" className="hover:text-white transition-colors">Minhas reservas</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Meu perfil</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-300">Conta</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Entrar</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Cadastrar</Link></li>
              <li><Link href="/forgot-password" className="hover:text-white transition-colors">Esqueci minha senha</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-brand-700 pt-6 text-xs text-blue-300 sm:flex-row">
          <p>© {new Date().getFullYear()} BuscaHotéis. Todos os direitos reservados.</p>
          <a
            href="https://github.com/sbmatheuss/BuscaHot-is"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <FaGithub /> Código no GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
