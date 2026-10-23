import type { ReactNode } from 'react';
import { FiArrowLeft, FiBell, FiHome, FiUsers, FiPlus, FiCreditCard, FiUser } from 'react-icons/fi';
import type { TelaId } from '../../types/types';
import { useSimulador } from '../../hooks/useSimulador';

type AppSoulUpProps = {
  children: ReactNode;
};

type ItemAba = {
  tela: TelaId;
  label: string;
  icone: ReactNode;
};

const abasEsquerda: ItemAba[] = [
  { tela: 'inicio', label: 'Início', icone: <FiHome size={20} /> },
  { tela: 'comunidades', label: 'Comunidades', icone: <FiUsers size={20} /> },
];

const abasDireita: ItemAba[] = [
  { tela: 'carteira', label: 'Carteira', icone: <FiCreditCard size={20} /> },
  { tela: 'perfil', label: 'Perfil', icone: <FiUser size={20} /> },
];

// Login e cadastro aparecem sem o sino e sem a barra inferior
const telasDeEntrada: TelaId[] = ['login', 'cadastro'];

export default function AppSoulUp({ children }: AppSoulUpProps) {
  const { telaAtual, podeVoltar, irPara, voltar, naoLidas } = useSimulador();
  const naEntrada = telasDeEntrada.includes(telaAtual);

  const renderAba = (aba: ItemAba) => (
    <button
      key={aba.tela}
      type="button"
      onClick={() => irPara(aba.tela)}
      className={`flex flex-col items-center gap-1 py-1 text-[10px] font-semibold cursor-pointer transition-colors ${
        telaAtual === aba.tela ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-slate-700'
      }`}
    >
      {aba.icone}
      {aba.label}
    </button>
  );

  return (
    <div className="flex h-full flex-col text-[#16173A]">
      {/* Cabeçalho do app */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pt-7 pb-3">
        <div className="flex items-center gap-2">
          {podeVoltar ? (
            <button
              type="button"
              onClick={voltar}
              aria-label="Voltar"
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 cursor-pointer"
            >
              <FiArrowLeft size={16} />
            </button>
          ) : (
            <span className="h-9 w-9" />
          )}
          <span className="flex items-center gap-1.5">
            <span className="text-2xl font-extrabold tracking-tight">soul</span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#4F46E5]">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </span>
        </div>

        {naEntrada ? (
          <span className="h-9 w-9" />
        ) : (
          <button
            type="button"
            onClick={() => irPara('notificacoes')}
            aria-label={naoLidas > 0 ? `Notificações, ${naoLidas} não lidas` : 'Notificações'}
            className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 cursor-pointer"
          >
            <FiBell size={16} />
            {naoLidas > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {naoLidas}
              </span>
            )}
          </button>
        )}
      </header>

      {/* Conteúdo da tela (key reinicia a rolagem ao trocar de tela) */}
      <main key={telaAtual} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {children}
      </main>

      {/* Barra inferior */}
      {!naEntrada && (
        <nav className="border-t border-slate-200 bg-white px-3 pt-2 pb-4">
        <div className="grid grid-cols-5 items-end">
          {abasEsquerda.map(renderAba)}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => irPara('nova-postagem')}
              aria-label="Registrar ação sustentável"
              className="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B3CF0] text-white shadow-lg ring-4 ring-white cursor-pointer"
            >
              <FiPlus size={28} />
            </button>
          </div>
          {abasDireita.map(renderAba)}
        </div>
      </nav>
      )}
    </div>
  );
}