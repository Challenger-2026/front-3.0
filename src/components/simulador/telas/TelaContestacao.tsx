import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useSimulador } from '../../../hooks/useSimulador';
import { PRAZO_CONTESTACAO_DIAS } from '../../../data/moderacao';
import { regrasMotivoContestacao } from '../../../utils/validacoes';

type FormContestacao = { motivo: string };

const classeBotao = 'w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer';
const classeBotaoSecundario = 'w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer';

export default function TelaContestacao() {
  const { usuario, postagens, moderacoes, contestacoes, idPostagemAberta, contestar, irPara, voltar } = useSimulador();
  const [enviada, setEnviada] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormContestacao>({ defaultValues: { motivo: '' } });

  const postagem = postagens.find((p) => p.id === idPostagemAberta);

  if (!usuario) return null;

  if (!postagem) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Contestação</p>
        <h1 className="text-xl font-bold leading-snug">Postagem não encontrada.</h1>
      </div>
    );
  }

  // ----- Depois de enviar -----
  if (enviada) {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Contestação enviada</p>
          <h1 className="text-xl font-bold leading-snug">Sua contestação está em revisão.</h1>
        </div>
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          Um moderador com reputação maior que a de quem rejeitou vai analisar o seu pedido. Se a rejeição for
          revertida, os pontos da ação entram no seu saldo.
        </p>
        <div className="space-y-2">
          <button type="button" onClick={() => irPara('contestacoes')} className={classeBotao}>
            Ver histórico de contestações
          </button>
          <button type="button" onClick={voltar} className={classeBotaoSecundario}>
            Voltar para o feedback
          </button>
        </div>
      </>
    );
  }

  // Cada postagem tem no máximo uma moderação (id_postagem é UNIQUE na T_LGT_MODERACAO)
  const moderacao = moderacoes.find((m) => m.idPostagem === postagem.id);
  const jaContestada = contestacoes.some((c) => c.idPostagem === postagem.id);
  const propria = postagem.idUsuario === usuario.id;
  const habilitado = postagem.stValidacao === 'REJEITADO' && propria && !jaContestada && moderacao !== undefined;

  const motivoBloqueio = jaContestada
    ? 'Esta postagem já possui uma contestação registrada.'
    : postagem.stValidacao !== 'REJEITADO'
      ? 'Só é possível contestar postagens rejeitadas.'
      : !propria
        ? 'Apenas o autor da postagem pode contestar a decisão.'
        : 'A decisão da moderação desta postagem não foi encontrada.';

  const enviar: SubmitHandler<FormContestacao> = (dados) => {
    contestar(postagem.id, dados.motivo.trim());
    setEnviada(true);
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Contestação</p>
        <h1 className="text-xl font-bold leading-snug">Discorda da rejeição? Peça uma nova análise.</h1>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500">Decisão original</span>
          <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
            {postagem.stValidacao === 'REJEITADO' ? 'Rejeitado' : postagem.stValidacao === 'APROVADO' ? 'Aprovado' : 'Pendente'}
          </span>
        </div>
        <p className="mt-3 text-sm">{postagem.ctTexto}</p>
        <div className="mt-3 rounded-2xl bg-slate-100 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Justificativa do moderador</p>
          <p className="mt-1 text-sm">{moderacao?.justificativa ?? '—'}</p>
          <p className="mt-2 text-xs text-slate-500">Analisada por um moderador da Soul Up</p>
        </div>
      </article>

      {!habilitado ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">{motivoBloqueio}</p>
      ) : (
        <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-3">
          <p className="rounded-2xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-3 text-xs">
            Prazo de <strong className="text-[#4F46E5]">{PRAZO_CONTESTACAO_DIAS} dias</strong> após a decisão. A revisão
            será feita por um moderador com reputação maior que a do moderador original.
          </p>

          <div>
            <label htmlFor="contestacao-motivo" className="mb-1 block text-xs font-bold">
              Motivo da contestação
            </label>
            <textarea
              id="contestacao-motivo"
              rows={5}
              placeholder="Ex.: A foto do mutirão estava anexada e comprova a atividade."
              aria-invalid={errors.motivo ? 'true' : 'false'}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]"
              {...register('motivo', regrasMotivoContestacao)}
            />
            {errors.motivo ? (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.motivo.message}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-500">Traga evidências ou detalhes que não foram considerados.</p>
            )}
          </div>

          <button type="submit" className={classeBotao}>
            Enviar contestação
          </button>
        </form>
      )}

      <button type="button" onClick={() => irPara('contestacoes')} className={classeBotaoSecundario}>
        Ver histórico de contestações
      </button>
    </>
  );
}