import { useState } from 'react';
import { useSimulador } from '../../../hooks/useSimulador';
import PostagemCard from '../PostagemCard';

type Aba = 'minhas' | 'todas';

export default function TelaInicio() {
  const { comunidades, postagens, irPara } = useSimulador();
  const [aba, setAba] = useState<Aba>('minhas');

  const minhasComunidades = comunidades.filter((c) => c.entrou);
  const idsMinhas = minhasComunidades.map((c) => c.id);

  // Feed público: só postagens aprovadas, mais recentes primeiro
  const aprovadas = postagens
    .filter((p) => p.status === 'Aprovado')
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));

  const feed = aba === 'minhas' ? aprovadas.filter((p) => idsMinhas.includes(p.comunidadeId)) : aprovadas;

  const nomeDaComunidade = (id: string) => comunidades.find((c) => c.id === id)?.nome;

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Feed</p>
        <h1 className="text-xl font-bold leading-snug">O que a comunidade está fazendo agora.</h1>
      </div>

      <button
        type="button"
        onClick={() => irPara('nova-postagem')}
        className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm cursor-pointer"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#4F46E5]/10 font-bold text-[#4F46E5]">+</span>
        <span className="text-sm text-slate-500">Compartilhe uma ação sustentável…</span>
      </button>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setAba('minhas')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer ${
            aba === 'minhas' ? 'bg-[#4F46E5] text-white' : 'border border-slate-200 bg-white text-slate-500'
          }`}
        >
          Minhas comunidades ({minhasComunidades.length})
        </button>
        <button
          type="button"
          onClick={() => setAba('todas')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer ${
            aba === 'todas' ? 'bg-[#4F46E5] text-white' : 'border border-slate-200 bg-white text-slate-500'
          }`}
        >
          Explorar tudo
        </button>
      </div>

      <div className="space-y-3">
        {feed.map((postagem) => (
          <PostagemCard key={postagem.id} postagem={postagem} nomeComunidade={nomeDaComunidade(postagem.comunidadeId)} />
        ))}

        {feed.length === 0 && (
          <p className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            Nenhuma publicação validada aqui ainda. Veja "Explorar tudo".
          </p>
        )}
      </div>
    </>
  );
}