import { Fragment } from 'react';
import type { Zona } from '../../types/types';
import { useSimulador } from '../../hooks/useSimulador';
import {
  DIVISOES,
  EMOJI_DIVISAO,
  ZONA_TAMANHO,
  diasParaFimDaSemana,
  participantesLiga,
  zonaDaPosicao,
} from '../../data/liga';
import LinhaRanking from './LinhaRanking';

const coresZona: Record<Zona, string> = {
  subida: 'border-emerald-300 bg-emerald-50',
  descida: 'border-red-200 bg-red-50',
  neutra: 'border-slate-200 bg-white',
};

// Liga semanal (demonstração): ~15 participantes do mesmo nível; os 3 primeiros sobem e os 3 últimos descem
export default function LigaSemanal() {
const { usuario, divisao, pontosSemana, semanaLiga } = useSimulador();

  if (!usuario) return null;

  // Divisão, pontos e grupo mudam quando o fechamento é simulado nos Parâmetros de pontuação
  const lista = participantesLiga(usuario.username, pontosSemana, divisao, semanaLiga);
  const nivel = DIVISOES.indexOf(divisao);
  const dias = diasParaFimDaSemana();

  return (
    <section className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold">
            {EMOJI_DIVISAO[divisao]} Liga {divisao}
          </p>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
            {dias === 0 ? 'Termina hoje' : `Termina em ${dias} ${dias === 1 ? 'dia' : 'dias'}`}
          </span>
        </div>

        <div className="mt-3 flex gap-1">
          {DIVISOES.map((d, i) => (
            <span
              key={d}
              className={`flex-1 whitespace-nowrap rounded-full px-1 py-1 text-center text-[9px] font-bold ${
                i === nivel
                  ? 'bg-[#4F46E5] text-white'
                  : i < nivel
                    ? 'bg-[#4F46E5]/20 text-[#16173A]'
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          {lista.length} participantes do seu nível. Os {ZONA_TAMANHO} primeiros sobem, os {ZONA_TAMANHO} últimos
          descem. Participação automática.
        </p>
      </div>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
        Demonstração: a API não guarda a data das postagens, então os pontos da semana e os outros participantes são
        simulados. O fechamento da liga pode ser simulado nos Parâmetros de pontuação.
      </p>

      <ol className="space-y-2">
        {lista.map((p, i) => (
          <Fragment key={p.chave}>
            {i === 0 && nivel < DIVISOES.length - 1 && (
              <li className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                ▲ Zona de subida
              </li>
            )}
            {i === lista.length - ZONA_TAMANHO && nivel > 0 && (
              <li className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-red-600">
                ▼ Zona de descida
              </li>
            )}
            <LinhaRanking
              posicao={i + 1}
              participante={p}
              cor={coresZona[zonaDaPosicao(i, lista.length, divisao)]}
            />
          </Fragment>
        ))}
      </ol>
    </section>
  );
}