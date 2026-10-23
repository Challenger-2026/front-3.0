import { Outlet } from 'react-router-dom';
import { RequisicoesProvider } from '../context/RequisicoesContext';
import { SimuladorProvider } from '../context/SimuladorContext';

// Layout do simulador: os contextos ficam aqui para o estado continuar ao trocar de aba
// (o RequisicoesProvider por fora, para ouvir as chamadas desde a abertura)
export default function Simulador() {
  return (
    <RequisicoesProvider>
      <SimuladorProvider>
        <div className="space-y-4">
          <h1 className="text-center text-3xl font-extrabold text-[#a84312]">Simulador do Soul Up</h1>
          <Outlet />
        </div>
      </SimuladorProvider>
    </RequisicoesProvider>
  );
}