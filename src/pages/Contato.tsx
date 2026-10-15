import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { FormContatoInputs } from '../types/types';
import Botao from '../components/Botao';

export default function Contato() {
  const [mensagemValidada, setMensagemValidada] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormContatoInputs>();

  const validarMensagem: SubmitHandler<FormContatoInputs> = () => {
    setMensagemValidada(true);
    reset();
  };

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="relative z-10 bg-[#fffbed]/90 rounded-2xl px-6 py-5 border border-[#ead9b6]/40 shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#a84312] mb-2">Fale Conosco</h1>
          <p className="text-stone-700 text-sm leading-relaxed">
            Conecte-se com a Lobo-guará Tech! Tem dúvidas sobre como funcionam os rankings e
            medalhas? Ou quer saber como sua empresa pode se tornar parceira do nosso ecossistema
            sustentável? Confira nossos canais de contato ou experimente o formulário de
            demonstração.
          </p>
        </div>

        <address className="not-italic bg-stone-900 text-amber-50 p-6 rounded-2xl space-y-3 text-sm shadow-sm border border-stone-800">
          <p className="break-words">
            <strong className="text-white font-semibold">E-mail:</strong> contato@loboguaratech.com.br
          </p>
          <p>
            <strong className="text-white font-semibold">Telefone:</strong> (11) 4002-8922
          </p>
          <p>
            <strong className="text-white font-semibold">Localização:</strong> São Paulo, SP - FIAP
          </p>
        </address>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
        <p id="aviso-formulario" className="mb-5 text-sm text-stone-600 text-center">
          Formulário de demonstração
        </p>

        {mensagemValidada && (
          <p
            role="status"
            className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold text-center"
          >Dados válidos! Esta demonstração não envia mensagens externas.</p>
        )}

        <form
          onSubmit={handleSubmit(validarMensagem)}
          onInput={() => setMensagemValidada(false)}
          aria-describedby="aviso-formulario"
          className="space-y-4"
          noValidate
        >

          <div>
            <label htmlFor="nome" className="block text-sm font-bold text-stone-900 mb-1">
              Nome Completo:
            </label>
            <input
              id="nome"
              type="text"
              autoComplete="name"
              required
              placeholder="Seu nome aqui"
              aria-invalid={errors.nome ? 'true' : 'false'}
              aria-describedby={errors.nome ? 'erro-nome' : undefined}
              {...register('nome', {
                setValueAs: (valor: unknown) => (typeof valor === 'string' ? valor.trim() : valor),
                required: 'Por favor, informe seu nome completo.',
                minLength: {
                  value: 3,
                  message: 'O nome deve conter pelo menos 3 caracteres.',
                },
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none transition-colors ${
                errors.nome
                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                  : 'border-stone-300 focus:border-[#a84312]'
              }`}
            />
            {errors.nome && (
              <span id="erro-nome" className="text-xs text-red-600 mt-1 block font-medium">
                {errors.nome.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-stone-900 mb-1">
              E-mail:
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="email@exemplo.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'erro-email' : undefined}
              {...register('email', {
                setValueAs: (valor: unknown) => (typeof valor === 'string' ? valor.trim() : valor),
                required: 'O e-mail é obrigatório.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                  message: 'Por favor, insira um endereço de e-mail válido.',
                },
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                  : 'border-stone-300 focus:border-[#a84312]'
              }`}
            />
            {errors.email && (
              <span id="erro-email" className="text-xs text-red-600 mt-1 block font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-sm font-bold text-stone-900 mb-1">
              Mensagem:
            </label>
            <textarea
              id="mensagem"
              rows={4}
              required
              placeholder="Como podemos ajudar?"
              aria-invalid={errors.mensagem ? 'true' : 'false'}
              aria-describedby={errors.mensagem ? 'erro-mensagem' : undefined}
              {...register('mensagem', {
                setValueAs: (valor: unknown) => (typeof valor === 'string' ? valor.trim() : valor),
                required: 'A mensagem é obrigatória.',
                minLength: {
                  value: 10,
                  message: 'A mensagem deve conter no mínimo 10 caracteres.',
                },
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none resize-none transition-colors ${
                errors.mensagem
                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                  : 'border-stone-300 focus:border-[#a84312]'
              }`}
            />
            {errors.mensagem && (
              <span id="erro-mensagem" className="text-xs text-red-600 mt-1 block font-medium">
                {errors.mensagem.message}
              </span>
            )}
          </div>

          <Botao tipo="submit" desabilitado={isSubmitting} className="w-full sm:w-auto">
            Enviar mensagem
          </Botao>
        </form>
      </div>
    </main>
  );
}