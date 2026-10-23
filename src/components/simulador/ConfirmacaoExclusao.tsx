import { useState } from 'react';

type ConfirmacaoExclusaoProps = {
  rotulo: string;
  texto: string;
  onConfirmar: () => void;
  ocupado?: boolean; // enquanto a API responde
};

// Exclusão em duas etapas, como no protótipo: "Continuar exclusão" e depois "Confirmar exclusão"
export default function ConfirmacaoExclusao({ rotulo, texto, onConfirmar, ocupado = false }: ConfirmacaoExclusaoProps) {
  const [etapa, setEtapa] = useState(0);

  if (etapa === 0) {
    return (
      <button
        type="button"
        onClick={() => setEtapa(1)}
        className="w-full rounded-full border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 cursor-pointer"
      >
        {rotulo}
      </button>
    );
  }

  return (
    <section aria-label={rotulo} className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4">
      <h2 className="text-sm font-bold text-red-600">{etapa === 1 ? rotulo : 'Confirmação final'}</h2>
      <p className="text-sm">{texto}</p>
      {etapa === 2 && <p className="text-xs font-semibold">Deseja confirmar este pedido?</p>}

      <button
        type="button"
        onClick={() => (etapa === 1 ? setEtapa(2) : onConfirmar())}
        disabled={ocupado}
        className="w-full rounded-full bg-red-600 py-2.5 text-sm font-bold text-white cursor-pointer disabled:opacity-60"
      >
        {etapa === 1 ? 'Continuar exclusão' : ocupado ? 'Excluindo…' : 'Confirmar exclusão'}
      </button>
      <button
        type="button"
        onClick={() => setEtapa(0)}
        disabled={ocupado}
        className="w-full rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
      >
        Cancelar
      </button>
    </section>
  );
}