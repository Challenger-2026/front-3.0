import { useState } from 'react';
import { useSimulador } from '../../../hooks/useSimulador';
import {
  categorias,
  buscarCategoriaPorPontos,
  aplicarTetoDiario,
  TETO_DIARIO_PONTOS,
  REDUCAO_PROGRESSIVA,
} from '../../../data/categorias';
import { FAIXAS_META, pontosSequencia } from '../../../data/metas';
import { formatarPontos } from '../../../utils/formatadores';
import { DISTINTIVOS_CONQUISTADOS_DEMO, FONTE_DISTINTIVOS } from '../../../data/liga';

export default function TelaPontos() {
  const { usuario, postagens, irPara } = useSimulador();

  // Demonstração do teto: quantos pontos o usuário "já ganhou hoje"
  const [ganhosHoje, setGanhosHoje] = useState(0);

  if (!usuario) return null;

  const minhas = postagens.filter((p) => p.idUsuario === usuario.id).sort((a, b) => b.id - a.id);
  const aprovadas = minhas.filter((p) => p.stValidacao === 'APROVADO');
  const pendentes = minhas.filter((p) => p.stValidacao === 'PENDENTE');

  // CO₂ evitado = soma do fator de cada ação aprovada
  const co2Evitado = aprovadas.reduce((total, p) => total + (buscarCategoriaPorPontos(p.ptGerado)?.co2Kg ?? 0), 0);
  const aLiberar = pendentes.reduce((total, p) => total + p.ptGerado, 0);

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Minha pontuação</p>
        <h1 className="text-xl font-bold leading-snug">Seu esforço, traduzido em impacto real.</h1>
      </div>

      {/* Saldo */}
      <section className="rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#8B3CF0] p-5 text-white shadow-sm">
        <p className="text-[10px] uppercase tracking-wider text-white/70">Saldo</p>
        <p className="text-3xl font-extrabold">{formatarPontos(usuario.sdPonto)} pts</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-white/15 py-2">
            <p className="text-sm font-extrabold">{formatarPontos(co2Evitado)} kg</p>
            <p className="text-[10px] uppercase tracking-wider text-white/70">CO₂ evitado</p>
          </div>
          <div className="rounded-xl bg-white/15 py-2">
            <p className="text-sm font-extrabold">{formatarPontos(aLiberar)} pts</p>
            <p className="text-[10px] uppercase tracking-wider text-white/70">A liberar</p>
          </div>
        </div>
      </section>

      {/* Regras de pontuação */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Como seus pontos são calculados</h2>
        <ul className="mt-3 space-y-2">
          {categorias.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-100 px-3 py-2">
              <span className="text-xs font-semibold">{c.nome}</span>
              <span className="text-right text-xs">
                <strong className="text-[#4F46E5]">{formatarPontos(c.pontosAcao)} pts</strong>
                <span className="block text-[10px] text-slate-500">{formatarPontos(c.co2Kg)} kg de CO₂</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Só ações aprovadas pela moderação geram pontos. O valor de cada tipo é definido pela API.
        </p>

        <div className="mt-3 rounded-xl bg-slate-100 p-3">
          <p className="text-xs font-semibold">Sequência (metas de 7, 15 e 30 dias)</p>
          <ul className="mt-1 space-y-0.5 text-[11px] text-slate-500">
            {FAIXAS_META.map((f) => (
              <li key={f.ate}>
                Dias {f.de} a {f.ate}: {f.pontosPorDia} pt{f.pontosPorDia > 1 ? 's' : ''} por dia
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px]">
            Exemplo: meta de 7 dias cumprida com 2 dias a mais = 7×1 + 2×2 ={' '}
            <strong className="text-[#4F46E5]">{pontosSequencia(9)} pontos</strong>.
          </p>
        </div>
      </section>

      {/* Teto diário: demonstração */}
      <section className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Teto diário de {TETO_DIARIO_PONTOS} pts</h2>
        <p className="mt-1 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
          Demonstração: a API ainda paga o valor cheio. Mova a barra para simular quanto você já ganhou hoje.
        </p>

        <label htmlFor="ganhos-hoje" className="mt-3 block text-xs font-semibold">
          Já ganhos hoje: {formatarPontos(ganhosHoje)} pts
        </label>
        <input
          id="ganhos-hoje"
          type="range"
          min={0}
          max={TETO_DIARIO_PONTOS * 3}
          step={0.1}
          value={ganhosHoje}
          onChange={(e) => setGanhosHoje(Number(e.target.value))}
          className="mt-1 w-full accent-[#4F46E5]"
        />

        <ul className="mt-2 space-y-1.5">
          {categorias.map((c) => {
            const calculo = aplicarTetoDiario(c.pontosAcao, ganhosHoje);
            return (
              <li key={c.id} className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-xs">
                <span className="font-semibold">{c.nome}</span>
                <span>
                  {calculo.fator < 1 && (
                    <span className="mr-1 text-slate-400 line-through">{formatarPontos(c.pontosAcao)}</span>
                  )}
                  <strong className="text-[#4F46E5]">{formatarPontos(calculo.pontos)} pts</strong>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-[11px] text-slate-500">
          Depois do teto você continua pontuando, com {Math.round(REDUCAO_PROGRESSIVA * 100)}% do valor normal no
          primeiro bloco acima dele, e menos a cada novo bloco.
        </p>
      </section>

      {/* Distintivos da fauna: demonstração */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Distintivos da fauna</h2>
        <div className="grid grid-cols-3 gap-3">
          {DISTINTIVOS_CONQUISTADOS_DEMO.map((d) => (
            <div key={d.mes} className="rounded-3xl border border-slate-200 bg-slate-100 p-3 text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#4F46E5]/10 text-xl">
                {d.emoji}
              </span>
              <p className="mt-2 text-[11px] font-bold">{d.animal}</p>
              <p className="text-[10px] text-slate-500">{d.mes}</p>
              <p className="text-[10px] font-semibold">{d.status}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500">Fonte do status: {FONTE_DISTINTIVOS}</p>
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
          Demonstração: a API não tem distintivos. Os conquistados são fixos (junho a setembro, como no protótipo).
        </p>
      </section>

      {/* Extrato */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Extrato</h2>
        <ul className="mt-3 space-y-2">
          {[...aprovadas, ...pendentes]
            .sort((a, b) => b.id - a.id)
            .map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0"
              >
                <span className="line-clamp-1 text-xs text-slate-500">{p.ctTexto}</span>
                {p.stValidacao === 'APROVADO' ? (
                  <span className="shrink-0 text-xs font-bold text-emerald-600">+{formatarPontos(p.ptGerado)}</span>
                ) : (
                  <span className="shrink-0 text-xs font-semibold text-amber-600">
                    {formatarPontos(p.ptGerado)} a liberar
                  </span>
                )}
              </li>
            ))}
          {aprovadas.length + pendentes.length === 0 && (
            <li className="text-xs text-slate-500">Nenhuma ação aprovada ou pendente ainda.</li>
          )}
        </ul>
      </section>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => irPara('metas')}
          className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer"
        >
          Minha meta de atividades
        </button>
        <button
          type="button"
          onClick={() => irPara('carteira')}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Trocar pontos por benefícios
        </button>
      </div>
    </>
  );
}