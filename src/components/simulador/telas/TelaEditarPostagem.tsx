import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { PostagemEdicao } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { categorias, buscarCategoriaPorPontos } from '../../../data/categorias';
import { formatarPontos } from '../../../utils/formatadores';
import { regrasTextoPostagem, regrasUrlPostagem } from '../../../utils/validacoes';

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

// Botão de opção: preenchido quando selecionado
const classeOpcao = (ativo: boolean) =>
  `block w-full rounded-2xl border p-3 text-left cursor-pointer ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

export default function TelaEditarPostagem() {
  const { usuario, postagens, comunidades, idPostagemAberta, editarPostagem, voltar } = useSimulador();

  const postagem = postagens.find((p) => p.id === idPostagemAberta);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostagemEdicao>({
    defaultValues: {
      ctTexto: postagem?.ctTexto ?? '',
      ctUrl: postagem?.ctUrl ?? '',
      // a API só devolve o ptGerado: o impacto é deduzido pelos pontos
      impacto: postagem ? (buscarCategoriaPorPontos(postagem.ptGerado)?.impacto ?? 'ROTINA') : 'ROTINA',
    },
  });

  const impactoEscolhido = useWatch({ control, name: 'impacto' });

  if (!usuario) return null;

  // Só o autor edita, e só enquanto a moderação não decidiu
  if (!postagem || postagem.idUsuario !== usuario.id || postagem.stValidacao !== 'PENDENTE') {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Editar postagem</p>
        <h1 className="text-xl font-bold leading-snug">Esta postagem não pode mais ser editada.</h1>
      </div>
    );
  }

  const salvar: SubmitHandler<PostagemEdicao> = (dados) => {
    editarPostagem(postagem.id, { ...dados, ctTexto: dados.ctTexto.trim(), ctUrl: dados.ctUrl.trim() });
    voltar(); // volta para o feedback, já com a postagem alterada
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Editar postagem</p>
        <h1 className="text-xl font-bold leading-snug">Ajuste sua ação antes da moderação.</h1>
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
        Demonstração: a API ainda não permite editar postagens. A alteração vale só nesta simulação.
      </p>

      <form onSubmit={handleSubmit(salvar)} noValidate className="space-y-3">
        <div>
          <p className="mb-1 text-xs font-bold">Comunidade</p>
          <p className="rounded-xl bg-slate-100 px-3 py-2.5 text-sm text-slate-500">
            {comunidades.find((c) => c.id === postagem.idComunidade)?.nmComunidade}
          </p>
        </div>

        <div>
          <label htmlFor="editar-texto" className="mb-1 block text-xs font-bold">
            Descreva sua ação
          </label>
          <textarea
            id="editar-texto"
            rows={4}
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
          <label htmlFor="editar-url" className="mb-1 block text-xs font-bold">
            Link da comprovação
          </label>
          <input
            id="editar-url"
            type="url"
            autoCapitalize="none"
            placeholder="https://..."
            aria-invalid={errors.ctUrl ? 'true' : 'false'}
            className={classeCampo}
            {...register('ctUrl', regrasUrlPostagem)}
          />
          {errors.ctUrl && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.ctUrl.message}
            </p>
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
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={voltar}
            className="rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button type="submit" className="rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer">
            Salvar
          </button>
        </div>
      </form>
    </>
  );
}