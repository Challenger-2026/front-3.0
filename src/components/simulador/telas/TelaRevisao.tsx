import { useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { DecisaoRevisao } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { buscarCategoriaPorPontos } from '../../../data/categorias';
import {
  BONUS_REPUTACAO,
  PENALIDADE_REPUTACAO,
  motivoImpedimentoRevisao,
  moderadoresDemo,
  nomesStatusContestacao,
  reputacaoDe,
} from '../../../data/moderacao';
import { formatarPontos } from '../../../utils/formatadores';
import { regrasParecer } from '../../../utils/validacoes';

type FormRevisao = {
  decisao: DecisaoRevisao;
  parecer: string;
};

const classeDecisao = (ativo: boolean) =>
  `block cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-bold ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

const classeBotao = 'w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer';
const classeBotaoSecundario = 'w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer';

function Bloco({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-xl bg-slate-100 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{titulo}</p>
      <p className="text-xs font-medium">{texto}</p>
    </div>
  );
}

export default function TelaRevisao() {
  const {
    usuario,
    contestacoes,
    postagens,
    moderacoes,
    reputacoes,
    idContestacaoAberta,
    revisarContestacao,
    irPara,
    voltar,
  } = useSimulador();
  const [concluida, setConcluida] = useState<DecisaoRevisao | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormRevisao>({ defaultValues: { parecer: '' } });

  const decisao = useWatch({ control, name: 'decisao' });

  const contestacao = contestacoes.find((c) => c.id === idContestacaoAberta);
  const postagem = postagens.find((p) => p.id === contestacao?.idPostagem);

  if (!usuario) return null;

  if (!contestacao || !postagem) {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Revisão</p>
          <h1 className="text-xl font-bold leading-snug">Contestação não encontrada.</h1>
        </div>
        <button type="button" onClick={voltar} className={classeBotaoSecundario}>
          Voltar
        </button>
      </>
    );
  }

  // ----- Depois de enviar -----
  if (concluida) {
    const delta = concluida === 'MANTIDA' ? `+${BONUS_REPUTACAO}` : `−${PENALIDADE_REPUTACAO}`;
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Revisão concluída</p>
          <h1 className="text-xl font-bold leading-snug">{nomesStatusContestacao[concluida]}.</h1>
        </div>
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          A decisão foi registrada no histórico. Reputação do Moderador #{contestacao.idModeradorOriginal}:{' '}
          <strong className="text-[#4F46E5]">{delta} pontos</strong>.
        </p>
        <div className="space-y-2">
          <button type="button" onClick={() => irPara('contestacoes')} className={classeBotao}>
            Ver histórico de contestações
          </button>
          <button type="button" onClick={voltar} className={classeBotaoSecundario}>
            Voltar para a fila de contestações
          </button>
        </div>
      </>
    );
  }

  const impedimento = motivoImpedimentoRevisao(usuario, contestacao, reputacoes);
  if (impedimento && contestacao.status === 'EM_REVISAO') {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Revisão</p>
          <h1 className="text-xl font-bold leading-snug">Você não pode revisar esta contestação.</h1>
        </div>
        <p className="text-sm text-slate-500">Motivo: {impedimento}.</p>
        <button type="button" onClick={voltar} className={classeBotaoSecundario}>
          Voltar para a fila
        </button>
      </>
    );
  }

  const justificativaOriginal = moderacoes.find((m) => m.idPostagem === postagem.id)?.justificativa ?? '—';
  const categoria = buscarCategoriaPorPontos(postagem.ptGerado);
  const meuCodigo = moderadoresDemo.find((m) => m.idUsuario === usuario.id)?.idModerador ?? usuario.id;

  const enviar: SubmitHandler<FormRevisao> = (dados) => {
    revisarContestacao(contestacao.id, dados.decisao, dados.parecer.trim());
    setConcluida(dados.decisao);
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Revisão de contestação</p>
        <h1 className="text-xl font-bold leading-snug">Manter ou reverter a rejeição.</h1>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold text-[#4F46E5]">Postagem #{postagem.id}</p>
        <p className="mt-2 text-sm">{postagem.ctTexto}</p>
        <div className="mt-3 space-y-2">
          <Bloco titulo="Decisão original" texto={`Rejeitado — ${justificativaOriginal}`} />
          <Bloco
            titulo="Moderador original"
            texto={`Moderador #${contestacao.idModeradorOriginal} · reputação ${contestacao.reputacaoOriginal}`}
          />
          <Bloco titulo="Motivo da contestação" texto={contestacao.motivo} />
          <Bloco
            titulo="Tipo de impacto"
            texto={`${categoria?.nome ?? 'Categoria não identificada'} · ${formatarPontos(postagem.ptGerado)} pts se revertida`}
          />
        </div>
      </article>

      {contestacao.status !== 'EM_REVISAO' ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Esta contestação já foi concluída: <strong className="text-[#16173A]">{nomesStatusContestacao[contestacao.status]}</strong>.
        </p>
      ) : (
        <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-4">
          <p className="rounded-2xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-3 text-xs">
            Você revisará como <strong className="text-[#4F46E5]">Moderador #{meuCodigo}</strong> (reputação{' '}
            {reputacaoDe(usuario.id, reputacoes)}). Autor oculto para garantir uma avaliação imparcial.
          </p>

          <fieldset>
            <div className="grid grid-cols-2 gap-3">
              {(['MANTIDA', 'REVERTIDA'] as const).map((valor) => (
                <label key={valor} className={classeDecisao(decisao === valor)}>
                  <input
                    type="radio"
                    value={valor}
                    className="sr-only"
                    {...register('decisao', { required: 'Escolha manter ou reverter a rejeição.' })}
                  />
                  {valor === 'MANTIDA' ? 'Manter rejeição' : 'Reverter e aprovar'}
                </label>
              ))}
            </div>
            {errors.decisao && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.decisao.message}
              </p>
            )}
          </fieldset>

          <div>
            <label htmlFor="revisao-parecer" className="mb-1 block text-xs font-bold">
              Parecer da revisão (obrigatório)
            </label>
            <textarea
              id="revisao-parecer"
              rows={4}
              placeholder="Explique o que sustenta a decisão final."
              aria-invalid={errors.parecer ? 'true' : 'false'}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]"
              {...register('parecer', regrasParecer)}
            />
            {errors.parecer ? (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.parecer.message}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-500">Fica registrado no histórico de auditoria.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            Impacto na reputação do <strong>Moderador #{contestacao.idModeradorOriginal}</strong>:{' '}
            {decisao === 'REVERTIDA' ? (
              <strong className="text-red-600">−{PENALIDADE_REPUTACAO} pontos de reputação</strong>
            ) : (
              <strong className="text-[#4F46E5]">+{BONUS_REPUTACAO} pontos de reputação</strong>
            )}
            <span className="block text-xs text-slate-500">
              Rejeição correta gera bônus; rejeição revertida gera penalidade. Demonstração: reverter não muda a
              postagem na API.
            </span>
          </div>

          <button type="submit" className={classeBotao}>
            Confirmar decisão final
          </button>
        </form>
      )}
    </>
  );
}