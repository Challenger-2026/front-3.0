import { useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { FiEyeOff } from 'react-icons/fi';
import type { DecisaoModeracao, Moderacao } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { buscarCategoriaPorPontos } from '../../../data/categorias';
import { RUBRICA, bonusDoModerador } from '../../../data/moderacao';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarPontos } from '../../../utils/formatadores';
import { regrasParecer } from '../../../utils/validacoes';

type RespostaRubrica = 'SIM' | 'NAO';

type FormAnalise = {
  rubrica: RespostaRubrica[]; // uma resposta por critério (fica só no front)
  decisao: DecisaoModeracao;
  justificativa: string;
};

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

// Botão de opção: preenchido quando selecionado
const classeOpcao = (ativo: boolean) =>
  `cursor-pointer rounded-full border px-3 py-1 text-xs font-bold ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

const classeDecisao = (ativo: boolean) =>
  `block cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-bold ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

export default function TelaAnaliseModeracao() {
  const { fila, impedidas, idPostagemAberta, moderar, declararImpedimento, voltar } = useSimulador();
  const [registrada, setRegistrada] = useState<Moderacao | null>(null);
  const [erroApi, setErroApi] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormAnalise>({ defaultValues: { rubrica: [], justificativa: '' } });

  // useWatch no lugar do watch: o React Compiler consegue otimizar a tela
  const rubrica = useWatch({ control, name: 'rubrica' });
  const decisao = useWatch({ control, name: 'decisao' });

  // A análise só usa o que veio da fila às cegas (sem autor e sem comunidade)
  const postagem = fila.find((p) => p.id === idPostagemAberta && !impedidas.includes(p.id));
  const categoria = postagem ? buscarCategoriaPorPontos(postagem.ptGerado) : undefined;

  // ----- Depois de enviar -----
  if (registrada) {
    const aprovada = registrada.decisao === 'A';
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Decisão registrada</p>
          <h1 className="text-xl font-bold leading-snug">
            Postagem #{registrada.idPostagem} {aprovada ? 'aprovada' : 'rejeitada'}.
          </h1>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p>
            {aprovada
              ? 'Os pontos da ação entraram no saldo do autor.'
              : 'O autor recebe a justificativa e pode contestar a decisão.'}
          </p>
          <p className="mt-2">
            Seu bônus de moderação: <strong className="text-[#4F46E5]">{formatarPontos(registrada.bnModerador)} pts</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={voltar}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Voltar para a fila
        </button>
      </>
    );
  }

  // ----- Fora da fila (já moderada, impedida ou de uma comunidade dele) -----
  if (!postagem) {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Moderação</p>
          <h1 className="text-xl font-bold leading-snug">Postagem não disponível na sua fila.</h1>
        </div>
        <button
          type="button"
          onClick={voltar}
          className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer"
        >
          Voltar para a fila
        </button>
      </>
    );
  }

  const enviar: SubmitHandler<FormAnalise> = async (dados) => {
    setErroApi('');
    // O Java exige justificativa: na aprovação sem texto, vai uma mensagem padrão
    const justificativa =
      dados.justificativa.trim() ||
      `Ação validada como ${categoria?.nome ?? 'ação sustentável'}. Ótimo trabalho, continue assim!`;
    try {
      setRegistrada(await moderar({ decisao: dados.decisao, justificativa, idPostagem: postagem.id }));
    } catch (err) {
      setErroApi(mensagemDoErro(err)); // ex.: 409 "Esta postagem já foi moderada"
    }
  };

  const impedir = () => {
    declararImpedimento(postagem.id);
    voltar();
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Análise</p>
        <h1 className="text-xl font-bold leading-snug">Leia com calma antes de decidir.</h1>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-bold text-[#4F46E5]">Postagem #{postagem.id}</span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
            Pendente
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
          <FiEyeOff size={14} /> Autor oculto para garantir uma avaliação imparcial.
        </p>
        <p className="mt-3 text-sm leading-relaxed">{postagem.ctTexto}</p>
        <button
          type="button"
          onClick={impedir}
          className="mt-2 text-[11px] font-semibold text-slate-500 underline cursor-pointer"
        >
          Declarar impedimento
        </button>

        {postagem.ctUrl ? (
          <a
            href={postagem.ctUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block break-all rounded-xl bg-slate-100 px-3 py-2 text-xs text-[#4F46E5] underline"
          >
            Evidência: {postagem.ctUrl}
          </a>
        ) : (
          <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-500">Nenhuma evidência anexada.</p>
        )}

        <p className="mt-3 rounded-xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 px-3 py-2 text-xs">
          Tipo de impacto informado: <strong className="text-[#4F46E5]">{categoria?.nome ?? 'não identificado'}</strong>
        </p>
      </article>

      <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-4">
        <fieldset>
          <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Rubrica</legend>
          <ul className="space-y-2">
            {RUBRICA.map((criterio, i) => (
              <li key={criterio} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm">{criterio}</span>
                  <span className="flex shrink-0 gap-1">
                    {(['SIM', 'NAO'] as const).map((valor) => (
                      <label key={valor} className={classeOpcao(rubrica?.[i] === valor)}>
                        <input
                          type="radio"
                          value={valor}
                          className="sr-only"
                          {...register(`rubrica.${i}`, { required: 'Responda Sim ou Não.' })}
                        />
                        {valor === 'SIM' ? 'Sim' : 'Não'}
                      </label>
                    ))}
                  </span>
                </div>
                {errors.rubrica?.[i] && (
                  <p role="alert" className="mt-1 text-xs text-red-600">
                    {errors.rubrica[i]?.message}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Decisão</legend>
          <div className="grid grid-cols-2 gap-3">
            {(['A', 'R'] as const).map((valor) => (
              <label key={valor} className={classeDecisao(decisao === valor)}>
                <input
                  type="radio"
                  value={valor}
                  className="sr-only"
                  {...register('decisao', {
                    required: 'Escolha aprovar ou rejeitar.',
                    // a rubrica precisa combinar com a decisão
                    validate: (escolhida, form) => {
                      const algumNao = form.rubrica.includes('NAO');
                      if (escolhida === 'A' && algumNao) return 'Para aprovar, todos os critérios devem estar como Sim.';
                      if (escolhida === 'R' && !algumNao) return 'Para rejeitar, marque ao menos um critério como Não.';
                      return true;
                    },
                  })}
                />
                {valor === 'A' ? 'Aprovar e validar' : 'Rejeitar'}
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
          <label htmlFor="analise-justificativa" className="mb-1 block text-xs font-bold">
            {decisao === 'R' ? 'Justificativa (obrigatória)' : 'Justificativa'}
          </label>
          <textarea
            id="analise-justificativa"
            rows={4}
            placeholder={
              decisao === 'R'
                ? 'Explique com clareza o que faltou para a ação ser validada.'
                : 'Ex.: Registro completo e consistente com o tipo de impacto.'
            }
            aria-invalid={errors.justificativa ? 'true' : 'false'}
            className={`${classeCampo} resize-none`}
            {...register('justificativa', {
              validate: (texto, form) => (form.decisao === 'R' ? regrasParecer.validate(texto) : true),
            })}
          />
          {errors.justificativa ? (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.justificativa.message}
            </p>
          ) : (
            decisao !== 'R' && (
              <p className="mt-1 text-[11px] text-slate-500">Um comentário acolhedor ajuda o autor a evoluir.</p>
            )
          )}
        </div>

        <div className="rounded-2xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-3 text-sm">
          Pontos liberados se aprovada: <strong className="text-[#4F46E5]">{formatarPontos(postagem.ptGerado)} pts</strong>
          <span className="block text-xs text-slate-500">
            Seu bônus: 10% = {formatarPontos(bonusDoModerador(postagem.ptGerado))} pts. Rejeitadas não geram pontos ao autor.
          </span>
        </div>

        {erroApi && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {erroApi}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? 'Enviando…' : 'Confirmar decisão'}
        </button>
      </form>
    </>
  );
}