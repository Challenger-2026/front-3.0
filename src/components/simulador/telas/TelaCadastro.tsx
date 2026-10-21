import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UsuarioCadastro } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { mensagemDoErro } from '../../../utils/erros';
import { regrasNome, regrasSenha, regrasUsername } from '../../../utils/validacoes';

const classeCampo =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]';

const hoje = new Date().toISOString().slice(0, 10);

export default function TelaCadastro() {
  const { cadastrar, trocarPara, voltar } = useSimulador();
  const [erroApi, setErroApi] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioCadastro>();

  const criarConta: SubmitHandler<UsuarioCadastro> = async (dados) => {
    setErroApi('');
    try {
      await cadastrar({
        nmCompleto: dados.nmCompleto.replace(/\s+/g, ' ').trim(),
        cpf: dados.cpf,
        email: dados.email.trim().toLowerCase(),
        username: dados.username.trim().toLowerCase(),
        senha: dados.senha,
        dtNascimento: dados.dtNascimento,
      });
      trocarPara('onboarding'); // conta criada: segue para o onboarding, sem voltar ao formulário
    } catch (err) {
      setErroApi(mensagemDoErro(err));
    }
  };

  return (
    <>
      <div className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Cadastro</p>
        <h1 className="text-xl font-bold leading-snug">Comece hoje a transformar atitude em impacto.</h1>
      </div>

      <form onSubmit={handleSubmit(criarConta)} noValidate className="space-y-3">
        <div>
          <label htmlFor="cad-nome" className="mb-1 block text-xs font-bold">
            Nome completo
          </label>
          <input
            id="cad-nome"
            placeholder="Ana Carolina Ribeiro"
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
          <label htmlFor="cad-username" className="mb-1 block text-xs font-bold">
            Nome de usuário
          </label>
          <input
            id="cad-username"
            autoCapitalize="none"
            placeholder="anacarol"
            aria-invalid={errors.username ? 'true' : 'false'}
            className={classeCampo}
            {...register('username', regrasUsername)}
          />
          {errors.username ? (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.username.message}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-500">Único na plataforma, sem espaços. É com ele que você entra.</p>
          )}
        </div>

        <div>
          <label htmlFor="cad-cpf" className="mb-1 block text-xs font-bold">
            CPF
          </label>
          <input
            id="cad-cpf"
            inputMode="numeric"
            maxLength={11}
            placeholder="12345678901"
            aria-invalid={errors.cpf ? 'true' : 'false'}
            className={classeCampo}
            {...register('cpf', {
              required: 'Informe seu CPF.',
              pattern: { value: /^\d{11}$/, message: 'Digite os 11 números do CPF, sem pontos ou traço.' },
            })}
          />
          {errors.cpf && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.cpf.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cad-email" className="mb-1 block text-xs font-bold">
            E-mail
          </label>
          <input
            id="cad-email"
            type="email"
            placeholder="voce@email.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            className={classeCampo}
            {...register('email', {
              required: 'Informe seu e-mail.',
              maxLength: { value: 150, message: 'O e-mail pode ter no máximo 150 caracteres.' },
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Digite um e-mail válido.' },
            })}
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cad-senha" className="mb-1 block text-xs font-bold">
            Senha
          </label>
          <input
            id="cad-senha"
            type="password"
            placeholder="••••••••"
            aria-invalid={errors.senha ? 'true' : 'false'}
            className={classeCampo}
            {...register('senha', regrasSenha)}
          />
          {errors.senha && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.senha.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cad-nascimento" className="mb-1 block text-xs font-bold">
            Data de nascimento
          </label>
          <input
            id="cad-nascimento"
            type="date"
            max={hoje}
            aria-invalid={errors.dtNascimento ? 'true' : 'false'}
            className={classeCampo}
            {...register('dtNascimento', {
              required: 'Informe sua data de nascimento.',
              validate: (valor) => valor < hoje || 'A data de nascimento deve estar no passado.',
            })}
          />
          {errors.dtNascimento && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.dtNascimento.message}
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
          {isSubmitting ? 'Criando conta…' : 'Criar minha conta'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Já tem conta?{' '}
        <button type="button" onClick={voltar} className="font-semibold text-[#4F46E5] underline cursor-pointer">
          Entrar
        </button>
      </p>
    </>
  );
}