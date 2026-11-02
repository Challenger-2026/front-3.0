import { useState } from 'react';
import { FiBriefcase } from 'react-icons/fi';
import { FaHandshake, FaLeaf } from 'react-icons/fa';
import type { Resgate } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { buscarCategoriaPorPontos } from '../../../data/categorias';
import { beneficios, buscarBeneficio, parceiros } from '../../../data/beneficios';
import { formatarData, formatarPontos } from '../../../utils/formatadores';
import CartaoSaldo from '../CartaoSaldo';

const classeBotao =
  'mt-3 w-full rounded-full px-4 py-2.5 text-xs font-bold cursor-pointer disabled:cursor-not-allowed';

export default function TelaBeneficios() {
  const { usuario, postagens, saldoDisponivel, resgates, resgatar } = useSimulador();

  // Benefício aguardando confirmação e resgate recém-feito
  const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
  const [novo, setNovo] = useState<Resgate | null>(null);

  if (!usuario) return null;

  // CO₂ evitado = soma do fator de cada ação aprovada
  const co2Evitado = postagens
    .filter((p) => p.idUsuario === usuario.id && p.stValidacao === 'APROVADO')
    .reduce((total, p) => total + (buscarCategoriaPorPontos(p.ptGerado)?.co2Kg ?? 0), 0);

  const escolher = (id: number) => {
    setIdSelecionado(id);
    setNovo(null);
  };

  const confirmar = (id: number) => {
    const resgate = resgatar(id);
    if (resgate) setNovo(resgate);
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Benefícios</p>
        <h1 className="text-xl font-bold leading-snug">Seu impacto também volta pra você.</h1>
      </div>

      <CartaoSaldo pontos={saldoDisponivel} co2={co2Evitado} />

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
        Demonstração: a API não tem benefícios nem resgates. O resgate fica só no simulador e desconta do saldo
        mostrado aqui.
      </p>

      {/* Catálogo por parceiro: ONGs primeiro */}
      {parceiros.map((parceiro) => {
        const doParceiro = beneficios.filter((b) => b.parceiro === parceiro);
        const ong = doParceiro.some((b) => b.ong);
        return (
          <section key={parceiro} className="space-y-3">
            <h2 className="flex flex-wrap items-center gap-2 pt-1 text-sm font-bold">
              <FiBriefcase size={16} className="text-[#4F46E5]" /> {parceiro}
              {ong && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold">
                  <FaHandshake size={12} /> Parceria proposta
                </span>
              )}
            </h2>

            {doParceiro.map((b) => {
              const falta = b.custo - saldoDisponivel;
              const selecionado = idSelecionado === b.id;
              const resgatadoAgora = novo?.idBeneficio === b.id;
              return (
                <article key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#4F46E5]">
                        {b.tipo}
                      </span>
                      <h3 className="mt-2 text-sm font-bold">{b.nome}</h3>
                      <p className="text-xs text-slate-500">
                        Oferecido por {b.parceiro} · {b.area}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-sm font-extrabold">
                      {formatarPontos(b.custo)}
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5]">
                        <FaLeaf size={12} />
                      </span>
                    </span>
                  </div>

                  {resgatadoAgora && novo ? (
                    // Resgate confirmado: código de acompanhamento
                    <div className="mt-3 rounded-2xl bg-slate-100 p-4 text-center">
                      <p className="text-sm font-bold">Resgate confirmado. Ótimo trabalho!</p>
                      <p className="mt-1 text-xs text-slate-500">Guarde seu código de acompanhamento:</p>
                      <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-lg font-extrabold tracking-widest text-[#4F46E5]">
                        {novo.codigo}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-amber-600">Status: {novo.status}</p>
                    </div>
                  ) : selecionado ? (
                    // Confirmação antes de descontar os pontos
                    <div className="mt-3 rounded-2xl border border-[#4F46E5]/30 bg-slate-100 p-4">
                      <p className="text-sm font-bold">Confirmar resgate</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatarPontos(b.custo)} pts serão descontados do seu saldo.
                      </p>
                      <button
                        type="button"
                        onClick={() => confirmar(b.id)}
                        className={`${classeBotao} bg-[#4F46E5] text-white`}
                      >
                        Confirmar resgate
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdSelecionado(null)}
                        className={`${classeBotao} mt-2 border border-slate-200 bg-white`}
                      >
                        Agora não
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={falta > 0}
                      onClick={() => escolher(b.id)}
                      className={`${classeBotao} bg-[#4F46E5] text-white disabled:bg-slate-100 disabled:text-slate-500`}
                    >
                      {falta > 0 ? `Faltam ${formatarPontos(falta)} pts para este benefício` : 'Resgatar ›'}
                    </button>
                  )}
                </article>
              );
            })}
          </section>
        );
      })}

      {/* Histórico */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold">Meus resgates</h2>
        <ul className="mt-3 space-y-2">
          {resgates.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0"
            >
              <div>
                <p className="text-xs font-semibold">{buscarBeneficio(r.idBeneficio)?.nome ?? 'Benefício'}</p>
                <p className="text-[11px] tracking-wider text-slate-500">
                  {r.codigo} · {formatarData(r.data)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                  r.status === 'Concluído' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {r.status}
              </span>
            </li>
          ))}
          {resgates.length === 0 && <li className="text-xs text-slate-500">Nenhum resgate ainda.</li>}
        </ul>
      </section>
    </>
  );
}