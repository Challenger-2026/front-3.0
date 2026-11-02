import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import type { TipoPerfil } from '../../types/types';
import { useSimulador } from '../../hooks/useSimulador';
import { SENHA_TESTE, perfisTeste } from '../../data/perfisTeste';
import { mensagemDoErro } from '../../utils/erros';

const nomesPerfil: Record<TipoPerfil, string> = {
  COMUM: 'Comum',
  CRIADOR: 'Criador',
  MODERADOR: 'Moderador',
};

// Cor da etiqueta de cada perfil
const coresPerfil: Record<TipoPerfil, string> = {
  COMUM: 'bg-stone-100 text-stone-600',
  CRIADOR: 'bg-orange-100 text-[#9a3412]',
  MODERADOR: 'bg-emerald-100 text-emerald-800',
};

export default function PerfisTeste() {
  const { usuario, usuarios, entrar, trocarPara } = useSimulador();
  const [entrando, setEntrando] = useState<string | null>(null);
  const [erro, setErro] = useState('');

  // Login rápido: mesmo POST /usuarios/login da tela de Login, sem recarregar a página
  // (denúncias, contestações e reputação da sessão continuam valendo)
  const entrarComo = async (username: string) => {
    setErro('');
    setEntrando(username);
    try {
      await entrar({ username, senha: SENHA_TESTE });
      trocarPara('inicio');
    } catch (err) {
      setErro(mensagemDoErro(err));
    } finally {
      setEntrando(null);
    }
  };

  return (
    <details className="group rounded-2xl border border-[#e3cfa8] bg-white p-5 shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#35685b]">Perfis para testar</span>
          <span className="mt-1 block text-sm text-stone-600">
            {perfisTeste.length} perfis · senha <strong>{SENHA_TESTE}</strong>
          </span>
        </span>
        <FiChevronDown aria-hidden className="shrink-0 text-xl text-[#D35400] transition-transform duration-300 group-open:rotate-180" />
      </summary>

      <ul className="mt-3">
        {perfisTeste.map((perfil) => {
          const doBanco = usuarios.find((u) => u.username === perfil.username);
          const atual = usuario?.username === perfil.username;
          return (
            <li
              key={perfil.username}
              className={`flex items-center justify-between gap-3 border-t px-1 py-2.5 first:border-t-0 ${
                atual ? 'rounded-lg border-transparent bg-[#e3efe9] px-3' : 'border-[#f3e9d6]'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold text-stone-800">
                  {perfil.username}
                  {doBanco && (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${coresPerfil[doBanco.tipoPerfil]}`}>
                      {nomesPerfil[doBanco.tipoPerfil]}
                    </span>
                  )}
                </span>
                <span className="block text-xs text-stone-500">{perfil.demonstra}</span>
              </span>
              {atual ? (
                <span className="shrink-0 text-xs font-bold text-[#35685b]">Você está aqui</span>
              ) : (
                <button
                  type="button"
                  onClick={() => entrarComo(perfil.username)}
                  disabled={entrando !== null}
                  className="shrink-0 rounded-md px-2 py-1 text-sm font-bold text-[#D35400] cursor-pointer hover:bg-[#fff4e6] disabled:cursor-wait disabled:opacity-50"
                >
                  {entrando === perfil.username ? 'Entrando…' : 'Entrar →'}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-2 text-xs text-stone-500">Também dá para criar uma conta nova pelo cadastro.</p>

      {erro && (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erro}
        </p>
      )}
    </details>
  );
}