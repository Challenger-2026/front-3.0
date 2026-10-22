import { useState } from 'react';
import { useSimulador } from '../../../hooks/useSimulador';
import PostagemCard from '../PostagemCard';
import ParaVoce from '../ParaVoce';

type Aba = 'minhas' | 'todas';

export default function TelaInicio() {
  const { usuarios, comunidades, minhasComunidades, postagens, irPara, abrirComunidade } = useSimulador();
  const [aba, setAba] = useState<Aba>('minhas');

  const idsMinhas = minhasComunidades.map((c) => c.id);

    // Feed público: só postagens aprovadas, mais recentes primeiro (id decrescente, a API não tem data)
  const aprovadas = postagens
    .filter((p) => p.stValidacao === 'APROVADO')
    .sort((a, b) => b.id - a.id);

  const feed = aba === 'minhas' ? aprovadas.filter((p) => idsMinhas.includes(p.idComunidade)) : aprovadas;

  const nomeDaComunidade = (id: number) => comunidades.find((c) => c.id === id)?.nmComunidade;
  const nomeDoAutor = (id: number) => usuarios.find((u) => u.id === id)?.nmCompleto;

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

      {/* Atalhos para as comunidades de que o usuário participa */}
      {minhasComunidades.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {minhasComunidades.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => abrirComunidade(c.id)}
              className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold cursor-pointer"
            >
              {c.nmComunidade}
            </button>
          ))}
        </div>
      )}

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

      <ParaVoce compacto />

      <div className="space-y-3">
        {feed.map((postagem) => (
                    <PostagemCard
            key={postagem.id}
            postagem={postagem}
            nomeAutor={nomeDoAutor(postagem.idUsuario)}
            nomeComunidade={nomeDaComunidade(postagem.idComunidade)}
          />
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