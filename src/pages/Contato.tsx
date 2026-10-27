import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { FormContatoInputs } from '../types/types';
import Botao from '../components/Botao';
import { FiMail, FiMapPin, FiClock } from 'react-icons/fi';

const itensContato = [
  { icone: FiMail, rotulo: 'E-mail', texto: 'contato@loboguaratech.com.br' },
  { icone: FiMapPin, rotulo: 'Localização', texto: 'São Paulo, SP – FIAP' },
  { icone: FiClock, rotulo: 'Resposta', texto: 'Em até 2 dias úteis' },
];

export default function Contato() {
  const [mensagemValidada, setMensagemValidada] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormContatoInputs>();

  const validarMensagem: SubmitHandler<FormContatoInputs> = async (data) => {
    try {
    
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Mensagem processada:', data);
      
      setMensagemValidada(true);
      reset();
      setTimeout(() => setMensagemValidada(false), 5000);
    } catch (err) {
      console.error('Erro ao enviar mensagem', err);
      alert('Ocorreu um erro ao enviar. Tente novamente.');
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-12">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div>
            <span className="inline-block text-xs font-extrabold tracking-[0.14em] uppercase text-[#35685b] bg-[#e3efe9] rounded-full px-3 py-1 mb-3">
              Contato
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#a84312]">Fale Conosco</h1>
            <div className="w-24 h-1.5 bg-[#D35400]/40 mt-4 mb-4 rounded-full"></div>
            <p className="text-stone-700 text-sm leading-relaxed">
              Conecte-se com a Lobo-guará Tech! Tem dúvidas sobre como funcionam os rankings e
              medalhas? Ou quer saber como sua empresa pode se tornar parceira do nosso ecossistema
              sustentável? Deixe a sua mensagem abaixo.
            </p>
          </div>

          <address className="not-italic bg-white p-6 rounded-2xl space-y-4 text-sm border border-[#e3cfa8] shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
            {itensContato.map(({ icone: Icone, rotulo, texto }) => (
              <p key={rotulo} className="flex items-center gap-3">
                <span className="w-10 h-10 shrink-0 rounded-full bg-orange-100 text-[#D35400] flex items-center justify-center">
                  <Icone className="text-lg" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">{rotulo}</span>
                  <span className="block text-stone-800 break-words">{texto}</span>
                </span>
              </p>
            ))}
          </address>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e3cfa8] shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
          <p id="aviso-formulario" className="mb-5 text-sm text-stone-600 text-center">
            Envie a sua mensagem para a nossa equipa
          </p>

          {mensagemValidada && (
            <p
              role="status"
              className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold text-center animate-fade-in"
            >
              Mensagem enviada com sucesso!
            </p>
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
                  minLength: { value: 3, message: 'O nome deve conter pelo menos 3 caracteres.' },
                })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none transition-colors ${
                  errors.nome ? 'border-red-500 focus:border-red-600 bg-red-50/20' : 'border-stone-300 focus:border-[#a84312]'
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
                  errors.email ? 'border-red-500 focus:border-red-600 bg-red-50/20' : 'border-stone-300 focus:border-[#a84312]'
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
                  minLength: { value: 10, message: 'A mensagem deve conter no mínimo 10 caracteres.' },
                })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none resize-none transition-colors ${
                  errors.mensagem ? 'border-red-500 focus:border-red-600 bg-red-50/20' : 'border-stone-300 focus:border-[#a84312]'
                }`}
              />
              {errors.mensagem && (
                <span id="erro-mensagem" className="text-xs text-red-600 mt-1 block font-medium">
                  {errors.mensagem.message}
                </span>
              )}
            </div>

            <Botao tipo="submit" desabilitado={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </Botao>
          </form>
        </div>
      </section>
    </main>
  );
}