import { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { useSimulador } from '../../../hooks/useSimulador';
import {
  ACERTOS_MINIMOS_QUIZ,
  DIAS_INATIVIDADE_MODERADOR,
  LIMITE_MODERACOES_DIA,
  MESES_MINIMOS_MODERADOR,
  QUIZ_MODERADOR,
  TAXA_REJEICAO_MAXIMA,
  dataCadastroUsuarios,
  mesesNaPlataforma,
  taxaRejeicao,
} from '../../../data/moderacao';
import { hojeIso } from '../../../data/metas';
import { mensagemDoErro } from '../../../utils/erros';

type Etapa = 'aviso' | 'requisitos' | 'quiz' | 'resultado';

// Botão de opção: preenchido quando selecionado
const classeOpcao = (ativo: boolean) =>
  `block w-full rounded-2xl border p-3 text-left text-sm font-semibold cursor-pointer ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

const classeBotao = 'w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer disabled:opacity-60';
const classeBotaoSecundario = 'w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold cursor-pointer';

function RegrasCargo() {
  return (
    <div className="rounded-2xl border border-[#4F46E5]/25 bg-[#4F46E5]/5 p-4 text-sm">
      <p className="font-bold">Regras do cargo</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
        <li>Até {LIMITE_MODERACOES_DIA} moderações por dia.</li>
        <li>Perda do cargo após {DIAS_INATIVIDADE_MODERADOR} dias sem moderar.</li>
        <li>Fila global e às cegas: você nunca avalia postagens das suas comunidades.</li>
      </ul>
    </div>
  );
}

export default function TelaCandidatura() {
  const { usuario, postagens, trocarPerfil, irPara, voltar } = useSimulador();
  const [etapa, setEtapa] = useState<Etapa>('aviso');
  const [atual, setAtual] = useState(0); // pergunta atual do questionário
  const [respostas, setRespostas] = useState<number[]>([]);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erroApi, setErroApi] = useState('');

  if (!usuario) return null;

  // ----- Já é moderador -----
  if (usuario.tipoPerfil === 'MODERADOR' && etapa !== 'resultado') {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Candidatura</p>
          <h1 className="text-xl font-bold leading-snug">Você já é moderador da Soul Up.</h1>
        </div>
        <RegrasCargo />
        <button type="button" onClick={() => irPara('moderacao')} className={classeBotao}>
          Ir para a fila
        </button>
      </>
    );
  }

  // ----- Requisitos (a API não guarda a data de cadastro: conta nova conta como hoje) -----
  const meses = mesesNaPlataforma(dataCadastroUsuarios[usuario.id] ?? hojeIso());
  const taxa = taxaRejeicao(usuario.id, postagens);
  const requisitos = [
    {
      ok: meses >= MESES_MINIMOS_MODERADOR,
      titulo: `Pelo menos ${MESES_MINIMOS_MODERADOR} meses na plataforma`,
      detalhe: `Você está há ${meses} ${meses === 1 ? 'mês' : 'meses'} na Soul Up.`,
    },
    {
      ok: taxa < TAXA_REJEICAO_MAXIMA,
      titulo: `Taxa de rejeição abaixo de ${Math.round(TAXA_REJEICAO_MAXIMA * 100)}%`,
      detalhe: `Sua taxa atual é de ${(taxa * 100).toFixed(1).replace('.', ',')}%.`,
    },
  ];
  const elegivel = requisitos.every((r) => r.ok);

  const acertos = respostas.filter((r, i) => r === QUIZ_MODERADOR[i].correta).length;
  const aprovado = acertos >= ACERTOS_MINIMOS_QUIZ;

  const avancar = async () => {
    if (escolha === null) return;
    const novas = [...respostas, escolha];
    setRespostas(novas);
    setEscolha(null);

    if (atual + 1 < QUIZ_MODERADOR.length) {
      setAtual(atual + 1);
      return;
    }

    // Última pergunta: com acertos suficientes, troca o perfil na API
    const total = novas.filter((r, i) => r === QUIZ_MODERADOR[i].correta).length;
    if (total >= ACERTOS_MINIMOS_QUIZ) {
      setErroApi('');
      setEnviando(true);
      try {
        await trocarPerfil('MODERADOR');
      } catch (err) {
        setErroApi(mensagemDoErro(err)); // ex.: 409 do Criador com comunidades
      } finally {
        setEnviando(false);
      }
    }
    setEtapa('resultado');
  };

  const tentarDeNovo = () => {
    setRespostas([]);
    setAtual(0);
    setEscolha(null);
    setErroApi('');
    setEtapa('quiz');
  };

  // ----- Aviso de confidencialidade -----
  if (etapa === 'aviso') {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Antes de começar</p>
          <h1 className="text-xl font-bold leading-snug">Aviso de confidencialidade</h1>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <ul className="list-disc space-y-1.5 pl-5 text-sm">
            <li>Como moderador, você verá postagens sem saber quem é o autor. Não tente identificá-lo.</li>
            <li>Não compartilhe, copie nem divulgue conteúdos ou evidências fora da Soul Up.</li>
            <li>Use os dados apenas para avaliar a ação, seguindo a rubrica e a LGPD.</li>
          </ul>
        </div>
        <div className="space-y-2">
          <button type="button" onClick={() => setEtapa('requisitos')} className={classeBotao}>
            Li e aceito
          </button>
          <button type="button" onClick={voltar} className={classeBotaoSecundario}>
            Agora não
          </button>
        </div>
      </>
    );
  }

  // ----- Requisitos -----
  if (etapa === 'requisitos') {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Etapa 1 de 2 · Requisitos</p>
          <h1 className="text-xl font-bold leading-snug">Antes do teste, confira se você é elegível.</h1>
        </div>

        <div className="space-y-2">
          {requisitos.map((r) => (
            <div key={r.titulo} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                  r.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                }`}
              >
                {r.ok ? <FiCheck size={16} /> : <FiX size={16} />}
              </span>
              <span>
                <span className="block text-sm font-bold">{r.titulo}</span>
                <span className="block text-xs text-slate-500">{r.detalhe}</span>
              </span>
            </div>
          ))}
        </div>

        {elegivel ? (
          <button type="button" onClick={() => setEtapa('quiz')} className={classeBotao}>
            Começar questionário
          </button>
        ) : (
          <>
            <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              Você ainda não cumpre todos os requisitos, então o teste não está liberado. Continue registrando ações e
              volte em breve.
            </p>
            <button type="button" onClick={voltar} className={classeBotaoSecundario}>
              Voltar para configurações
            </button>
          </>
        )}
      </>
    );
  }

  // ----- Questionário -----
  if (etapa === 'quiz') {
    const pergunta = QUIZ_MODERADOR[atual];
    const ultima = atual + 1 === QUIZ_MODERADOR.length;
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">
            Etapa 2 de 2 · Pergunta {atual + 1} de {QUIZ_MODERADOR.length}
          </p>
          <h1 className="text-lg font-bold leading-snug">{pergunta.pergunta}</h1>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#4F46E5] transition-all"
            style={{ width: `${(atual / QUIZ_MODERADOR.length) * 100}%` }}
          />
        </div>

        <div className="space-y-2">
          {pergunta.opcoes.map((opcao, i) => (
            <button
              key={opcao}
              type="button"
              onClick={() => setEscolha(i)}
              aria-pressed={escolha === i}
              className={classeOpcao(escolha === i)}
            >
              {opcao}
            </button>
          ))}
        </div>

        <button type="button" onClick={avancar} disabled={escolha === null || enviando} className={classeBotao}>
          {enviando ? 'Enviando…' : ultima ? 'Ver resultado' : 'Próxima'}
        </button>
      </>
    );
  }

  // ----- Resultado -----
  const virouModerador = aprovado && !erroApi;
  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Resultado</p>
        <h1 className="text-xl font-bold leading-snug">
          {virouModerador
            ? 'Aprovado! Agora você é moderador da Soul Up.'
            : aprovado
              ? 'Você foi aprovado, mas o perfil não pôde ser trocado.'
              : 'Ainda não foi desta vez.'}
        </h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
        Você acertou{' '}
        <strong className="text-[#4F46E5]">
          {acertos} de {QUIZ_MODERADOR.length}
        </strong>
        . São necessários {ACERTOS_MINIMOS_QUIZ} acertos.
      </div>

      {erroApi && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {erroApi}
        </p>
      )}

      <div className="space-y-2">
        {QUIZ_MODERADOR.map((q, i) => {
          const certo = respostas[i] === q.correta;
          return (
            <div key={q.pergunta} className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-bold">
                {i + 1}. {q.pergunta}
              </p>
              <p className={`mt-1 text-xs font-semibold ${certo ? 'text-emerald-700' : 'text-red-600'}`}>
                {certo ? '✓ Acertou' : `✗ Sua resposta: ${q.opcoes[respostas[i]]}`}
              </p>
              {!certo && <p className="text-xs">Correta: {q.opcoes[q.correta]}</p>}
              <p className="mt-1 text-xs text-slate-500">{q.comentario}</p>
            </div>
          );
        })}
      </div>

      {virouModerador ? (
        <>
          <RegrasCargo />
          <button type="button" onClick={() => irPara('moderacao')} className={classeBotao}>
            Ir para a fila de moderação
          </button>
        </>
      ) : aprovado ? (
        <button type="button" onClick={voltar} className={classeBotaoSecundario}>
          Voltar para configurações
        </button>
      ) : (
        <button type="button" onClick={tentarDeNovo} className={classeBotao}>
          Tentar de novo
        </button>
      )}
    </>
  );
}