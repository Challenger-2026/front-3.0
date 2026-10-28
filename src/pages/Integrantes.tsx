import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CardIntegrante from '../components/CardIntegrante';
import type { IntegranteProps } from '../types/types';
import Reveal from '../components/Reveal'; 
import { FiCompass, FiTarget, FiHeart, FiX } from 'react-icons/fi';

import foto1 from '../assets/Pic4.png';
import foto2 from '../assets/Pic2.png';
import foto3 from '../assets/Pic1.png';
import foto4 from '../assets/Pic3.png';
import foto5 from '../assets/Pic5.png';

const listaIntegrantes: IntegranteProps[] = [
  {
    nome: 'Ana Carolina Orcelli Bautzer',
    rm: '570281',
    turma: '1TDSPI',
    foto: foto1,
    funcao: 'Líder de Projeto',
    contribuicao: [
      'Gestão e Qualidade: Coordenação do fluxo da equipe, controle de prazos e revisão final de código e conformidade dos artefatos.',
      'Banco de Dados: Modelagem física no Oracle Data Modeler e geração do script DDL com constraints de integridade (PK, FK, CHECK, UNIQUE).',
      'Engenharia de Software: Validação das regras de negócio e suporte na estruturação dos diagramas de casos de uso e atividades.',
    ],
    github: 'https://github.com/anabautzer',
    linkedin: 'https://www.linkedin.com/in/ana-bautzer/',
  },
  {
    nome: 'Eduardo Lima de Souza',
    rm: '570412',
    turma: '1TDSPI',
    foto: foto2,
    funcao: 'Front-End',
    contribuicao: [
      'Arquitetura e SPA: Migração para React, Vite e TypeScript com rotas dinâmicas via React Router.',
      'Interface e Estilo: Componentização modular e layout 100% responsivo com Tailwind CSS.',
      'Formulários e Regras: Validação reativa com React Hook Form tipado e acessibilidade semântica.',
    ],
    github: 'https://github.com/duduutech',
    linkedin: 'https://www.linkedin.com/in/duduulimatech/',
  },
  {
    nome: 'Lucas Costa Serrano',
    rm: '571016',
    turma: '1TDSPI',
    foto: foto3,
    funcao: 'Python',
    contribuicao: [
      'Interface e CRUD: Criação do sistema de menus e submenus interativos para acesso às operações do CRUD.',
      'Estrutura de Dados: Funções modulares documentadas para organização e filtro de dados em listas de dicionários.',
      'Tratamento e Validação: Validação de entradas e tratamento de erros de execução com try, except, else e finally.',
    ],
    github: 'https://github.com/luckz4',
    linkedin: 'https://www.linkedin.com/in/lucas-costa-serrano-647327278/',
  },
  {
    nome: 'Lucas Fortunato Brandão de Pinho',
    rm: '572860',
    turma: '1TDSPI',
    foto: foto4,
    funcao: 'ChatBot e IA',
    contribuicao: [
      'Curadoria do Dataset: Coleta, higienização e estruturação da base de dados tabular aderente ao desafio.',
      'Engenharia de Dados: Mapeamento de atributos de entrada (features), qualidade dos registros e definição do label.',
      'Documentação Técnica: Análise da volumetria, justificativa da origem dos dados e objetivos para o modelo de IA.',
    ],
    github: 'https://github.com/Loutcoun',
    linkedin: 'https://www.linkedin.com/in/lucas-fortunato-317643397/',
  },
  {
    nome: 'Nicolas Rodrigues Martins',
    rm: '573178',
    turma: '1TDSPW',
    foto: foto5,
    funcao: 'Java',
    contribuicao: [
      'Modelagem & OOP: Estruturação das entidades da camada Model com encapsulamento, construtores e métodos de acesso.',
      'Regras de Negócio: Implementação dos métodos principais com a lógica da solução e classe executável de testes.',
      'Persistência & DAO: Configuração da classe de conexão JDBC e operações completas de CRUD na camada DAO.',
    ],
    github: 'https://github.com/NickRM22',
    linkedin: 'https://www.linkedin.com/in/nicolas-rodrigues-martins-126607360/',
  },
];

const valores = [
  {
    icone: FiCompass,
    titulo: 'Propósito',
    texto: 'Unir a inovação tecnológica da Sociedade 5.0 à urgência da preservação ambiental.',
  },
  {
    icone: FiTarget,
    titulo: 'Objetivo',
    texto: 'Transformar hábitos ecológicos do dia a dia em uma experiência engajadora e recompensadora através da gamificação.',
  },
  {
    icone: FiHeart,
    titulo: 'No que acreditamos',
    texto: 'O desenvolvimento de sistemas deve servir ao bem-estar planetário, provando que linhas de código podem proteger nossa biodiversidade e construir um futuro sustentável.',
  },
];

