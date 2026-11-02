import type { StatusValidacao } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { buscarCategoriaPorPontos } from '../../../data/categorias';
import { formatarPontos } from '../../../utils/formatadores';
import { PRAZO_CONTESTACAO_DIAS, nomesStatusContestacao } from '../../../data/moderacao';

const coresStatus: Record<StatusValidacao, string> = {
  PENDENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  APROVADO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJEITADO: 'bg-red-50 text-red-600 border-red-200',
};

const nomesStatus: Record<StatusValidacao, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
};

const titulos: Record<StatusValidacao, string> = {
  PENDENTE: 'Sua ação está em análise. Logo teremos novidades.',
  APROVADO: 'Ótimo trabalho! Sua ação foi aprovada.',
  REJEITADO: 'Quase lá! Dá para ajustar e tentar de novo.',
};

const rotulosPontos: Record<StatusValidacao, string> = {
  PENDENTE: 'Pontos a liberar',
  APROVADO: 'Pontos gerados',
  REJEITADO: 'Pontos não liberados',
};

export default function TelaFeedback() {
  const { usuario, postagens, comunidades, moderacoes, contestacoes, idPostagemAberta, irPara } = useSimulador();

  const postagem = postagens.find((p) => p.id === idPostagemAberta);

  if (!usuario) return null;

  if (!postagem) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Feedback</p>
        <h1 className="text-xl font-bold leading-snug">Não encontramos essa ação.</h1>
      </div>
    );
  }

  // Cada postagem tem no máximo uma moderação (id_postagem é UNIQUE na T_LGT_MODERACAO)
  const moderacao = moderacoes.find((m) => m.idPostagem === postagem.id);
  const categoria = buscarCategoriaPorPontos(postagem.ptGerado);
  const comunidade = comunidades.find((c) => c.id === postagem.idComunidade);
  const podeEditar = postagem.stValidacao === 'PENDENTE' && postagem.idUsuario === usuario.id;

    // Contestação (demonstração): só o autor, só rejeitada e uma por postagem
  const contestacao = contestacoes.find((c) => c.idPostagem === postagem.id);
  const podeContestar =
    postagem.stValidacao === 'REJEITADO' && postagem.idUsuario === usuario.id && moderacao !== undefined && !contestacao;

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Feedback da moderação</p>
        <h1 className="text-xl font-bold leading-snug">{titulos[postagem.stValidacao]}</h1>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500">{comunidade?.nmComunidade}</span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${coresStatus[postagem.stValidacao]}`}
          >
            {nomesStatus[postagem.stValidacao]}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed">{postagem.ctTexto}</p>

        {postagem.ctUrl && (
          <a
            href={postagem.ctUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block break-all text-xs font-semibold text-[#4F46E5] underline"
          >
            Ver comprovação
          </a>
        )}

        <div className="mt-4 rounded-2xl bg-slate-100 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Justificativa da moderação</p>
          <p className="mt-1 text-sm">{moderacao?.justificativa ?? 'Aguardando a análise de um moderador da Soul Up.'}</p>
        </div>
        {moderacao && (
          <p className="mt-2 text-xs text-slate-500">Analisada por um moderador da Soul Up, sem ver quem publicou.</p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-[#4F46E5] p-4 text-white">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70">{rotulosPontos[postagem.stValidacao]}</p>
            <p className={`text-2xl font-extrabold ${postagem.stValidacao === 'REJEITADO' ? 'line-through opacity-70' : ''}`}>
              {formatarPontos(postagem.ptGerado)} pts
            </p>
          </div>
          {categoria && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4F46E5]">{categoria.nome}</span>
          )}
        </div>
      </article>

      <div className="space-y-2">
        {podeContestar && (
          <>
            <p className="rounded-2xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-3 text-xs">
              Não concorda com a rejeição? Você pode contestar em até {PRAZO_CONTESTACAO_DIAS} dias. Um moderador com
              reputação maior fará a revisão.
            </p>
            <button
              type="button"
              onClick={() => irPara('contestacao')}
              className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
            >
              Contestar rejeição
            </button>
          </>
        )}
        {contestacao && (
          <p className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-500">
            Contestação registrada: <strong className="text-[#16173A]">{nomesStatusContestacao[contestacao.status]}</strong>.{' '}
            <button
              type="button"
              onClick={() => irPara('contestacoes')}
              className="font-semibold text-[#4F46E5] underline cursor-pointer"
            >
              Ver histórico
            </button>
          </p>
        )}
        {podeEditar && (
          <button
            type="button"
            onClick={() => irPara('editar-postagem')}
            className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer"
          >
            Editar esta postagem
          </button>
        )}
        <button
          type="button"
          onClick={() => irPara('pontos')}
          className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer"
        >
          Ver minha pontuação
        </button>
        <button
          type="button"
          onClick={() => irPara('nova-postagem')}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Registrar outra ação
        </button>
      </div>
    </>
  );
}