import { useSimulador } from '../../../hooks/useSimulador';
import {
  moderadoresDemo,
  motivoImpedimentoRevisao,
  nomesStatusContestacao,
  reputacaoDe,
} from '../../../data/moderacao';

export default function TelaRevisoes() {
  const { usuario, contestacoes, reputacoes, abrirContestacao, irPara } = useSimulador();

  if (!usuario) return null;

  if (usuario.tipoPerfil !== 'MODERADOR') {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Revisão de contestações</p>
        <h1 className="text-xl font-bold leading-snug">A fila de contestações é exclusiva para moderadores.</h1>
      </div>
    );
  }

  const abertas = contestacoes.filter((c) => c.status === 'EM_REVISAO').sort((a, b) => b.id - a.id);

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Revisão de contestações</p>
        <h1 className="text-xl font-bold leading-snug">Segunda instância da moderação.</h1>
      </div>

      <p className="rounded-2xl border border-[#4F46E5]/30 bg-[#4F46E5]/10 p-3 text-xs">
        Cada contestação só pode ser revisada por um moderador com reputação maior que a do moderador original. Sua
        reputação atual: <strong className="text-[#4F46E5]">{reputacaoDe(usuario.id, reputacoes)}</strong>.
      </p>

      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
        Demonstração: contestações e reputação ficam só no front, nesta sessão do simulador.
      </p>

      <p className="text-sm text-slate-500">{abertas.length} contestação(ões) aguardando revisão.</p>

      <div className="space-y-3">
        {abertas.map((c) => {
          const impedimento = motivoImpedimentoRevisao(usuario, c, reputacoes);
          // Moderadores que poderiam revisar: não é o autor, não rejeitou e tem reputação maior
          const elegiveis = moderadoresDemo.filter(
            (m) =>
              m.idUsuario !== c.idUsuario &&
              m.idModerador !== c.idModeradorOriginal &&
              reputacaoDe(m.idUsuario, reputacoes) > c.reputacaoOriginal,
          ).length;

          return (
            <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#4F46E5]">Postagem #{c.idPostagem}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {nomesStatusContestacao[c.status]}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm">{c.motivo}</p>
              <p className="mt-2 text-xs text-slate-500">
                Rejeitada por Moderador #{c.idModeradorOriginal} (reputação {c.reputacaoOriginal}) · {elegiveis} revisor(es)
                elegível(is)
              </p>
              {impedimento ? (
                <p className="mt-2 text-xs text-slate-500">Você não pode revisar esta contestação: {impedimento}.</p>
              ) : (
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

        {abertas.length === 0 && (
          <p className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            Nenhuma contestação pendente. Fila de revisão em dia!
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => irPara('contestacoes')}
        className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer"
      >
        Ver histórico completo de contestações
      </button>
    </>
  );
}