export default function Integrantes() {
  const { rm } = useParams<{ rm?: string }>();
  const navigate = useNavigate();

  const selecionado = listaIntegrantes.find((item) => item.rm === rm);

  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

  useEffect(() => {
    document.title = selecionado
      ? `${selecionado.nome} | Lobo-guará Tech`
      : 'Integrantes | Lobo-guará Tech';
  }, [selecionado]);

  const painelAberto = Boolean(selecionado);

  function fecharPainel() {
    navigate('/integrantes');
  }

  useEffect(() => {
    if (!painelAberto) return;

    const fecharComEsc = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') navigate('/integrantes');
    };

    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [painelAberto, navigate]);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-6 text-center overflow-hidden">
      <section className="grid md:grid-cols-5 gap-8 md:gap-10 items-center text-left mb-12">
        <Reveal className="md:col-span-2">
          <span className="inline-block text-xs font-extrabold tracking-[0.14em] uppercase text-[#35685b] bg-[#e3efe9] rounded-full px-3 py-1 mb-3">
            Quem somos
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#a84312]">Nossa Equipe</h1>
          <div className="w-24 h-1.5 bg-[#D35400]/40 mt-4 mb-4 rounded-full"></div>
          <p className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
            Linhas de código como ferramentas para{' '}
            <span className="text-orange-700">proteger a biodiversidade</span>.
          </p>
        </Reveal>

        <Reveal delay={150} className="md:col-span-3 space-y-4">
          {valores.map(({ icone: Icone, titulo, texto }) => (
            <div key={titulo} className="flex gap-4 bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
              <span className="shrink-0 w-11 h-11 rounded-full bg-orange-100 text-orange-700 grid place-items-center">
                <Icone size={22} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-bold text-stone-900">{titulo}</h2>
                <p className="text-sm text-stone-600 leading-relaxed">{texto}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {rm && !selecionado && (
        <Reveal delay={200}>
          <p role="status" className="mb-6 text-[#a84312] font-semibold">
            Integrante não encontrado. Escolha uma pessoa da equipe abaixo.
          </p>
        </Reveal>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center items-stretch mt-8">
        {listaIntegrantes.map((integrante, index) => (
          <Reveal key={integrante.rm} delay={300 + index * 100} className="w-full h-full flex justify-center">
            <div className="w-full max-w-[220px] h-full flex flex-col transition-transform duration-300 hover:-translate-y-2 rounded-xl">
              <CardIntegrante
                nome={integrante.nome}
                rm={integrante.rm}
                turma={integrante.turma}
                foto={integrante.foto}
                github={integrante.github}
                linkedin={integrante.linkedin}
              />
            </div>
          </Reveal>
        ))}
      </div>
      {selecionado && (
        <div className="fixed inset-0 z-[60]">
          <div
            onClick={fecharPainel}
            className="absolute inset-0 bg-stone-900/30 animate-fundo"
            aria-hidden="true"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Informações de ${selecionado.nome}`}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl p-6 sm:p-8 overflow-y-auto text-left animate-painel"
          >
            <button
              type="button"
              onClick={fecharPainel}
              aria-label="Fechar"
              className="absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center text-stone-500 hover:bg-stone-100 transition-colors"
            >
              <FiX size={20} aria-hidden="true" />
            </button>

            <span className="text-xs font-bold text-[#a84312] uppercase tracking-widest">
              Integrante
            </span>

            <div className="flex items-center gap-4 mt-5">
              <img
                src={selecionado.foto}
                alt={`Foto de ${selecionado.nome}`}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-100 shrink-0"
              />
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 leading-snug">{selecionado.nome}</h2>
                <span className="inline-block text-xs font-semibold bg-orange-100 text-orange-800 px-3 py-1 rounded-full mt-1">
                  {selecionado.funcao || 'Membro do Projeto'}
                </span>
                <p className="text-xs text-stone-500 mt-2">
                  RM {selecionado.rm} &middot; {selecionado.turma}
                </p>
              </div>
            </div>

            {selecionado.contribuicao && (
              <div className="mt-6">
                <h3 className="text-xs font-bold tracking-widest text-[#2F5D50] uppercase mb-3">
                  Contribuição no projeto
                </h3>
                <ul className="space-y-3">
                  {selecionado.contribuicao.map((item) => {
                    const [titulo, ...resto] = item.split(': ');
                    return (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 shrink-0" aria-hidden="true" />
                        <p className="text-sm text-stone-700">
                          <strong className="text-stone-900">{titulo}:</strong> {resto.join(': ')}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-6">
              <a
                href={selecionado.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub de ${selecionado.nome}`}
                className={`${efeitoOnda} py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-sm font-semibold text-center transition-colors duration-200`}
              >
                GitHub
              </a>
              <a
                href={selecionado.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn de ${selecionado.nome}`}
                className={`${efeitoOnda} py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-sm font-semibold text-center transition-colors duration-200`}
              >
                LinkedIn
              </a>
            </div>

            <p className="text-xs text-stone-500 mt-8">Outros integrantes:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {listaIntegrantes.map((integrante) => {
                const ativo = integrante.rm === selecionado.rm;
                return (
                  <Link
                    key={integrante.rm}
                    to={`/integrantes/${integrante.rm}`}
                    replace
                    title={integrante.nome}
                    aria-label={`Ver ${integrante.nome}`}
                    aria-current={ativo ? 'true' : undefined}
                    className={`rounded-full transition ${
                      ativo ? 'ring-2 ring-orange-600' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={integrante.foto}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </main>
    
  );
}