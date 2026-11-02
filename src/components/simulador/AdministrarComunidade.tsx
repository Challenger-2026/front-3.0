import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { Comunidade, ComunidadeEdicao } from '../../types/types';
import { useSimulador } from '../../hooks/useSimulador';
import { complementoDe, ehDono } from '../../data/comunidades';
import { mensagemDoErro } from '../../utils/erros';
import { regrasDescricaoComunidade, regrasNomeComunidade } from '../../utils/validacoes';
import ConfirmacaoExclusao from './ConfirmacaoExclusao';

type AdministrarComunidadeProps = {
  comunidade: Comunidade;
};

// Campos do PUT /comunidades/{id} + as regras (só no front)
type FormEditarComunidade = ComunidadeEdicao & { regras: string };

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

// Editar e excluir: só para o criador da comunidade (a API responde 403 para os outros)
export default function AdministrarComunidade({ comunidade }: AdministrarComunidadeProps) {
  const { usuario, complementosComunidade, editarComunidade, excluirComunidade, voltar } = useSimulador();
  const [aberto, setAberto] = useState(false);
  const [aviso, setAviso] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormEditarComunidade>();

  if (!ehDono(comunidade, usuario)) return null;

  // Abre o formulário com os dados atuais da comunidade
  const abrir = () => {
    reset({
      nmComunidade: comunidade.nmComunidade,
      descricao: comunidade.descricao,
      regras: complementoDe(comunidade.id, complementosComunidade).regras ?? '',
    });
    setAviso('');
    setErroApi('');
    setAberto(true);
  };

  const salvar: SubmitHandler<FormEditarComunidade> = async (dados) => {
    setErroApi('');
    try {
      await editarComunidade(
        comunidade.id,
        { nmComunidade: dados.nmComunidade.trim(), descricao: dados.descricao.trim() },
        dados.regras,
      );
      setAberto(false);
      setAviso('Comunidade atualizada.');
    } catch (err) {
      setErroApi(mensagemDoErro(err)); // ex.: 403 "Apenas o criador da comunidade pode alterá-la ou excluí-la"
    }
  };

  // Sem try/catch no contexto: o 409 da API (outros membros ou postagens) aparece aqui
  const excluir = async () => {
    setErroApi('');
    setAviso('');
    setExcluindo(true);
    try {
      await excluirComunidade(comunidade.id);
      voltar(); // a comunidade não existe mais: volta para a tela anterior
    } catch (err) {
      setErroApi(mensagemDoErro(err));
      setExcluindo(false);
    }
  };

  return (
    <section className="space-y-3">
      {!aberto ? (
        <button
          type="button"
          onClick={abrir}
          className="w-full rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
        >
          Editar comunidade
        </button>
      ) : (
        <form
          onSubmit={handleSubmit(salvar)}
          noValidate
          className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div>
            <label htmlFor="editar-nome" className="mb-1 block text-xs font-bold">
              Nome da comunidade
            </label>
            <input
              id="editar-nome"
              aria-invalid={errors.nmComunidade ? 'true' : 'false'}
              className={classeCampo}
              {...register('nmComunidade', regrasNomeComunidade)}
            />
            {errors.nmComunidade && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.nmComunidade.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="editar-descricao" className="mb-1 block text-xs font-bold">
              Descrição
            </label>
            <textarea
              id="editar-descricao"
              rows={3}
              aria-invalid={errors.descricao ? 'true' : 'false'}
              className={`${classeCampo} resize-none`}
              {...register('descricao', regrasDescricaoComunidade)}
            />
            {errors.descricao && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.descricao.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="editar-regras" className="mb-1 block text-xs font-bold">
              Regras
            </label>
            <textarea id="editar-regras" rows={3} className={`${classeCampo} resize-none`} {...register('regras')} />
            <p className="mt-1 text-[11px] text-slate-500">Demonstração: as regras ficam só no front.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#4F46E5] py-2.5 text-sm font-bold text-white cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? 'Salvando…' : 'Salvar comunidade'}
          </button>
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
          >
            Cancelar
          </button>
        </form>
      )}

      {aviso && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {aviso}
        </p>
      )}

      <ConfirmacaoExclusao
        rotulo="Excluir comunidade"
        texto="A comunidade só pode ser excluída enquanto não tiver outros membros nem publicações. Missões e regras dela também são apagadas."
        onConfirmar={excluir}
        ocupado={excluindo}
      />

      {erroApi && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erroApi}
        </p>
      )}
    </section>
  );
}