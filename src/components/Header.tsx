import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logoGuara from '../assets/Guara.png';
import type { CabecalhoProps, ItemMenu } from '../types/types';

export default function Header({ titulo }: CabecalhoProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [passouDoVideo, setPassouDoVideo] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setPassouDoVideo(true);
      } else {
        setPassouDoVideo(false);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const mostrarHeader = !isHome || passouDoVideo;

  const itensMenu: ItemMenu[] = [
    { label: 'Início', path: '/' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Nossa Solução', path: '/solucao' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Integrantes', path: '/integrantes' },
    { label: 'Contato', path: '/contato' },
    { label: 'Simulador', path: '/simulador' },
  ];

  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

  return (
    <header
      className={`z-50 px-4 sm:px-6 py-3 sm:py-4 bg-[#fffbed] border-b border-[#ead9b6] shadow-[0_4px_18px_rgba(120,78,35,0.08)] transition-transform duration-500 ${
        isHome ? 'fixed top-0 left-0 w-full' : 'sticky top-0 w-full'
      } ${mostrarHeader ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={logoGuara}
            alt={`Logo ${titulo}`}
            className="w-10 h-10 sm:w-14 sm:h-14 object-contain shrink-0"
          />
          <div>
            <p className="text-lg sm:text-base font-extrabold text-[#a84312]">{titulo}</p>
            <p className="text-xs text-[#35685b]">Tecnologia que cuida do amanhã</p>
          </div>
        </Link>

        <nav aria-label="Navegação principal" className="relative hidden lg:flex flex-wrap justify-center items-center gap-1 max-w-full p-2.5 sm:py-3 sm:px-5 bg-white rounded-full border border-[#e3cfa8] shadow-[0_8px_22px_-10px_rgba(120,78,35,0.35)] transition-all duration-300 hover:shadow-[0_10px_26px_-10px_rgba(211,84,0,0.35)] focus-within:shadow-[0_10px_26px_-10px_rgba(211,84,0,0.35)]"
        >
          {itensMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `${efeitoOnda} py-2 px-3.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors duration-300 ${
                  isActive
                    ? 'bg-[#a84312] text-[#fffbed]'
                    : 'text-[#66513c] hover:bg-[#f9e8c9] hover:text-[#a84312] focus-visible:bg-[#f9e8c9] focus-visible:text-[#a84312]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-celular"
          className="lg:hidden w-11 h-11 shrink-0 rounded-full border border-[#a86b2a]/30 bg-white text-[#a84312] flex items-center justify-center cursor-pointer transition-colors hover:bg-[#f9e8c9]"
        >
          {menuAberto ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>
      {menuAberto && (
        <>
          <div
            onClick={() => setMenuAberto(false)}
            aria-hidden
            className="lg:hidden absolute top-full left-0 w-full h-screen bg-stone-900/25 animate-fundo"
          />
          <nav
            id="menu-celular"
            aria-label="Navegação principal no celular"
            className="lg:hidden absolute top-full left-0 w-full flex flex-col gap-1 px-4 pt-2 pb-4 bg-[#fffbed] border-b border-[#ead9b6] shadow-[0_12px_24px_rgba(120,78,35,0.12)]"
          >
            {itensMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMenuAberto(false)}
                className={({ isActive }) =>
                  `py-2.5 px-4 rounded-full text-sm font-bold transition-colors duration-300 ${
                    isActive
                      ? 'bg-[#a84312] text-[#fffbed]'
                      : 'text-[#66513c] hover:bg-[#f9e8c9] hover:text-[#a84312]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}