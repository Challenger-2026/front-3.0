import { Fragment } from 'react';
import { useSimulador } from '../../hooks/useSimulador';
import {
  FONTE_DISTINTIVOS,
  PONTOS_MES_DEMO,
  TOP_DISTINTIVO,
  diasParaFimDoMes,
  distintivoDoMesAtual,
  faltamParaTop,
  participantesMes,
} from '../../data/liga';
import { formatarPontos } from '../../utils/formatadores';
import LinhaRanking from './LinhaRanking';

// Disputa mensal (demonstração): o top 10 do mês ganha o distintivo da fauna em risco de extinção
export default function DisputaMensal() {
  const { usuario } = useSimulador();

  if (!usuario) return null;

  const distintivo = distintivoDoMesAtual();
  const lista = participantesMes(usuario.username, PONTOS_MES_DEMO);
  const faltam = faltamParaTop(lista);
  const dias = diasParaFimDoMes();

  return (
    <section className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#8B3CF0] p-4 text-white shadow-sm">
        <p className="text-[10px] uppercase tracking-wider text-white/70">Distintivo em disputa · {distintivo.mes}</p>
        <p className="mt-1 text-lg font-extrabold">
          {distintivo.emoji} {distintivo.animal}
        </p>
        <p className="text-[11px] text-white/80">{distintivo.status}</p>
        <p className="text-[10px] text-white/70">Fonte: {FONTE_DISTINTIVOS}</p>
        <p className="mt-2 text-xs text-white/90">{distintivo.texto}</p>
        <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#16173A]">
          {faltam === 0
            ? `Você está no top ${TOP_DISTINTIVO}! Mantenha a posição até o fim do mês.`
            : `Faltam ${formatarPontos(faltam)} pts para entrar no top ${TOP_DISTINTIVO}.`}{' '}
          <span className="font-semibold text-slate-500">
            {dias === 0 ? 'Termina hoje.' : `Termina em ${dias} ${dias === 1 ? 'dia' : 'dias'}.`}
          </span>
        </p>
      </div>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
        Demonstração: a API não guarda a data das postagens, então os pontos do mês e os outros participantes são
        fixos.
      </p>

      <ol className="space-y-2">
        {lista.map((p, i) => (
          <Fragment key={p.chave}>
            {i === TOP_DISTINTIVO && (
              <li className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Linha do distintivo
              </li>
            )}
            <LinhaRanking
              posicao={i + 1}
              participante={p}
              cor={i < TOP_DISTINTIVO ? 'border-[#4F46E5]/25 bg-[#4F46E5]/5' : 'border-slate-200 bg-white'}
            />
          </Fragment>
        ))}
      </ol>
    </section>
  );
}