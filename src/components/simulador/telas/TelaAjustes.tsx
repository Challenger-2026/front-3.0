import { useState } from 'react';
import type { ReactNode } from 'react';
import { FiCompass, FiStar, FiShield, FiChevronRight } from 'react-icons/fi';
import type { TipoPerfil } from '../../../types/types';
import { useSimulador } from '../../../hooks/useSimulador';
import { mensagemDoErro } from '../../../utils/erros';

type OpcaoPerfil = {
  perfil: TipoPerfil;
  titulo: string;
  texto: string;
  icone: ReactNode;
};

const opcoes: OpcaoPerfil[] = [
  { perfil: 'COMUM', titulo: 'Usuário comum', texto: 'Registrar ações, pontuar e resgatar benefícios.', icone: <FiCompass size={20} /> },
  { perfil: 'CRIADOR', titulo: 'Criador', texto: 'Cria e administra comunidades. Não modera a própria comunidade.', icone: <FiStar size={20} /> },
  { perfil: 'MODERADOR', titulo: 'Moderador', texto: 'Avalia às cegas a fila global de postagens da Soul Up. Requer candidatura.', icone: <FiShield size={20} /> },
];

export default function TelaAjustes() {
  const { usuario, trocarPerfil, irPara, reiniciar, comunidades, missoes } = useSimulador();
  const [trocando, setTrocando] = useState<TipoPerfil | null>(null);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  if (!usuario) return null;

  // Dados de criador: comunidades dele (pelo idUsuarioCriador) e missões ativas delas
  const criadas = comunidades.filter((c) => c.idUsuarioCriador === usuario.id);
  const missoesAtivas = missoes.filter((m) => !m.encerrada && criadas.some((c) => c.id === m.idComunidade)).length;

  const escolher = async (perfil: TipoPerfil) => {
    if (perfil === usuario.tipoPerfil) return;
    // Moderador não troca direto: passa pela candidatura (confidencialidade, requisitos e questionário)
    if (perfil === 'MODERADOR') {
      irPara('candidatura');
      return;
    }
    setErro('');
    setAviso('');
    setTrocando(perfil);
    try {
      await trocarPerfil(perfil);
      setAviso('Perfil atualizado. O que você já conquistou continua com você.');
    } catch (err) {
      setErro(mensagemDoErro(err)); // ex.: criador com comunidades recebe 409
    } finally {
      setTrocando(null);
    }
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Configurações</p>
        <h1 className="text-xl font-bold leading-snug">Ajuste como você participa da Soul Up.</h1>
      </div>

      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipo de perfil</h2>

        {opcoes.map((opcao) => {
          const ativo = usuario.tipoPerfil === opcao.perfil;
          return (
            <button
              key={opcao.perfil}
              type="button"
              onClick={() => escolher(opcao.perfil)}
              disabled={trocando !== null}
              aria-pressed={ativo}
              className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left cursor-pointer disabled:cursor-wait ${
                ativo ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-slate-200 bg-white'
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100">{opcao.icone}</span>
              <span className="flex-1">
                <span className="block text-sm font-bold">{opcao.titulo}</span>
                <span className="block text-xs text-slate-500">{opcao.texto}</span>
                {ativo && (
                  <span className="mt-1.5 inline-block rounded-full bg-[#4F46E5] px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Perfil atual
                  </span>
                )}
                {trocando === opcao.perfil && <span className="mt-1.5 block text-[11px] text-slate-500">Trocando…</span>}
              </span>
            </button>
          );
        })}

        {erro && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {erro}
          </p>
        )}
        {aviso && (
          <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {aviso}
          </p>
        )}
      </section>

      {usuario.tipoPerfil === 'CRIADOR' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold">Dados de criador</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center">
            {[
              { label: 'Comunidades criadas', valor: criadas.length },
              { label: 'Missões ativas', valor: missoesAtivas },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-100 py-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{item.label}</p>
                <p className="text-sm font-bold">{item.valor}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Conta e app</h2>

        <button
          type="button"
          onClick={() => irPara('dados')}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold cursor-pointer"
        >
          Dados cadastrais
          <FiChevronRight className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => irPara('onboarding')}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold cursor-pointer"
        >
          Interesses e sugestões para você
          <FiChevronRight className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => irPara('metas')}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold cursor-pointer"
        >
          Meta de atividades
          <FiChevronRight className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => irPara('parametros')}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold cursor-pointer"
        >
          Parâmetros de pontuação
          <FiChevronRight className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => irPara('privacidade')}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold cursor-pointer"
        >
          Privacidade e segurança dos dados
          <FiChevronRight className="text-slate-400" />
        </button>
        {usuario.tipoPerfil === 'CRIADOR' && (
          <button
            type="button"
            onClick={() => irPara('criar-comunidade')}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold cursor-pointer"
          >
            Criar minha comunidade
            <FiChevronRight className="text-slate-400" />
          </button>
        )}
        {usuario.tipoPerfil === 'MODERADOR' && (
          <button
            type="button"
            onClick={() => irPara('moderacao')}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold cursor-pointer"
          >
            Fila de moderação
            <FiChevronRight className="text-slate-400" />
          </button>
        )}
        <button
          type="button"
          onClick={reiniciar}
          className="w-full rounded-2xl py-3 text-center text-sm font-semibold text-red-600 cursor-pointer"
        >
          Sair da conta
        </button>
      </section>
    </>
  );
}