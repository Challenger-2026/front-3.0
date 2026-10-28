import { useState } from 'react';
import type { RegistroPrevisao } from '../types/types';
import CartaoPrevisaoRisco from '../components/simulador/admin/CartaoPrevisaoRisco';
import PainelExplicacaoAdmin from '../components/simulador/admin/PainelExplicacaoAdmin';
import HistoricoPrevisoes from '../components/simulador/admin/HistoricoPrevisoes';

const proximasAcoes = {
  inicio: 'Clique em "Sortear usuário" para trazer um usuário que o modelo não viu no treino.',
  sorteado: 'Clique em "Prever" para ver o risco, o perfil e as orientações desse usuário.',
  previsto: 'Altere algum valor (ex.: aumente os dias entre ações) e clique em "Prever" de novo para ver o risco mudar.',
};

// Aba "Admin" (/simulador/admin): a previsão de risco de abandono da API Python, com a explicação ao lado
export default function SimuladorAdmin() {
  const [etapa, setEtapa] = useState<keyof typeof proximasAcoes>('inicio');

  const [historico, setHistorico] = useState<RegistroPrevisao[]>([]);

  // A previsão mais recente entra no topo da tabela
  const registrarPrevisao = (registro: Omit<RegistroPrevisao, 'id' | 'horario'>) => {
    setHistorico((anterior) => [{ ...registro, id: Date.now(), horario: new Date().toISOString() }, ...anterior]);
  };

  return (
    <div className="space-y-8">
      <p className="text-center text-stone-700">
        Painel da equipe: a IA estima o risco de abandono e sugere ações de retenção. As chamadas aparecem em
        Requisições.
      </p>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <CartaoPrevisaoRisco aoMudarEtapa={setEtapa} aoPrever={registrarPrevisao} />
        <PainelExplicacaoAdmin proximaAcao={proximasAcoes[etapa]} />
      </div>

      <HistoricoPrevisoes historico={historico} aoLimpar={() => setHistorico([])} />
    </div>
  );
}