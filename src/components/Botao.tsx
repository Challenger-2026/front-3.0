import type { ReactNode } from 'react';

interface BotaoProps {
  children: ReactNode;
  acao?: () => void;
  tipo?: 'button' | 'submit' | 'reset';
  variante?: 'primario' | 'secundario' | 'escuro';
  desabilitado?: boolean;
  className?: string;
}

export default function Botao({
  children,
  acao,
  tipo = 'button',
  variante = 'primario',
  desabilitado = false,
  className = '',
}: BotaoProps) {

  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%] focus-visible:after:translate-y-[10%] disabled:after:translate-y-full";

  const base = `${efeitoOnda} px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 inline-flex items-center justify-center select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer`;

  const variantes = {
    primario:
      'bg-[#D35400] hover:bg-[#b84500] text-white shadow-sm hover:shadow',
    secundario:
      'border border-stone-300 hover:border-[#D35400] hover:text-[#D35400] text-stone-700 bg-transparent',
    escuro: 'bg-[#1C1C1C] hover:bg-stone-800 text-white shadow-sm',
  };

  return (
    <button
      type={tipo}
      onClick={acao}
      disabled={desabilitado}
      className={`${base} ${variantes[variante]} ${className}`}
    >
      {children}
    </button>
  );
}