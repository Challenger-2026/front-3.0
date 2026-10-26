import { useEffect, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useSimulador } from '../../../hooks/useSimulador';
import { complementoDe, painelImpacto } from '../../../data/comunidades';
import { denunciasNaFila } from '../../../data/moderacao';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarData, formatarPontos } from '../../../utils/formatadores';
import SelosComunidade from '../SelosComunidade';
import PostagemCard from '../PostagemCard';
import AdministrarComunidade from '../AdministrarComunidade';
import MissoesComunidade from '../MissoesComunidade';

export default function TelaComunidade() {
  const {
    usuario,
    usuarios,
    comunidades,
    minhasComunidades,
    postagens,
    complementosComunidade,
    totalMembros,
    carregarTotalMembros,
    idComunidadeAberta,
    entrarComunidade,
    sairComunidade,
    denuncias,
    revisoesDenuncia,
    irPara,
  } = useSimulador();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  // Total de membros atualizado ao abrir a tela: só o da comunidade aberta (GET /comunidades/{id}/membros/total)
  useEffect(() => {
    if (idComunidadeAberta === null) return;
    const buscarTotal = async () => {
      try {
        await carregarTotalMembros(idComunidadeAberta);
      } catch (err) {
        setErro(mensagemDoErro(err));
      }
    };
    buscarTotal();
  }, [carregarTotalMembros, idComunidadeAberta]);

  const comunidade = comunidades.find((c) => c.id === idComunidadeAberta);

  if (!usuario) return null;

  if (!comunidade) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Comunidades</p>
        <h1 className="text-xl font-bold leading-snug">Comunidade não encontrada.</h1>
      </div>
    );
  }

  const complemento = complementoDe(comunidade.id, complementosComunidade);
  const participa = minhasComunidades.some((c) => c.id === comunidade.id);
  const total = totalMembros[comunidade.id];

  // Publicações públicas: só aprovadas, mais recentes primeiro (id decrescente)
  const publicacoes = postagens
    .filter((p) => p.idComunidade === comunidade.id && p.stValidacao === 'APROVADO')
    .sort((a, b) => b.id - a.id);

  // Mesmas regras da fila de denúncias (fora das comunidades do moderador e sem as próprias)
  const denunciadas =
    usuario.tipoPerfil === 'MODERADOR'
      ? denunciasNaFila(
          postagens,
          denuncias,
          revisoesDenuncia,
          usuario.id,
          minhasComunidades.map((c) => c.id),
        ).filter((item) => item.postagem.idComunidade === comunidade.id).length
      : 0;

  const nomeDoAutor = (id: number) => usuarios.find((u) => u.id === id)?.nmCompleto;

  // Sem try/catch no contexto: o 409 da API (ex.: criador saindo da própria comunidade) aparece aqui
  const alternarParticipacao = async () => {
    setErro('');
    setEnviando(true);
    try {
      if (participa) await sairComunidade(comunidade.id);
      else await entrarComunidade(comunidade.id);
    } catch (err) {
      setErro(mensagemDoErro(err));
    } finally {
      setEnviando(false);
    }
  };

  const painel = painelImpacto(comunidade.id, postagens);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">{comunidade.nmComunidade}</h1>
        <div className="mt-1">
          <SelosComunidade complemento={complemento} />
        </div>
        <p className="mt-1 text-sm text-slate-500">{comunidade.descricao}</p>
        {complemento.regras && (
          <p className="mt-2 text-xs text-slate-500">
            <strong>Regras:</strong> {complemento.regras}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {total === undefined ? '…' : total} {total === 1 ? 'membro' : 'membros'} · {publicacoes.length}{' '}
            {publicacoes.length === 1 ? 'publicação' : 'publicações'}
          </span>
          {participa ? (
            <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Você participa
            </span>
          ) : (
            <button
              type="button"
              onClick={alternarParticipacao}
              disabled={enviando}
              className="shrink-0 whitespace-nowrap rounded-full bg-[#4F46E5] px-4 py-1.5 text-xs font-bold text-white cursor-pointer disabled:opacity-60"
            >
              {enviando ? 'Entrando…' : 'Entrar ›'}
            </button>
          )}
        </div>
        <p className="mt-1 text-[11px] text-slate-500">Criada em {formatarData(comunidade.dtCriacao)}</p>

        {participa && (
          <button
            type="button"
            onClick={alternarParticipacao}
            disabled={enviando}
            className="mt-3 w-full rounded-full border border-slate-200 py-2 text-xs font-semibold text-slate-500 cursor-pointer disabled:opacity-60"
          >
            {enviando ? 'Saindo…' : 'Sair da comunidade'}
          </button>
        )}

        {erro && (
          <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {erro}
          </p>
        )}
      </section>

      <AdministrarComunidade comunidade={comunidade} />

      {complemento.plano === 'Premium' && (
        <section className="rounded-2xl bg-[#4F46E5] p-4 text-white shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-white/70">
            Painel de impacto da comunidade · desde a criação
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Membros ativos', valor: String(painel.membrosAtivos) },
              { label: 'Ações aprovadas', valor: String(painel.acoesAprovadas) },
              { label: 'CO₂ evitado', valor: `${formatarPontos(painel.co2)} kg` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white px-2 py-2">
                <p className="text-lg font-extrabold text-[#16173A]">{item.valor}</p>
                <p className="text-[10px] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-white/70">
            Demonstração: a postagem da API não tem data, então o painel soma desde a criação, e não só o mês.
          </p>
        </section>
      )}

      <MissoesComunidade comunidade={comunidade} />

      {denunciadas > 0 && (
        <button
          type="button"
          onClick={() => irPara('denuncias')}
          className="flex w-full items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-left cursor-pointer"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-red-600">
            <FiAlertTriangle size={16} /> {denunciadas} publicação(ões) denunciada(s)
          </span>
          <span className="text-xs font-semibold text-red-600">Revisão prioritária →</span>
        </button>
      )}

      <h2 className="pt-1 text-sm font-bold uppercase tracking-wider text-slate-500">Publicações</h2>
      <div className="space-y-3">
        {publicacoes.map((postagem) => (
          <PostagemCard key={postagem.id} postagem={postagem} nomeAutor={nomeDoAutor(postagem.idUsuario)} />
        ))}

        {publicacoes.length === 0 && (
          <p className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            Ainda não há publicações nesta comunidade. Seja a primeira pessoa a registrar uma ação.
          </p>
        )}
      </div>
    </>
  );
}