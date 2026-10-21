import { explicacoes } from '../../../data/explicacoes';
import { useSimulador } from '../../../hooks/useSimulador';

export default function TelaEmConstrucao() {
  const { telaAtual } = useSimulador();

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <p className="text-lg font-bold">{explicacoes[telaAtual].titulo}</p>
      <p className="mt-2 text-sm text-slate-500">Tela em construção</p>
    </div>
  );
}