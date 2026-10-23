import { useState } from 'react';
import type { IntervaloRanking } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { INTERVALOS_RANKING, QUANTIDADE_AMIGOS_DEMO, rankingEntreAmigos, rankingGeral } from '../../../data/liga';
import LinhaRanking from '../LinhaRanking';
import LigaSemanal from '../LigaSemanal';
import DisputaMensal from '../DisputaMensal';

export default function TelaRanking() {
  const { usuario, usuarios, postagens, comunidades, ocultoEntreAmigos, irPara } = useSimulador();
  const [intervalo, setIntervalo] = useState<IntervaloRanking>('Mensal');
  const [idComunidade, setIdComunidade] = useState<number | null>(null); // null = todas

  if (!usuario) return null;

  const geral = rankingGeral(usuarios, postagens, usuario.id, idComunidade);
  const amigos = rankingEntreAmigos(usuarios, usuario.id, ocultoEntreAmigos);

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Ranking</p>
        <h1 className="text-xl font-bold leading-snug">Veja onde você está nessa jornada.</h1>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {INTERVALOS_RANKING.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIntervalo(i)}
            className={`whitespace-nowrap rounded-full px-1 py-1.5 text-[11px] font-bold cursor-pointer ${
              intervalo === i ? 'bg-[#4F46E5] text-white' : 'border border-slate-200 bg-white text-slate-500'
            }`}
          >
            {i}
          </button>
        ))}
      </div>
    {intervalo === 'Semanal' && <LigaSemanal />}  
    {intervalo === 'Mensal' && <DisputaMensal />}
      {intervalo === 'Geral' && (
        <section className="space-y-3">
          <label htmlFor="ranking-comunidade" className="sr-only">
            Comunidade do ranking
          </label>
          <select
            id="ranking-comunidade"
            value={idComunidade ?? ''}
            onChange={(e) => setIdComunidade(e.target.value === '' ? null : Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none"
          >
            <option value="">Todas as comunidades</option>
            {comunidades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nmComunidade}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            {idComunidade === null
              ? 'Saldo total de cada pessoa na API (sdPonto).'
              : 'Soma dos pontos das ações aprovadas nesta comunidade (ptGerado das postagens da API).'}
          </p>
          <ol className="space-y-2">
            {geral.map((p, i) => (
              <LinhaRanking key={p.chave} posicao={i + 1} participante={p} />
            ))}
          </ol>
        </section>
      )}

      {intervalo === 'Entre amigos' && (
        <section className="space-y-3">
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
            Demonstração: a API não tem a opção de seguir. Aqui aparecem {ocultoEntreAmigos ? '' : 'você e '}
            {QUANTIDADE_AMIGOS_DEMO} pessoas cadastradas, com o saldo real da API.
          </p>
          {ocultoEntreAmigos && (
            <p className="flex items-center justify-between gap-2 rounded-xl bg-slate-100 px-3 py-2 text-[11px] text-slate-500">
              Seu perfil está oculto deste ranking.
              <button
                type="button"
                onClick={() => irPara('privacidade')}
                className="shrink-0 font-bold text-[#4F46E5] underline cursor-pointer"
              >
                Mudar na Privacidade
              </button>
            </p>
          )}
          <ol className="space-y-2">
            {amigos.map((p, i) => (
              <LinhaRanking key={p.chave} posicao={i + 1} participante={p} />
            ))}
          </ol>
        </section>
      )}
    </>
  );
}