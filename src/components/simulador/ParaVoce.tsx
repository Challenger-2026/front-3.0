import { useState } from 'react';
import type { ReactNode } from 'react';
import { FiStar } from 'react-icons/fi';
import type { Missao } from '../../types/types';
import { useSimulador } from '../../hooks/useSimulador';
import { buscarCategoriaPorImpacto, buscarCategoriaPorPontos } from '../../data/categorias';
import {
  complementoDe,
  comunidadesSugeridas,
  duracaoMetaSugerida,
  missoesPorTemas,
  ordenarPorPlano,
  pessoasSugeridas,
} from '../../data/comunidades';
import { momentos, objetivos } from '../../data/onboarding';
import {
  PONTOS_MES_DEMO,
  TOP_DISTINTIVO,
  distintivoDoMesAtual,
  faltamParaTop,
  participantesMes,
} from '../../data/liga';
import { mensagemDoErro } from '../../utils/erros';
import { beneficiosOngPorTemas } from '../../data/beneficios';
import { formatarPontos } from '../../utils/formatadores';
import SelosComunidade from './SelosComunidade';

type ParaVoceProps = {
  compacto?: boolean; // versão do feed: uma sugestão por vez
};

type Secao = { id: string; titulo: string; itens: ReactNode[] };

const classeCard = 'rounded-xl border border-slate-200 p-3';
const classeBotao =
  'mt-3 block w-full rounded-full bg-[#4F46E5] px-4 py-2 text-center text-xs font-bold text-white cursor-pointer disabled:opacity-60';

