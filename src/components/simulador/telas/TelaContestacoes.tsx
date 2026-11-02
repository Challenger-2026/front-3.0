import type { StatusContestacao } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { moderadoresDemo, motivoImpedimentoRevisao, nomesStatusContestacao } from '../../../data/moderacao';
import { formatarData } from '../../../utils/formatadores';

const coresStatus: Record<StatusContestacao, string> = {
  EM_REVISAO: 'bg-[#4F46E5]/10 text-[#4F46E5]',
  MANTIDA: 'bg-slate-100 text-slate-500',
  REVERTIDA: 'bg-emerald-50 text-emerald-700',
};

function Linha({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-xl bg-slate-100 px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wider text-slate-500">{titulo}</dt>
      <dd className="text-xs font-medium">{texto}</dd>
    </div>
  );
}

// O revisor é guardado pelo id de usuário; para mostrar, usa o id de moderador quando existir
const codigoDoRevisor = (idUsuario: number) =>
  moderadoresDemo.find((m) => m.idUsuario === idUsuario)?.idModerador ?? idUsuario;

export default function TelaContestacoes() {
  const { usuario, contestacoes, moderacoes, reputacoes, abrirContestacao, irPara } = useSimulador();

  if (!usuario) return null;

  // Moderador vê todas (auditoria); o autor vê só as próprias
  const moderador = usuario.tipoPerfil === 'MODERADOR';
  const lista = contestacoes
    .filter((c) => moderador || c.idUsuario === usuario.id)
    .sort((a, b) => b.id - a.id);

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Auditoria</p>
        <h1 className="text-xl font-bold leading-snug">Histórico completo das contestações.</h1>
      </div>

      {moderador && (
        <button
          type="button"
          onClick={() => irPara('revisoes')}
          className="text-left text-xs font-semibold text-[#4F46E5] underline cursor-pointer"
        >
          Ir para a fila de revisão
        </button>
      )}

      <div className="space-y-3">
        {lista.map((c) => {
          const justificativaOriginal = moderacoes.find((m) => m.idPostagem === c.idPostagem)?.justificativa ?? '—';
          const quemRejeitou = moderador
            ? `Moderador #${c.idModeradorOriginal} (reputação ${c.reputacaoOriginal})`
            : 'um moderador da Soul Up';
          const quemRevisou =
            moderador && c.idRevisor !== undefined
              ? `Moderador #${codigoDoRevisor(c.idRevisor)} (reputação ${c.reputacaoRevisor})`
              : 'um moderador da Soul Up';
          const podeRevisar = c.status === 'EM_REVISAO' && !motivoImpedimentoRevisao(usuario, c, reputacoes);

          return (
            <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#4F46E5]">Postagem #{c.idPostagem}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${coresStatus[c.status]}`}
                >
                  {nomesStatusContestacao[c.status]}
                </span>
              </div>

              <dl className="mt-3 space-y-2">
                <Linha titulo="Aberta em" texto={formatarData(c.abertaEm)} />
                <Linha titulo="Decisão original" texto={`Rejeitado por ${quemRejeitou} — ${justificativaOriginal}`} />
                <Linha titulo="Motivo da contestação" texto={c.motivo} />
                <Linha
                  titulo="Decisão final"
                  texto={
                    c.status === 'EM_REVISAO'
                      ? 'Aguardando revisor de reputação maior.'
                      : `${nomesStatusContestacao[c.status]} · Revisada por ${quemRevisou} em ${formatarData(c.decididaEm ?? '')} — ${c.parecer}`
                  }
                />
                {c.deltaReputacao !== undefined && (
                  <Linha
                    titulo="Reputação do moderador original"
                    texto={`${c.deltaReputacao > 0 ? '+' : ''}${c.deltaReputacao} pontos de reputação`}
                  />
                )}
              </dl>

              {podeRevisar && (
                <button
                  type="button"
                  onClick={() => abrirContestacao(c.id)}
                  className="mt-3 text-xs font-semibold text-[#4F46E5] underline cursor-pointer"
                >
                  Revisar agora
                </button>
              )}
            </article>
          );
        })}

        {lista.length === 0 && (
          <p className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            Nenhuma contestação registrada até agora.
          </p>
        )}
      </div>
    </>
  );
}