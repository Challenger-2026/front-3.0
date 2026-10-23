import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UsuarioAtualizacao } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarData } from '../../../utils/formatadores';
import { regrasNome, regrasSenha, regrasUsername } from '../../../utils/validacoes';
import ConfirmacaoExclusao from '../ConfirmacaoExclusao';

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

export default function TelaDados() {
  const { usuario, atualizarDados, excluirConta } = useSimulador();
  const [erroApi, setErroApi] = useState('');
  const [salvo, setSalvo] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioAtualizacao>({
    defaultValues: { nmCompleto: usuario?.nmCompleto ?? '', username: usuario?.username ?? '', senha: '' },
  });

  if (!usuario) return null;

  const salvar: SubmitHandler<UsuarioAtualizacao> = async (dados) => {
    setErroApi('');
    setSalvo(false);
    try {
      await atualizarDados({
        nmCompleto: dados.nmCompleto.replace(/\s+/g, ' ').trim(),
        username: dados.username.trim().toLowerCase(),
        senha: dados.senha,
      });
      setSalvo(true);
    } catch (err) {
      setErroApi(mensagemDoErro(err)); // ex.: 409 "Username já cadastrado"
    }
  };

  const confirmarExclusao = async () => {
    setErroExclusao('');
    setExcluindo(true);
    try {
      await excluirConta(); // deu certo: o contexto já volta para o login
    } catch (err) {
      setErroExclusao(mensagemDoErro(err)); // ex.: 409 "Usuário possui registros vinculados..."
      setExcluindo(false);
    }
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Meus dados</p>
        <h1 className="text-xl font-bold leading-snug">Mantenha seu cadastro sempre em dia.</h1>
      </div>

      <form onSubmit={handleSubmit(salvar)} onInput={() => setSalvo(false)} noValidate className="space-y-3">
        <div>
          <label htmlFor="dados-nome" className="mb-1 block text-xs font-bold">
            Nome completo
          </label>
          <input
            id="dados-nome"
            aria-invalid={errors.nmCompleto ? 'true' : 'false'}
            className={classeCampo}
            {...register('nmCompleto', regrasNome)}
          />
          {errors.nmCompleto && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.nmCompleto.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dados-username" className="mb-1 block text-xs font-bold">
            Nome de usuário
          </label>
          <input
            id="dados-username"
            autoCapitalize="none"
            aria-invalid={errors.username ? 'true' : 'false'}
            className={classeCampo}
            {...register('username', regrasUsername)}
          />
          {errors.username && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dados-senha" className="mb-1 block text-xs font-bold">
            Senha
          </label>
          <input
            id="dados-senha"
            type="password"
            placeholder="••••••••"
            aria-invalid={errors.senha ? 'true' : 'false'}
            className={classeCampo}
            {...register('senha', regrasSenha)}
          />
          {errors.senha ? (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.senha.message}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-500">Confirme a senha atual ou digite uma nova. A API exige a senha para salvar.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3">
          <p className="text-sm font-semibold">Dados verificados da conta</p>
          <p className="mt-1 text-xs text-slate-500">
            E-mail e data de nascimento não podem ser alterados depois do cadastro.
          </p>
          <dl className="mt-2 space-y-1.5">
            <div className="flex justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm">
              <dt className="text-xs uppercase tracking-wider text-slate-500">E-mail</dt>
              <dd className="font-semibold">{usuario.email}</dd>
            </div>
            <div className="flex justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm">
              <dt className="text-xs uppercase tracking-wider text-slate-500">Nascimento</dt>
              <dd className="font-semibold">{formatarData(usuario.dtNascimento)}</dd>
            </div>
          </dl>
        </div>

        {erroApi && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {erroApi}
          </p>
        )}
        {salvo && (
          <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Tudo certo! Seus dados foram atualizados.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </form>

      <ConfirmacaoExclusao
        rotulo="Excluir minha conta"
        texto="A conta e os dados de gamificação são apagados e não podem ser recuperados (LGPD, art. 18, VI)."
        onConfirmar={confirmarExclusao}
        ocupado={excluindo}
      />

      {erroExclusao && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erroExclusao}
        </p>
      )}
    </>
  );
}