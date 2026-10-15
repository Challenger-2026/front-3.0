import TimelineItem from '../components/TimelineItem';

export interface CardSolucaoItem {
  numero: string;
  titulo: string;
  descricao: string;
}

export interface EtapaRoadmap {
  numero: number;
  titulo: string;
  descricao: string;
}

const cardsSolucao: CardSolucaoItem[] = [
  {
    numero: '01',
    titulo: 'Inovação Incremental',
    descricao:
      'Pegamos mecanismos de recompensas que já funcionam e os adaptamos para a causa ambiental.',
  },
  {
    numero: '02',
    titulo: 'Gamificação Real',
    descricao:
      'Transformamos o "dever" em "prazer" através de ciclos de feedback e reconhecimento social.',
  },
  {
    numero: '03',
    titulo: 'Impacto Tangível',
    descricao:
      'Pontos que se tornam medalhas da fauna e benefícios reais em parceiros ESG.',
  },
  {
    numero: '04',
    titulo: 'Comunidades Parceiras',
    descricao:
      'Criação de comunidades engajadas para uma aproximação com as causas ambientais.',
  },
];

const etapasRoadmap: EtapaRoadmap[] = [
  {
    numero: 1,
    titulo: 'Definição do problema',
    descricao:
      'Buscamos solucionar a lacuna de transformar ações sustentáveis em um sistema de recompensa e desafios com rankeamento, atingindo o usuário e seu ciclo de engajamento, pensando em seus objetivos e motivações.',
  },
  {
    numero: 2,
    titulo: 'Gamificação',
    descricao:
      'Desenvolvemos um Sistema de Gamificação Sustentável integrado à plataforma, impulsionado por um algoritmo inteligente de pontuação. Em vez de valores fixos, o sistema calcula os pontos com base no tipo de atividade, frequência, consistência e impacto real da ação do usuário. Essa métrica alimenta um sistema de rankeamento que converte engajamento ecológico em recompensas tangíveis. A solução ainda promove o ecossistema social através de comunidades moderadas ligadas a ONGs — dando visibilidade às suas causas — e conecta empresas parceiras para a oferta de benefícios diversos.',
  },
  {
    numero: 3,
    titulo: 'Futuro',
    descricao:
      'Iremos integrar com banco de dados para salvar as pontuações dos usuários, desenvolvimento do algoritmo, conexão com APIs de empresas parceiras para o resgate de recompensas tangíveis e implementação no aplicativo mobile nativo da Lobo-guará Tech.',
  },
];

export default function Sobre() {
  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-10 space-y-16">
      {/* Contexto e Problema */}
      <section aria-labelledby="contexto-title" className="space-y-4">
        <div className="relative z-10 inline-block bg-[#fffbed]/90 rounded-2xl px-5 py-3 border border-[#ead9b6]/40 shadow-sm">
          <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block mb-1">
            O Desafio
          </span>
          <h1
            id="contexto-title"
            className="text-2xl sm:text-3xl font-extrabold text-stone-900 pb-1 border-b-2 border-[#D35400] inline-block"
          >
            Contexto e o Problema
          </h1>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed max-w-xl">
            <p>
              Vivemos na era da <strong className="text-stone-900 font-semibold">Sociedade 5.0</strong>, onde a tecnologia deve servir ao bem-estar humano. No entanto, enfrentamos um paradoxo: estamos mais conectados do que nunca, mas desconectados das urgências ambientais do nosso próprio bioma.
            </p>
            <p>
              O grande desafio atual não é apenas a falta de informação, mas a{' '}
              <strong className="text-stone-900 font-semibold">falha no engajamento</strong>. Ações sustentáveis são vistas como tarefas isoladas e cansativas, sem um retorno imediato ou social que motive a constância.
            </p>
          </div>

          <aside
            role="figure"
            aria-label="Estatística: 60% do Cerrado pode desaparecer se não houver inovação na preservação"
            className="bg-[#1C1C1C] text-white p-6 sm:p-8 rounded-2xl w-full md:w-64 flex flex-col items-center justify-center text-center shadow-md shrink-0"
          >
            <span className="text-4xl sm:text-5xl font-black text-[#D35400] tracking-tight mb-2">
              60%
            </span>
            <p className="text-xs sm:text-sm text-stone-300 leading-snug">
              do Cerrado pode desaparecer se não houver inovação na preservação.
            </p>
          </aside>
        </div>
      </section>


      <section aria-labelledby="solucao-title" className="space-y-6">
        <div className="relative z-10 inline-block bg-[#fffbed]/90 rounded-2xl px-5 py-3 border border-[#ead9b6]/40 shadow-sm">
          <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block mb-1">
            Nossa Resposta
          </span>
          <h2
            id="solucao-title"
            className="text-2xl sm:text-3xl font-extrabold text-stone-900 pb-1 border-b-2 border-[#D35400] inline-block"
          >
            A Solução Lobo-guará Tech
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardsSolucao.map((item) => (
            <article
              key={item.numero}
              className="bg-white rounded-2xl p-6 shadow-sm border-b-4 border-[#D35400] border-t border-l border-r border-stone-100 flex flex-col text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-xs font-bold text-[#D35400] bg-orange-50 px-2.5 py-1 rounded-md w-fit mb-4">
                {item.numero}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mb-2">{item.titulo}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{item.descricao}</p>
            </article>
          ))}
        </div>
      </section>

 
      <section aria-labelledby="roadmap-title" className="space-y-6">
        <div className="relative z-10 inline-block bg-[#fffbed]/90 rounded-2xl px-5 py-3 border border-[#ead9b6]/40 shadow-sm">
          <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block mb-1">
            Próximos Passos
          </span>
          <h2
            id="roadmap-title"
            className="text-2xl sm:text-3xl font-extrabold text-stone-900 pb-1 border-b-2 border-[#D35400] inline-block"
          >
            Roadmap de Desenvolvimento
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-[17px] sm:before:left-[21px] before:top-3 before:bottom-3 before:w-[2px] before:bg-stone-200">
          {etapasRoadmap.map((etapa) => (
            <TimelineItem key={etapa.numero} {...etapa} />
          ))}
        </div>
      </section>
    </main>
  );
}