import type { ErroApi, ErroComStatus, MetodoRequisicao, OpcoesRequisicao, RegistroRequisicao } from '../types/types';

// ----- Para onde vão as chamadas -----
const JSON_SERVER_URL = 'http://localhost:5000';
export const BASE_URL = import.meta.env.VITE_API_URL ?? JSON_SERVER_URL;

// Apontando para a porta 5000, o front está usando o json-server (db.json)
export const USANDO_JSON_SERVER = BASE_URL === JSON_SERVER_URL;

// API Python (Flask) com o modelo de IA de risco de abandono, publicada no Render
export const IA_URL = import.meta.env.VITE_API_IA_URL ?? 'https://lobo-guara-ia.onrender.com';

const HEADERS_JSON = { 'Content-Type': 'application/json' };

// Erro com a mensagem e o status da API (a tela usa o status, ex.: 403 na fila de moderação)
export const erroDaApi = (mensagem: string, status: number): ErroComStatus => Object.assign(new Error(mensagem), { status });

// ----- Registro das chamadas (usado depois pelo painel de requisições ao vivo) -----

// Nunca aparecem no registro: o login do json-server manda a senha na URL
const PARAMETROS_SENSIVEIS = ['senha', 'cpf', 'email'];

// Tira os valores sensíveis da rota: /usuarios?username=ana&senha=123 → /usuarios?username=ana&senha=***
const rotaSegura = (caminho: string) => {
  const [rota, consulta] = caminho.split('?');
  if (!consulta) return rota;
  const parametros = consulta.split('&').map((par) => {
    const [nome] = par.split('=');
    return PARAMETROS_SENSIVEIS.includes(nome) ? `${nome}=***` : par;
  });
  return `${rota}?${parametros.join('&')}`;
};

type OuvinteRequisicao = (registro: RegistroRequisicao) => void;

// Quem quer saber de cada chamada (na etapa 2, o contexto do painel)
let ouvintes: OuvinteRequisicao[] = [];
let proximoId = 1;

// Começa a ouvir; devolve a função que para de ouvir (para o retorno do useEffect)
export const ouvirRequisicoes = (ouvinte: OuvinteRequisicao) => {
  ouvintes = [...ouvintes, ouvinte];
  return () => {
    ouvintes = ouvintes.filter((o) => o !== ouvinte);
  };
};

const registrar = (dados: Omit<RegistroRequisicao, 'id'>) => {
  const registro: RegistroRequisicao = { id: proximoId++, ...dados };
  ouvintes.forEach((ouvinte) => ouvinte(registro));
};

// ----- A única função que chama o fetch -----
// Faz a chamada, mede o tempo, registra e trata a resposta como o tratarResposta fazia:
// erro → repassa a mensagem "erro" da API Java; 204 ou 201 sem corpo → undefined
export const requisitar = async <T>(metodo: MetodoRequisicao, caminho: string, opcoes: OpcoesRequisicao): Promise<T> => {
  const inicio = Date.now();
  const base = {
    metodo,
    rota: rotaSegura(caminho),
    horario: new Date(inicio).toISOString(),
    // no modo json-server, toda chamada só imita o Java (a linha que vale é a simulada); os feedbacks e a IA são a exceção
    apoio: opcoes.api !== 'ia' && USANDO_JSON_SERVER && !opcoes.soJsonServer,
    simulado: false,
    api: opcoes.api ?? 'java',
  };

  let response: Response;
  try {
    response = await fetch(
      `${opcoes.api === 'ia' ? IA_URL : BASE_URL}${caminho}`,
      opcoes.corpo === undefined
        ? { method: metodo }
        : { method: metodo, headers: HEADERS_JSON, body: JSON.stringify(opcoes.corpo) },
    );
  } catch (err) {
    // TypeError do fetch: o mensagemDoErro (utils/erros.ts) mostra "Não foi possível conectar…"
    registrar({ ...base, status: null, tempoMs: Date.now() - inicio, erro: 'Sem resposta da API' });
    throw err;
  }

  const tempoMs = Date.now() - inicio;

  if (!response.ok) {
    let mensagem = opcoes.mensagemErro;
    try {
      const corpo: ErroApi = await response.json();
      if (corpo.erro) mensagem = corpo.erro;
    } catch {
      // resposta sem JSON: fica a mensagem padrão
    }
    registrar({ ...base, status: response.status, tempoMs, erro: mensagem });
    throw erroDaApi(mensagem, response.status);
  }

  registrar({ ...base, status: response.status, tempoMs });

  if (response.status === 204) return undefined as T; // 204 No Content: sem corpo (DELETE)
  // 201 sem corpo (ex.: entrar na comunidade): lê como texto antes de converter
  const texto = await response.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
};

// ----- Linha "como o Java responderia" (só no modo json-server) -----

// Status de sucesso de cada método nos controllers do Java (@ResponseStatus)
const STATUS_SUCESSO_JAVA: Record<MetodoRequisicao, number> = { GET: 200, POST: 201, PUT: 200, PATCH: 200, DELETE: 204 };

// Roda a função do api.ts e registra uma linha com o endpoint real do Java, o status e o tempo total.
// Se a regra imitada falhar (ex.: 403, 404, 409), a linha sai com esse status.
// Com a API Java ligada, só roda a função: as linhas são as chamadas reais.
export const simularJava = async <T>(
  metodo: MetodoRequisicao,
  rotaJava: string,
  executar: () => Promise<T>,
  statusSucesso = STATUS_SUCESSO_JAVA[metodo], // o login é POST mas devolve 200
): Promise<T> => {
  if (!USANDO_JSON_SERVER) return executar();

  const inicio = Date.now();
  const base = {
    metodo,
    rota: rotaSegura(rotaJava),
    horario: new Date(inicio).toISOString(),
    apoio: false,
    simulado: true,
    api: 'java' as const,
  };

  try {
    const resultado = await executar();
    registrar({ ...base, status: statusSucesso, tempoMs: Date.now() - inicio });
    return resultado;
  } catch (err) {
    // TypeError do fetch: o json-server não respondeu
    const semResposta = err instanceof TypeError;
    registrar({
      ...base,
      status: semResposta ? null : ((err as ErroComStatus).status ?? null),
      tempoMs: Date.now() - inicio,
      erro: semResposta ? 'Sem resposta da API' : (err as Error).message,
    });
    throw err;
  }
};