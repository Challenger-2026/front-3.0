import { NavLink, Outlet } from 'react-router-dom';
import { RequisicoesProvider } from '../context/RequisicoesContext';
import { SimuladorProvider } from '../context/SimuladorContext';
import PainelRequisicoes from '../components/simulador/PainelRequisicoes';

// Abas do simulador: o celular, a página de status da API e o painel admin (IA)
const abas = [
  { para: '/simulador', texto: 'Celular' },
  { para: '/simulador/status', texto: 'Status da API' },
  { para: '/simulador/admin', texto: 'Admin (IA)' },
];

// Layout do simulador: os contextos ficam aqui para o estado continuar ao trocar de aba
// (o RequisicoesProvider por fora, para ouvir as chamadas desde a abertura)
export default function Simulador() {
  return (
    <RequisicoesProvider>
      <SimuladorProvider>
        <div className="space-y-4">
          <div className="text-center">
            <span className="inline-block text-xs font-extrabold tracking-[0.14em] uppercase text-[#35685b] bg-[#e3efe9] rounded-full px-3 py-1 mb-3">
              Simulador
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#a84312]">Simulador Lobo-guará Tech</h1>
            <div className="w-24 h-1.5 bg-[#D35400]/40 mx-auto mt-4 mb-4 rounded-full"></div>
            <p className="text-stone-600 text-sm">O app de verdade, chamando a API Java e a API de IA.</p>
          </div>
        
          <nav aria-label="Abas do simulador" className="flex justify-center gap-2">
            {abas.map((aba) => (
              <NavLink
                key={aba.para}
                to={aba.para}
                end
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    isActive ? 'bg-[#35685b] text-white' : 'border border-[#e3cfa8] bg-white text-stone-700 shadow-[0_4px_12px_-6px_rgba(120,78,35,0.35)] hover:border-[#35685b]'
                  }`
                }
              >
                {aba.texto}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </div>
        <PainelRequisicoes />
      </SimuladorProvider>
    </RequisicoesProvider>
  );
}