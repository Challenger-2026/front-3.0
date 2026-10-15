import { Link } from 'react-router-dom';
import logoGuara from '../assets/Guara.png';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto px-4 sm:px-6 py-4 text-[#66513c] bg-[#f7efd9] border-t-[3px] border-[#86b6a2] rounded-t-[32px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-[#a84312]">
            <img src={logoGuara} alt="" className="w-9 h-9 object-contain shrink-0" />
            <div>
              <p className="font-extrabold text-base">Lobo-guará Tech</p>
              <p className="text-xs text-[#35685b]">Natureza inspira. Tecnologia transforma.</p>
            </div>
          </Link>

          <nav aria-label="Navegação do rodapé" className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
            <Link
              className="py-1 transition-colors hover:text-[#a84312] hover:underline focus-visible:text-[#a84312] focus-visible:underline"
              to="/sobre"
            >Sobre</Link>
            <Link
              className="py-1 transition-colors hover:text-[#a84312] hover:underline focus-visible:text-[#a84312] focus-visible:underline"
              to="/solucao">Solução</Link>
            <Link
              className="py-1 transition-colors hover:text-[#a84312] hover:underline focus-visible:text-[#a84312] focus-visible:underline"
              to="/integrantes">Equipe</Link>
            <Link
              className="py-1 transition-colors hover:text-[#a84312] hover:underline focus-visible:text-[#a84312] focus-visible:underline"
              to="/contato"
            > Contato</Link>
          </nav>
        </div>

        <div className="mt-3 pt-3 text-center text-xs border-t border-[#dfd2b6]">
          <p>&copy; {anoAtual} Lobo-guará Tech. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}