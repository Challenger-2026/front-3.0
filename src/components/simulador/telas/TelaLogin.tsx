import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { LoginRequest } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { mensagemDoErro } from '../../../utils/erros';

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

export default function TelaLogin() {
  const { entrar, trocarPara, irPara } = useSimulador();
  const [erroApi, setErroApi] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  const fazerLogin: SubmitHandler<LoginRequest> = async (dados) => {
    setErroApi('');
    try {
      await entrar({ username: dados.username.trim().toLowerCase(), senha: dados.senha });
      trocarPara('inicio'); // sem caminho de volta para o login
    } catch (err) {
      setErroApi(mensagemDoErro(err));
    }
  };

  return (
    <>
      <div className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Que bom ter você de volta</p>
        <h1 className="text-xl font-bold leading-snug">Cada atitude sua conta muito por aqui.</h1>
      </div>

      <form onSubmit={handleSubmit(fazerLogin)} noValidate className="space-y-3">
        <div>
          <label htmlFor="login-username" className="mb-1 block text-xs font-bold">
            Nome de usuário
          </label>
          <input
            id="login-username"
            autoCapitalize="none"
            placeholder="anacarol"
            aria-invalid={errors.username ? 'true' : 'false'}
            className={classeCampo}
            {...register('username', { required: 'Informe seu nome de usuário.' })}
          />
          {errors.username && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="login-senha" className="mb-1 block text-xs font-bold">
            Senha
          </label>
          <input
            id="login-senha"
            type="password"
            placeholder="••••••••"
            aria-invalid={errors.senha ? 'true' : 'false'}
            className={classeCampo}
            {...register('senha', { required: 'Informe sua senha.' })}
          />
          {errors.senha && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.senha.message}
            </p>
          )}
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
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Ainda não tem conta?{' '}
        <button
          type="button"
          onClick={() => irPara('cadastro')}
          className="font-semibold text-[#4F46E5] underline cursor-pointer"
        >
          Criar cadastro
        </button>
      </p>

      <p className="rounded-2xl bg-slate-100 p-3 text-xs text-slate-500">
        <strong className="text-slate-700">Protótipo:</strong> entre com <strong>anacarol</strong> e a senha{' '}
        <strong>soulup123</strong>.
      </p>
    </>
  );
}