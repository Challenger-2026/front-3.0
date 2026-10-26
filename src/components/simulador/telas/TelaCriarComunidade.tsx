import { useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { ComunidadeEdicao, PlanoComunidade } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { PLANOS } from '../../../data/comunidades';
import { mensagemDoErro } from '../../../utils/erros';
import { regrasDescricaoComunidade, regrasNomeComunidade } from '../../../utils/validacoes';

// Campos do DTO + o que fica só no front (regras, organização e plano)
type FormCriarComunidade = ComunidadeEdicao & {
  regras: string;
  ehOrganizacao: boolean;
  organizacao: string;
  plano: PlanoComunidade;
};

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

// Botão de opção: preenchido quando selecionado
const classeOpcao = (ativo: boolean) =>
  `block rounded-2xl border p-3 text-left cursor-pointer ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

export default function TelaCriarComunidade() {
  const { usuario, criarComunidade, voltar, abrirComunidade, irPara } = useSimulador();
  const [erroApi, setErroApi] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormCriarComunidade>({
    defaultValues: {
      nmComunidade: '',
      descricao: '',
      regras: '',
      ehOrganizacao: false,
      organizacao: '',
      plano: 'Free',
    },
  });

  // useWatch no lugar do watch: o React Compiler consegue otimizar a tela
  const ehOrganizacao = useWatch({ control, name: 'ehOrganizacao' });
  const planoEscolhido = useWatch({ control, name: 'plano' });

  if (!usuario) return null;

  // O botão só aparece para o Criador, mas a regra é do Java: sem linha na T_LGT_CRIADOR, 403
  if (usuario.tipoPerfil !== 'CRIADOR') {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Criador</p>
          <h1 className="text-xl font-bold leading-snug">Reúna pessoas em torno da sua causa.</h1>
        </div>
        <p className="rounded-2xl border border-[#4F46E5]/30 bg-[#4F46E5]/10 p-3 text-sm">
          Para criar uma comunidade, mude seu perfil para Criador em Configurações.
        </p>
        <button
          type="button"
          onClick={() => irPara('ajustes')}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Abrir Configurações
        </button>
      </>
    );
  }

  const enviar: SubmitHandler<FormCriarComunidade> = async (dados) => {
    setErroApi('');
    const organizacao = dados.ehOrganizacao ? dados.organizacao.trim() : '';
    try {
      const nova = await criarComunidade(
        { nmComunidade: dados.nmComunidade.trim(), descricao: dados.descricao.trim() },
        {
          plano: dados.ehOrganizacao ? dados.plano : 'Free', // plano só para organizações, como no protótipo
          organizacao: organizacao || undefined,
          regras: dados.regras.trim() || undefined,
        },
      );
      // Sai do formulário e abre a comunidade criada (voltar o leva para a lista, não para o formulário)
      voltar();
      abrirComunidade(nova.id);
    } catch (err) {
      setErroApi(mensagemDoErro(err)); // ex.: 403 se o perfil não tiver linha na T_LGT_CRIADOR
    }
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Criador</p>
        <h1 className="text-xl font-bold leading-snug">Reúna pessoas em torno da sua causa.</h1>
      </div>

      <p className="rounded-2xl border border-slate-200 bg-slate-100 p-3 text-xs">
        <strong>Papel do Criador:</strong> você cria e administra a comunidade (nome, descrição e regras), mas não
        modera as postagens dela. A validação é feita às cegas por moderadores da Soul Up de fora da comunidade.
      </p>

      <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-3">
        <div>
          <label htmlFor="comunidade-nome" className="mb-1 block text-xs font-bold">
            Nome da comunidade
          </label>
          <input
            id="comunidade-nome"
            placeholder="Ex.: Ciclo Zero Resíduo"
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
          <label htmlFor="comunidade-descricao" className="mb-1 block text-xs font-bold">
            Descrição
          </label>
          <textarea
            id="comunidade-descricao"
            rows={4}
            placeholder="Ex.: Pessoas reduzindo lixo doméstico com compostagem, reuso e compras a granel."
            aria-invalid={errors.descricao ? 'true' : 'false'}
            className={`${classeCampo} resize-none`}
            {...register('descricao', regrasDescricaoComunidade)}
          />
          {errors.descricao ? (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.descricao.message}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-500">Explique quem pode participar e quais ações valem pontos.</p>
          )}
        </div>

        <div>
          <label htmlFor="comunidade-regras" className="mb-1 block text-xs font-bold">
            Regras da comunidade (opcional)
          </label>
          <textarea
            id="comunidade-regras"
            rows={3}
            placeholder="Ex.: Toda ação precisa de foto. Sem propaganda."
            className={`${classeCampo} resize-none`}
            {...register('regras')}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Os moderadores da Soul Up usam estas regras ao avaliar as postagens.
          </p>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-[#4F46E5]" {...register('ehOrganizacao')} />
          Estou criando em nome de uma ONG ou organização
        </label>

        {ehOrganizacao && (
          <>
            <div>
              <label htmlFor="comunidade-organizacao" className="mb-1 block text-xs font-bold">
                Nome da organização
              </label>
              <input
                id="comunidade-organizacao"
                placeholder="Ex.: Instituto Rio Limpo"
                className={classeCampo}
                {...register('organizacao')}
              />
            </div>

            <fieldset>
              <legend className="mb-1 text-xs font-bold">Plano</legend>
              <div className="grid grid-cols-2 gap-2">
                {PLANOS.map((p) => {
                  const ativo = planoEscolhido === p.plano;
                  return (
                    <label key={p.plano} className={classeOpcao(ativo)}>
                      <input type="radio" value={p.plano} className="sr-only" {...register('plano')} />
                      <span className="block text-sm font-extrabold">{p.plano}</span>
                      <ul className={`mt-2 space-y-1 text-[11px] ${ativo ? 'text-white/85' : 'text-slate-500'}`}>
                        {p.itens.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </>
        )}

        <p className="text-center text-[11px] text-slate-500">
          Demonstração: regras, organização e plano ficam só no front (a API guarda o nome e a descrição).
        </p>

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
          {isSubmitting ? 'Criando…' : 'Criar comunidade'}
        </button>
      </form>
    </>
  );
}