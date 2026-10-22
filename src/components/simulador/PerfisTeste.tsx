import { useState } from 'react';
import type { TipoPerfil } from '../../types/types';
import { useSimulador } from '../../hooks/useSimulador';
import { SENHA_TESTE, perfisTeste } from '../../data/perfisTeste';
import { mensagemDoErro } from '../../utils/erros';

const nomesPerfil: Record<TipoPerfil, string> = {
  COMUM: 'Comum',
  CRIADOR: 'Criador',
  MODERADOR: 'Moderador',
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
    <section className="rounded-2xl border border-[#ead9b6] bg-[#fffbed]/95 p-6 shadow-[0_15px_35px_rgba(120,78,35,0.1)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#35685b]">Perfis para testar</p>
      <p className="mt-1 text-sm text-stone-700">
        Todos com a senha <strong>{SENHA_TESTE}</strong>. Também dá para criar uma conta nova pelo cadastro.
      </p>

      <ul className="mt-4 space-y-2">
        {perfisTeste.map((perfil) => {
          const doBanco = usuarios.find((u) => u.username === perfil.username);
          const atual = usuario?.username === perfil.username;
          return (
            <li
              key={perfil.username}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#ead9b6] bg-white/70 px-3 py-2"
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold text-stone-800">
                  {perfil.username}
                  {doBanco && (
                    <span className="ml-2 rounded-full bg-[#f9e8c9] px-2 py-0.5 text-[11px] font-semibold text-[#66513c]">
                      {nomesPerfil[doBanco.tipoPerfil]}
                    </span>
                  )}
                </span>
                <span className="block text-xs text-stone-600">{perfil.demonstra}</span>
              </span>
              {atual ? (
                <span className="shrink-0 text-xs font-bold text-[#35685b]">Você está aqui</span>
              ) : (
                <button
                  type="button"
                  onClick={() => entrarComo(perfil.username)}
                  disabled={entrando !== null}
                  className="shrink-0 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-bold text-stone-700 cursor-pointer hover:border-[#D35400] hover:text-[#D35400] disabled:cursor-wait disabled:opacity-50"
                >
                  {entrando === perfil.username ? 'Entrando…' : 'Entrar como'}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {erro && (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erro}
        </p>
      )}
    </section>
  );
}