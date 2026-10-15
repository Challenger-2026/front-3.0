import { Link, NavLink } from 'react-router-dom';
import logoGuara from '../assets/Guara.png';
import type { CabecalhoProps, ItemMenu } from '../types/types';

export default function Header({ titulo }: CabecalhoProps) {
  const itensMenu: ItemMenu[] = [
    { label: 'Início', path: '/' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Nossa Solução', path: '/solucao' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Integrantes', path: '/integrantes' },
    { label: 'Contato', path: '/contato' },
  ];


  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 bg-[#fffbed]/95 border-b border-[#ead9b6] shadow-[0_4px_18px_rgba(120,78,35,0.08)]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
        
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={logoGuara}
            alt={`Logo ${titulo}`}
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
          />
          <div>
            <p className="text-lg sm:text-xl font-extrabold text-[#a84312]">{titulo}</p>
            <p className="text-xs text-[#35685b]">Tecnologia que cuida do amanhã</p>
          </div>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="relative flex flex-wrap justify-center items-center gap-1 max-w-full p-2.5 sm:py-3 sm:px-5 bg-[#fffbed]/80 rounded-full backdrop-blur-[15px] border border-[#a86b2a]/25 shadow-[0_15px_35px_rgba(120,78,35,0.1)] transition-all duration-300 hover:bg-[#fffbed]/95 hover:shadow-[0_15px_35px_rgba(211,84,0,0.12)] focus-within:bg-[#fffbed]/95 focus-within:shadow-[0_15px_35px_rgba(211,84,0,0.12)]"
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
      </div>
    </header>
  );
}