// Sugestões a partir das respostas do onboarding (temas, momento e objetivo)
export default function ParaVoce({ compacto = false }: ParaVoceProps) {
  const {
    usuario,
    usuarios,
    comunidades,
    postagens,
    minhasComunidades,
    complementos,
    complementosComunidade,
    metas,
    missoes,
    entrarComunidade,
    abrirComunidade,
    seguirSugestao,
    irPara,
    saldoDisponivel,
  } = useSimulador();
  const [expandido, setExpandido] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  if (!usuario) return null;

  const complemento = complementos[usuario.id];
  const interesses = complemento?.interesses ?? [];

  // Sem respostas do onboarding: convite para responder
  if (interesses.length === 0 || !complemento?.momento) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <FiStar size={16} className="text-[#4F46E5]" /> Para você
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Conte seus temas de interesse para receber sugestões de comunidades e missões.
        </p>
        <button
          type="button"
          onClick={() => irPara('onboarding')}
          className="mt-3 w-full rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold cursor-pointer"
        >
          Responder agora
        </button>
      </section>
    );
  }

  const idsMinhas = minhasComunidades.map((c) => c.id);
  const momento = momentos.find((m) => m.id === complemento.momento);
  const objetivo = objetivos.find((o) => o.id === complemento.objetivo);
  const cabecalho = [momento?.label, objetivo?.label, interesses.join(', ')].filter(Boolean).join(', ');

  // Entrar pela sugestão: POST /comunidades/{id}/membros (erro da API aparece no card)
  const executar = async (acao: () => Promise<void>) => {
    setErro('');
    setEnviando(true);
    try {
      await acao();
    } catch (err) {
      setErro(mensagemDoErro(err));
    } finally {
      setEnviando(false);
    }
  };

  // Só membros publicam: quem não participa entra antes de abrir a postagem preenchida
  const registrarMissao = (missao: Missao) =>
    executar(async () => {
      if (!idsMinhas.includes(missao.idComunidade)) await entrarComunidade(missao.idComunidade);
      seguirSugestao({ tela: 'nova-postagem', idComunidade: missao.idComunidade, impacto: missao.impacto, missao: missao.titulo });
    });

  const secoes: Secao[] = [];

  // a) Meta sugerida pelo momento (só para quem ainda não tem meta)
  if (!metas[usuario.id]) {
    const dias = duracaoMetaSugerida(complemento.momento);
    secoes.push({
      id: 'meta',
      titulo: 'Sua meta',
      itens: [
        <div key="meta" className={classeCard}>
          <p className="text-sm font-semibold">Meta sugerida: {dias} dias</p>
          {!compacto && (
            <p className="mt-1 text-xs text-slate-500">
              Pontuação por sequência: 1 pt/dia (dias 1–7), 2 pts/dia (8–15) e 3 pts/dia (16–30).
            </p>
          )}
          <button type="button" onClick={() => seguirSugestao({ tela: 'metas', periodoDias: dias })} className={classeBotao}>
            Começar meta de {dias} dias
          </button>
        </div>,
      ],
    });
  }

  // b) Missões ativas das comunidades nos temas do usuário
  secoes.push({
    id: 'missoes',
    titulo: 'Missões para você',
    itens: missoesPorTemas(interesses, comunidades, complementosComunidade, missoes)
      .slice(0, 3)
      .map((missao) => {
        const categoria = buscarCategoriaPorImpacto(missao.impacto);
        const participa = idsMinhas.includes(missao.idComunidade);
        return (
          <div key={missao.id} className={classeCard}>
            <p className="text-sm font-semibold">{missao.titulo}</p>
            <p className="text-xs text-slate-500">{comunidades.find((c) => c.id === missao.idComunidade)?.nmComunidade}</p>
            {categoria && (
              <span className="mt-2 inline-block rounded-full border border-[#4F46E5]/25 bg-[#4F46E5]/5 px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5]">
                {categoria.nome} · {formatarPontos(categoria.pontosAcao)} pts
              </span>
            )}
            <button type="button" onClick={() => registrarMissao(missao)} disabled={enviando} className={classeBotao}>
              {participa ? 'Registrar ação desta missão' : 'Entrar e registrar ação desta missão'}
            </button>
          </div>
        );
      }),
  });

  // c) Comunidades com temas em comum de que o usuário ainda não participa (Premium em destaque)
  secoes.push({
    id: 'comunidades',
    titulo: 'Comunidades nos seus temas',
    itens: ordenarPorPlano(
      comunidadesSugeridas(interesses, comunidades, idsMinhas, complementosComunidade),
      complementosComunidade,
    )
      .slice(0, 3)
      .map((c) => {
        const temasDela = complementoDe(c.id, complementosComunidade).temas;
        return (
          <div key={c.id} className={classeCard}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => abrirComunidade(c.id)}
                  className="text-left text-sm font-semibold cursor-pointer"
                >
                  {c.nmComunidade}
                </button>
                <p className="text-xs text-slate-500">
                  Temas em comum: {temasDela.filter((t) => interesses.includes(t)).join(', ')}
                </p>
                <div className="mt-2">
                  <SelosComunidade complemento={complementoDe(c.id, complementosComunidade)} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => executar(() => entrarComunidade(c.id))}
                disabled={enviando}
                className="shrink-0 rounded-full bg-[#4F46E5] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
              >
                Entrar
              </button>
            </div>
          </div>
        );
      }),
  });

  if (!compacto) {
    // d) Pessoas com interesses em comum
    secoes.push({
      id: 'pessoas',
      titulo: 'Pessoas com os mesmos temas',
      itens: pessoasSugeridas(interesses, usuarios, complementos, usuario.id)
        .slice(0, 3)
        .map(({ usuario: pessoa, temasEmComum }) => (
          <div key={pessoa.id} className={`${classeCard} flex items-center gap-3`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#4F46E5]/10 text-sm font-bold text-[#4F46E5]">
              {pessoa.nmCompleto.charAt(0)}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{pessoa.nmCompleto}</span>
              <span className="block text-xs text-slate-500">
                @{pessoa.username} · {temasEmComum.join(', ')}
              </span>
            </span>
          </div>
        )),
    });

    // e) Benefícios, para quem escolheu "Acumular pontos e benefícios": ONGs ligadas aos temas (demonstração)
    if (complemento.objetivo === 'pontos') {
      secoes.push({
        id: 'beneficios',
        titulo: 'Benefícios',
        itens: beneficiosOngPorTemas(interesses, comunidades, complementosComunidade)
          .slice(0, 2)
          .map((b) => {
            const falta = Math.max(0, b.custo - saldoDisponivel);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => irPara('beneficios')}
                className={`${classeCard} block w-full text-left cursor-pointer`}
              >
                <span className="block text-sm font-semibold">{b.nome}</span>
                <span className="block text-xs text-slate-500">
                  {b.parceiro} · {formatarPontos(b.custo)} pts ·{' '}
                  {falta === 0 ? 'Você já tem saldo' : `Faltam ${formatarPontos(falta)} pts`}
                </span>
              </button>
            );
          }),
      });
    }

    // f) Impacto, para quem escolheu "Medir meu impacto": CO₂ das aprovadas (API) + distintivo do mês (demonstração)
    if (complemento.objetivo === 'impacto') {
      const co2Evitado = postagens
        .filter((p) => p.idUsuario === usuario.id && p.stValidacao === 'APROVADO')
        .reduce((total, p) => total + (buscarCategoriaPorPontos(p.ptGerado)?.co2Kg ?? 0), 0);
      const distintivo = distintivoDoMesAtual();
      const faltam = faltamParaTop(participantesMes(usuario.username, PONTOS_MES_DEMO));
      secoes.push({
        id: 'impacto',
        titulo: 'Seu impacto',
        itens: [
          <button
            key="impacto"
            type="button"
            onClick={() => irPara('ranking')}
            className={`${classeCard} block w-full text-left cursor-pointer`}
          >
            <span className="block text-sm font-semibold">{formatarPontos(co2Evitado)} kg de CO₂ evitados</span>
            <span className="block text-xs text-slate-500">
              Distintivo do mês: {distintivo.emoji} {distintivo.animal} ·{' '}
              {faltam === 0
                ? `você está no top ${TOP_DISTINTIVO}`
                : `faltam ${formatarPontos(faltam)} pts para o top ${TOP_DISTINTIVO}`}
            </span>
          </button>,
        ],
      });
    }

    // g) Próximo papel no app, pelo momento escolhido
    const papel: ReactNode[] = [];
    if (complemento.momento === 'mobilizador') {
      const ehCriador = usuario.tipoPerfil === 'CRIADOR';
      papel.push(
        <div key="criador" className={classeCard}>
          <p className="text-sm font-semibold">Crie sua comunidade</p>
          <p className="text-xs text-slate-500">Reúna quem já mobiliza com você e publique missões.</p>
          <button
            type="button"
            onClick={() => irPara(ehCriador ? 'criar-comunidade' : 'ajustes')}
            className={classeBotao}
          >
            {ehCriador ? 'Criar comunidade' : 'Virar Criador'}
          </button>
        </div>,
      );
    }
    if (complemento.momento === 'estudante' && usuario.tipoPerfil !== 'MODERADOR') {
      papel.push(
        <div key="moderador" className={classeCard}>
          <p className="text-sm font-semibold">Seja moderador</p>
          <p className="text-xs text-slate-500">Use o que você sabe para validar ações às cegas.</p>
          <button type="button" onClick={() => irPara('candidatura')} className={classeBotao}>
            Fazer o questionário
          </button>
        </div>,
      );
    }
    secoes.push({ id: 'papel', titulo: 'Próximo papel', itens: papel });
  }

  const visiveis = secoes.filter((s) => s.itens.length > 0);
  const compactos = visiveis.flatMap((s) => s.itens).slice(0, 3);

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <FiStar size={16} className="text-[#4F46E5]" /> Para você
        </h2>
        <p className={`text-xs text-slate-500 ${compacto ? 'truncate' : ''}`}>Baseado no que você contou: {cabecalho}.</p>
      </div>

      {compacto ? (
        <>
          <div className="space-y-2">{compactos.slice(0, expandido ? compactos.length : 1)}</div>
          {compactos.length > 1 && (
            <button
              type="button"
              onClick={() => setExpandido((atual) => !atual)}
              className="block w-full text-center text-xs font-semibold text-[#4F46E5] underline cursor-pointer"
            >
              {expandido ? 'Mostrar menos' : `Mostrar mais (${compactos.length - 1})`}
            </button>
          )}
        </>
      ) : (
        visiveis.map((secao) => (
          <div key={secao.id} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{secao.titulo}</h3>
            {secao.itens}
          </div>
        ))
      )}

      {visiveis.length === 0 && (
        <p className="text-sm text-slate-500">
          Ainda não encontramos sugestões para esses temas. Explore as comunidades disponíveis.
        </p>
      )}

      {erro && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erro}
        </p>
      )}

      {compacto && (
        <button
          type="button"
          onClick={() => irPara('para-voce')}
          className="block w-full text-center text-xs font-semibold text-[#4F46E5] underline cursor-pointer"
        >
          Ver todas as sugestões
        </button>
      )}

      <p className="text-center text-[11px] text-slate-500">
          Demonstração: temas, respostas do onboarding, missões, distintivo e benefícios ficam só no front.
      </p>
    </section>
  );
}