import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useSimulador } from '../../../hooks/useSimulador';
import { complementoDe, ordenarPorPlano } from '../../../data/comunidades';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarData } from '../../../utils/formatadores';
import SelosComunidade from '../SelosComunidade';

export default function TelaComunidades() {
  const {
    usuario,
    comunidades,
    minhasComunidades,
    complementosComunidade,
    totalMembros,
    carregarTotaisMembros,
    entrarComunidade,
    abrirComunidade,
    irPara,
  } = useSimulador();
  const [entrando, setEntrando] = useState<number | null>(null);
  const [erro, setErro] = useState('');

 // GET /comunidades/{id}/membros/total só das comunidades que ainda não têm total
  useEffect(() => {
    const buscarTotais = async () => {
      try {
        await carregarTotaisMembros();
      } catch (err) {
        setErro(mensagemDoErro(err));
      }
    };
    buscarTotais();
  }, [carregarTotaisMembros]);

  if (!usuario) return null;

  const idsMinhas = minhasComunidades.map((c) => c.id);

  // Sem try/catch no contexto: o erro da API (ex.: 409 "já é membro") aparece aqui
  const entrar = async (id: number) => {
    setErro('');
    setEntrando(id);
    try {
      await entrarComunidade(id);
    } catch (err) {
      setErro(mensagemDoErro(err));
    } finally {
      setEntrando(null);
    }
  };

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Comunidades</p>
        <h1 className="text-xl font-bold leading-snug">Junte-se a quem cuida do mesmo que você.</h1>
      </div>

      {usuario.tipoPerfil === 'CRIADOR' && (
        <button
          type="button"
          onClick={() => irPara('criar-comunidade')}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
        >
          <FiPlus size={16} /> Criar nova comunidade
        </button>
      )}

      {erro && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erro}
        </p>
      )}

      <div className="space-y-3">
        {ordenarPorPlano(comunidades, complementosComunidade).map((c) => {
          const complemento = complementoDe(c.id, complementosComunidade);
          const total = totalMembros[c.id];
          const participa = idsMinhas.includes(c.id);

          return (
            <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <button type="button" onClick={() => abrirComunidade(c.id)} className="block w-full text-left cursor-pointer">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-base font-bold">{c.nmComunidade}</span>
                  {complemento.plano === 'Premium' && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#4F46E5]">
                      Destaque
                    </span>
                  )}
                </span>
                <span className="mt-1 block">
                  <SelosComunidade complemento={complemento} />
                </span>
                <span className="mt-1 block text-sm text-slate-500">{c.descricao}</span>
                <span className="mt-2 block text-xs font-semibold text-[#4F46E5]">Ver publicações da comunidade →</span>
              </button>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                {total === undefined ? '…' : total} {total === 1 ? 'membro' : 'membros'} · criada em{' '}
                  {formatarData(c.dtCriacao)}
                </span>
                {participa ? (
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Você participa
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => entrar(c.id)}
                    disabled={entrando !== null}
                    className="shrink-0 whitespace-nowrap rounded-full bg-[#4F46E5] px-4 py-1.5 text-xs font-bold text-white cursor-pointer disabled:opacity-60"
                  >
                    {entrando === c.id ? 'Entrando…' : 'Entrar ›'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-slate-500">
        Demonstração: plano Free/Premium e selos ficam só no front (a API não tem esses campos).
      </p>
    </>
  );
}