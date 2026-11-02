import { useState } from 'react';
import type { IdProcesso } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import {
  categorias,
  aplicarTetoDiario,
  TETO_DIARIO_PONTOS,
  REDUCAO_PROGRESSIVA,
  REDUCAO_MINIMA,
} from '../../../data/categorias';
import { FAIXAS_META, PERIODOS_META, pontosSequencia } from '../../../data/metas';
import { PERCENTUAL_BONUS_MODERADOR, bonusDoModerador } from '../../../data/moderacao';
import { REFERENCIAS_CO2, processosAutomaticos } from '../../../data/parametros';
import { formatarPontos } from '../../../utils/formatadores';

const porcentagem = (valor: number) => `${Math.round(valor * 100)}%`;

export default function TelaParametros() {
  const { usuario, simularFechamentoLiga, simularEntregaDistintivo, irPara } = useSimulador();
  // Último processo simulado (mostra o link para a notificação)
  const [executado, setExecutado] = useState<IdProcesso | null>(null);

  if (!usuario) return null;

  // Só a liga e o distintivo têm "Simular execução agora"
  const simulacoes: Partial<Record<IdProcesso, () => void>> = {
    liga: simularFechamentoLiga,
    distintivo: simularEntregaDistintivo,
  };

  // Simulação do teto com a categoria de maior peso (Impacto Crítico)
  const critico = categorias[0];
  const simulacaoTeto = [0, TETO_DIARIO_PONTOS - 2, TETO_DIARIO_PONTOS, TETO_DIARIO_PONTOS * 2].map((ganhos) => ({
    ganhos,
    ...aplicarTetoDiario(critico.pontosAcao, ganhos),
  }));

  // Sequência: as três metas e um exemplo com 2 dias além da meta de 7
  const simulacaoSequencia = [
    ...PERIODOS_META.map((dias) => ({ dias, rotulo: `Meta de ${dias} dias cumprida` })),
    { dias: 9, rotulo: 'Meta de 7 dias + 2 dias a mais (7×1 + 2×2)' },
  ];

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Parâmetros de pontuação</p>
        <h1 className="text-xl font-bold leading-snug">Teto diário com redução progressiva.</h1>
      </div>

      <p className="rounded-2xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-3 text-xs">
        O teto nunca bloqueia publicações: acima dele a atividade continua pontuando, com um percentual menor do valor
        normal da categoria.
      </p>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
        Demonstração: a API grava o ptGerado cheio. Teto, sequência, CO₂ e Temporizador ficam só no simulador.
      </p>

      <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Parâmetros do sistema</h2>
        <ul className="space-y-2 text-xs">
          <li className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
            <span className="text-slate-500">Teto diário de pontos por usuário · soma de pontos liberados no mesmo dia</span>
            <strong className="shrink-0 text-[#4F46E5]">{formatarPontos(TETO_DIARIO_PONTOS)} pts</strong>
          </li>
          <li className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
            <span className="text-slate-500">
              Redução progressiva · % do valor normal pago no primeiro bloco acima do teto
            </span>
            <strong className="shrink-0 text-[#4F46E5]">{porcentagem(REDUCAO_PROGRESSIVA)}</strong>
          </li>
          <li className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
            <span className="text-slate-500">
              Piso da redução · % mínimo garantido, toda atividade válida gera algum ponto
            </span>
            <strong className="shrink-0 text-[#4F46E5]">{porcentagem(REDUCAO_MINIMA)}</strong>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Simulação · {critico.nome}</h2>
        <ul className="mt-3 space-y-2 text-xs">
          {simulacaoTeto.map((s) => (
            <li key={s.ganhos} className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
              <span className="text-slate-500">Já ganhou {formatarPontos(s.ganhos)} pts hoje</span>
              <strong className="text-right text-[#4F46E5]">
                {formatarPontos(s.pontos)} pts {s.fator < 1 && `(${porcentagem(s.fator)} do normal no excedente)`}
              </strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Simulação · pontos de sequência</h2>
        <ul className="mt-3 space-y-2 text-xs">
          {simulacaoSequencia.map((s) => (
            <li key={s.rotulo} className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
              <span className="text-slate-500">{s.rotulo}</span>
              <strong className="shrink-0 text-[#4F46E5]">{formatarPontos(pontosSequencia(s.dias))} pts</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">CO₂ evitado por ação</h2>
        <ul className="mt-3 space-y-2 text-xs">
          {categorias.map((c) => (
            <li key={c.id} className="rounded-xl bg-slate-100 px-3 py-2">
              <p className="flex items-center justify-between gap-3">
                <strong>{c.nome}</strong>
                <strong className="text-right text-[#4F46E5]">{formatarPontos(c.co2Kg)} kg CO₂e por ação</strong>
              </p>
              <p className="mt-1">Ação de referência: {REFERENCIAS_CO2[c.id].acao}.</p>
              <p className="text-slate-500">Premissa: {REFERENCIAS_CO2[c.id].premissa}</p>
              <p className="text-[11px] italic text-slate-500">Fonte: {REFERENCIAS_CO2[c.id].fonte}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-slate-500">
          Valores de referência por ação típica de cada categoria. Na versão final, cada tipo de ação terá seu próprio
          fator, seguindo a metodologia do GHG Protocol.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Processos automáticos</h2>
        <p className="mt-1 text-[11px] text-slate-500">Executados pelo Temporizador da plataforma. Somente leitura.</p>
        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
          Demonstração: a API não tem agendador. "Simular execução agora" muda a liga ou os distintivos só no
          simulador e gera uma notificação.
        </p>
        <ul className="mt-3 space-y-2 text-xs">
          {processosAutomaticos().map((p) => {
            const simular = simulacoes[p.id];
            return (
              <li key={p.id} className="rounded-xl bg-slate-100 px-3 py-2">
                <p className="font-bold">{p.nome}</p>
                <p className="text-slate-500">{p.descricao}</p>
                <p className="mt-1 flex justify-between gap-3 text-slate-500">
                  <span>{p.frequencia}</span>
                  <strong className="text-[#4F46E5]">Próxima: {p.proximaExecucao.toLocaleDateString('pt-BR')}</strong>
                </p>
                {simular && (
                  <button
                    type="button"
                    onClick={() => {
                      simular();
                      setExecutado(p.id);
                    }}
                    className="mt-2 rounded-full bg-[#4F46E5] px-3 py-1.5 text-[11px] font-bold text-white cursor-pointer"
                  >
                    Simular execução agora
                  </button>
                )}
                {executado === p.id && (
                  <p role="status" className="mt-1 text-[11px] font-semibold">
                    Executado.{' '}
                    <button
                      type="button"
                      onClick={() => irPara('notificacoes')}
                      className="text-[#4F46E5] underline cursor-pointer"
                    >
                      Ver notificação
                    </button>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Pesos vigentes</h2>
        <p className="mt-1 text-[11px] text-slate-500">
          Pontos por atividade e bônus de quem modera: os mesmos da API Java (PostagemService e ModeracaoService).
        </p>
        <ul className="mt-3 space-y-2 text-xs">
          {categorias.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
              <span>{c.nome}</span>
              <strong className="shrink-0 text-[#4F46E5]">{formatarPontos(c.pontosAcao)} pts por atividade</strong>
            </li>
          ))}
          {categorias.map((c) => (
            <li key={`${c.id}-peso`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
              <span className="text-slate-500">Peso diário · {c.nome}</span>
              <strong className="shrink-0 text-[#4F46E5]">
                {formatarPontos(c.pontosAcao / 10)} (×10 = {formatarPontos(c.pontosAcao)})
              </strong>
            </li>
          ))}
          {FAIXAS_META.map((f) => (
            <li key={f.ate} className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
              <span>
                Sequência · dias {f.de} a {f.ate}
              </span>
              <strong className="shrink-0 text-[#4F46E5]">
                {f.pontosPorDia} {f.pontosPorDia > 1 ? 'pts' : 'pt'}/dia
              </strong>
            </li>
          ))}
          <li className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-3 py-2">
            <span>Bônus de quem modera · {porcentagem(PERCENTUAL_BONUS_MODERADOR)} dos pontos da postagem</span>
            <strong className="shrink-0 text-right text-[#4F46E5]">
              {categorias.map((c) => formatarPontos(bonusDoModerador(c.pontosAcao))).join(' / ')} pts
            </strong>
          </li>
        </ul>
      </section>
    </>
  );
}