import { useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { Postagem, PostagemCadastro } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { categorias } from '../../../data/categorias';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarPontos } from '../../../utils/formatadores';
import { regrasTextoPostagem, regrasUrlPostagem } from '../../../utils/validacoes';

// O autor (idUsuario) vem do usuário logado, no contexto
type FormNovaPostagem = Omit<PostagemCadastro, 'idUsuario'>;

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

// Botão de opção: preenchido quando selecionado
const classeOpcao = (ativo: boolean) =>
  `block w-full rounded-2xl border p-3 text-left cursor-pointer ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

export default function TelaNovaPostagem() {
  const { usuario, minhasComunidades, publicarPostagem, abrirPostagem, irPara, trocarPara } = useSimulador();
  const [erroApi, setErroApi] = useState('');
  const [criada, setCriada] = useState<Postagem | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormNovaPostagem>({
    defaultValues: {
      idComunidade: minhasComunidades[0]?.id ?? 0,
      ctTexto: '',
      ctUrl: '',
      impacto: 'ROTINA',
    },
  });

  // useWatch no lugar do watch: o React Compiler consegue otimizar a tela
  const impactoEscolhido = useWatch({ control, name: 'impacto' });

  if (!usuario) return null;

  const enviar: SubmitHandler<FormNovaPostagem> = async (dados) => {
    setErroApi('');
    try {
      const nova = await publicarPostagem({
        ...dados,
        ctTexto: dados.ctTexto.trim(),
        ctUrl: dados.ctUrl.trim(),
      });
      setCriada(nova);
    } catch (err) {
      setErroApi(mensagemDoErro(err)); // ex.: 409 "O usuário precisa ser membro da comunidade para publicar"
    }
  };

  // ----- Depois de enviar -----
  if (criada) {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Ação registrada</p>
          <h1 className="text-xl font-bold leading-snug">Ótimo trabalho! Sua ação já está a caminho.</h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
            Pendente
          </span>
          <p className="mt-3 text-sm text-slate-500">
            Um moderador vai conferir a ação às cegas. Se for aprovada, os{' '}
            <strong className="text-[#16173A]">{formatarPontos(criada.ptGerado)} pts</strong> entram no seu saldo.
          </p>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => abrirPostagem(criada.id)}
            className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer"
          >
            Ver detalhes
          </button>
          <button
            type="button"
            onClick={() => trocarPara('inicio')}
            className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
          >
            Voltar ao início
          </button>
        </div>
      </>
    );
  }

  // ----- Sem comunidade: o Java só aceita postagem de quem é membro -----
  if (minhasComunidades.length === 0) {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Nova ação</p>
          <h1 className="text-xl font-bold leading-snug">Entre em uma comunidade para publicar.</h1>
        </div>
        <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-500">
          Toda ação é registrada dentro de uma comunidade. Escolha uma que combine com você e volte aqui.
        </p>
        <button
          type="button"
          onClick={() => irPara('comunidades')}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Ver comunidades
        </button>
      </>
    );
  }

  // ----- Formulário -----
  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Nova ação</p>
        <h1 className="text-xl font-bold leading-snug">O que você fez hoje pelo planeta?</h1>
      </div>

      <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-3">
        <div>
          <label htmlFor="postagem-comunidade" className="mb-1 block text-xs font-bold">
            Comunidade
          </label>
          <select
            id="postagem-comunidade"
            className={classeCampo}
            {...register('idComunidade', { valueAsNumber: true })}
          >
            {minhasComunidades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nmComunidade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="postagem-texto" className="mb-1 block text-xs font-bold">
            Descreva sua ação
          </label>
          <textarea
            id="postagem-texto"
            rows={4}
            placeholder="Ex.: Montei uma composteira e desviei 6 kg de resíduo do aterro nesta semana."
            aria-invalid={errors.ctTexto ? 'true' : 'false'}
            className={`${classeCampo} resize-none`}
            {...register('ctTexto', regrasTextoPostagem)}
          />
          {errors.ctTexto && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.ctTexto.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="postagem-url" className="mb-1 block text-xs font-bold">
            Link da comprovação
          </label>
          <input
            id="postagem-url"
            type="url"
            autoCapitalize="none"
            placeholder="https://..."
            aria-invalid={errors.ctUrl ? 'true' : 'false'}
            className={classeCampo}
            {...register('ctUrl', regrasUrlPostagem)}
          />
          {errors.ctUrl ? (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.ctUrl.message}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-500">Cole o link de uma foto ou vídeo que mostre a ação.</p>
          )}
        </div>

        <fieldset>
          <legend className="mb-1 text-xs font-bold">Tipo de impacto</legend>
          <div className="space-y-2">
            {categorias.map((c) => {
              const ativo = impactoEscolhido === c.impacto;
              return (
                <label key={c.id} className={classeOpcao(ativo)}>
                  <input type="radio" value={c.impacto} className="sr-only" {...register('impacto')} />
                  <span className="flex items-center justify-between text-sm font-bold">
                    {c.nome}
                    <span>{formatarPontos(c.pontosAcao)} pts</span>
                  </span>
                  <span className={`mt-1 block text-xs ${ativo ? 'text-white/80' : 'text-slate-500'}`}>
                    {c.descricao}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            A moderação confere o tipo escolhido antes de liberar os pontos.
          </p>
        </fieldset>

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
          {isSubmitting ? 'Enviando…' : 'Enviar para validação'}
        </button>
      </form>
    </>
  );
}