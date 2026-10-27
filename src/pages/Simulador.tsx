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
          <h1 className="text-center text-3xl font-extrabold text-[#a84312]">Simulador do Soul Up</h1>
        
          <nav aria-label="Abas do simulador" className="flex justify-center gap-2">
            {abas.map((aba) => (
              <NavLink
                key={aba.para}
                to={aba.para}
                end
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    isActive ? 'bg-[#35685b] text-white' : 'border border-[#ead9b6] bg-[#fffbed] text-stone-700 hover:border-[#35685b]'
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