import { useState } from 'react';
import { FiTarget, FiCalendar, FiAward, FiArrowUpRight } from 'react-icons/fi';
import type { PeriodoMeta } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import {
  PERIODOS_META,
  pontosDoDiaMeta,
  pontosSequencia,
  proximaMetrica,
  fimDaMeta,
  diasRestantes,
  concluidasDaMeta,
} from '../../../data/metas';

// Botão de opção: preenchido quando selecionado
const classeOpcao = (ativo: boolean) =>
  `rounded-xl border px-3 py-3 text-sm font-bold cursor-pointer ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

const classeContador =
  'grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-lg font-bold cursor-pointer disabled:opacity-40';

const classeBotao = 'w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer';
const classeBotaoPrincipal = 'w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer';

const formatarDia = (data: Date) => data.toLocaleDateString('pt-BR');

export default function TelaMetas() {
  const {
    usuario,
    postagens,
    metas,
    criarMeta,
    aumentarMeta,
    subirMetrica,
    recusarUpgrade,
    encerrarMeta,
    irPara,
    sugestao,
  } = useSimulador();

  // Veio do "Para você": começa com o período sugerido pelo onboarding
  const periodoSugerido = sugestao?.tela === 'metas' ? sugestao.periodoDias : null;

  // Escolhas da tela antes de começar a meta e do acréscimo de alvo
  const [periodo, setPeriodo] = useState<PeriodoMeta>(periodoSugerido ?? 15);
  const [alvo, setAlvo] = useState(7);
  const [extra, setExtra] = useState(1);

  if (!usuario) return null;

  const meta = metas[usuario.id];

  // ----- Sem meta: escolher período e alvo -----
  if (!meta) {
    const noTeto = alvo >= periodo;

    const escolherPeriodo = (p: PeriodoMeta) => {
      setPeriodo(p);
      setAlvo((atual) => Math.min(atual, p));
    };

    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Metas</p>
          <h1 className="text-xl font-bold leading-snug">Quantas atividades você quer concluir?</h1>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Período</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {PERIODOS_META.map((p) => (
              <button key={p} type="button" onClick={() => escolherPeriodo(p)} className={classeOpcao(periodo === p)}>
                {p} dias
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Atividades no período (máx. {periodo})
          </p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAlvo((atual) => Math.max(1, atual - 1))}
              disabled={alvo <= 1}
              aria-label="Diminuir meta"
              className={classeContador}
            >
              −
            </button>
            <span className="flex-1 text-center text-4xl font-extrabold text-[#4F46E5]">{alvo}</span>
            <button
              type="button"
              onClick={() => setAlvo((atual) => Math.min(periodo, atual + 1))}
              disabled={noTeto}
              aria-label="Aumentar meta"
              className={classeContador}
            >
              +
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Cada atividade aprovada conta como um dia de atividade, então a meta vai até {periodo} atividades em{' '}
            {periodo} dias.
            {noTeto
              ? ' Você está no teto deste período: escolha um período maior para ir além.'
              : ' Se concluir antes do prazo, dá para aumentar a meta.'}
          </p>
        </section>

        <button type="button" onClick={() => criarMeta(periodo, alvo)} className={classeBotaoPrincipal}>
          Começar meta
        </button>
      </>
    );
  }

  // ----- Meta em andamento -----

  // Só contam as postagens do usuário aprovadas depois do início da meta (id maior que o idBase)
  const concluidas = concluidasDaMeta(meta, postagens, usuario.id);
  const concluiu = concluidas >= meta.alvo;
  const progresso = Math.min(100, Math.round((concluidas / meta.alvo) * 100));
  const restantes = diasRestantes(meta);
  const prazoAberto = restantes > 0;
  const proxima = proximaMetrica(meta.periodoDias);
  const extras = Math.max(0, concluidas - meta.alvo);
  const espacoAlvo = meta.periodoDias - meta.alvo;
  const extraAplicado = Math.min(Math.max(1, extra), Math.max(1, espacoAlvo));

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Meta em andamento</p>
        <h1 className="text-xl font-bold leading-snug">
          {meta.alvo} atividade{meta.alvo > 1 ? 's' : ''} em {meta.periodoDias} dias
        </h1>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold">
            <FiTarget className="text-[#4F46E5]" /> Progresso
          </span>
          <span className="text-sm font-extrabold text-[#4F46E5]">
            {concluidas}/{meta.alvo}
          </span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: `${progresso}%` }} />
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <FiCalendar />
          {prazoAberto
            ? `${restantes} dia${restantes > 1 ? 's' : ''} restantes · termina em ${formatarDia(fimDaMeta(meta))}`
            : `Período encerrado em ${formatarDia(fimDaMeta(meta))}`}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Só atividades aprovadas pela moderação contam. Pontos de sequência acumulados:{' '}
          <strong className="text-[#16173A]">{pontosSequencia(concluidas)}</strong>.
        </p>
        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
          Demonstração: a meta e os pontos de sequência ficam só no simulador. A API ainda não credita esses pontos.
        </p>
      </section>

      {concluiu && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <FiAward className="text-emerald-600" /> Meta de {meta.periodoDias} dias concluída!
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {extras > 0
              ? `Você tem ${extras} atividade${extras > 1 ? 's' : ''} além da meta. Elas seguem pontuando na faixa atual (${pontosDoDiaMeta(concluidas)} pt/dia).`
              : 'Novas atividades continuam pontuando na faixa correspondente.'}
          </p>
        </section>
      )}

      {concluiu && proxima && !meta.upgradeRecusado && (
        <section className="rounded-2xl border border-[#4F46E5]/30 bg-[#4F46E5]/5 p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <FiArrowUpRight className="text-[#4F46E5]" /> Quer subir para a métrica de {proxima} dias?
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Seu progresso atual ({concluidas} atividade{concluidas > 1 ? 's' : ''}) é mantido.
          </p>
          <div className="mt-3 space-y-2">
            <button type="button" onClick={subirMetrica} className={classeBotaoPrincipal}>
              Subir para {proxima} dias
            </button>
            <button type="button" onClick={recusarUpgrade} className={classeBotao}>
              Manter métrica de {meta.periodoDias} dias
            </button>
          </div>
        </section>
      )}

      {concluiu && meta.upgradeRecusado && proxima && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
          Você optou por manter a métrica de {meta.periodoDias} dias.
          <button type="button" onClick={subirMetrica} className={`${classeBotao} mt-3`}>
            Mudei de ideia: subir para {proxima} dias
          </button>
        </section>
      )}

      {concluiu && prazoAberto && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-bold">Aumentar o alvo desta métrica</p>
          {espacoAlvo > 0 ? (
            <>
              <p className="mt-1 text-xs text-slate-500">
                O alvo pode ir até {meta.periodoDias} atividades (uma por dia).
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setExtra(extraAplicado - 1)}
                  disabled={extraAplicado <= 1}
                  aria-label="Diminuir acréscimo"
                  className={classeContador}
                >
                  −
                </button>
                <span className="flex-1 text-center text-2xl font-extrabold text-[#4F46E5]">+{extraAplicado}</span>
                <button
                  type="button"
                  onClick={() => setExtra(extraAplicado + 1)}
                  disabled={extraAplicado >= espacoAlvo}
                  aria-label="Aumentar acréscimo"
                  className={classeContador}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => aumentarMeta(meta.alvo + extraAplicado)}
                className={`${classeBotaoPrincipal} mt-3`}
              >
                Aumentar para {meta.alvo + extraAplicado} atividades
              </button>
            </>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              Você já está no teto de {meta.periodoDias} atividades deste período.
              {proxima && ` Para ir além, suba para a métrica de ${proxima} dias.`}
            </p>
          )}
        </section>
      )}

      <div className="space-y-2">
        <button type="button" onClick={() => irPara('nova-postagem')} className={classeBotao}>
          Registrar atividade
        </button>
        <button type="button" onClick={encerrarMeta} className={classeBotao}>
          Encerrar meta e definir outra
        </button>
      </div>
    </>
  );
}