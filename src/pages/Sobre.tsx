import TimelineItem from '../components/TimelineItem';
import Reveal from '../components/Reveal';

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
      'Buscamos solucionar a lacuna de transformar ações sustentáveis em um sistema de recompensa e desafios com rankeamento.',
  },
  {
    numero: 2,
    titulo: 'Gamificação',
    descricao:
      'Desenvolvemos um algoritmo de pontuação baseado no impacto real. A métrica alimenta um rankeamento que converte engajamento em recompensas e conecta parceiros ESG.',
  },
  {
    numero: 3,
    titulo: 'Futuro',
    descricao:
      'Integração com banco de dados, conexão com APIs de empresas parceiras para resgate de benefícios e app mobile.',
  },
];

export default function Sobre() {
  const visuaisDireita = [
    { video: '/video-inovacao.mp4' },
    { video: '/video-gamificacao.mp4' },
    { video: '/video-impacto.mp4' },
    { video: '/video-comunidades.mp4' },
  ];

  return (
    <main className="w-full flex flex-col font-sans space-y-16 py-10 lg:py-14">
      
    
      <section aria-labelledby="contexto-title" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <span className="inline-block text-xs font-extrabold tracking-[0.14em] uppercase text-[#35685b] bg-[#e3efe9] rounded-full px-3 py-1 mb-3">
            Contexto
          </span>
          <h1 id="contexto-title" className="text-3xl sm:text-4xl font-extrabold text-[#a84312]">
            Contexto e o Problema
          </h1>
          <div className="w-24 h-1.5 bg-[#D35400]/40 mt-4 mb-6 rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            <div>
              <div className="bg-[#1C1C1C] text-white p-5 rounded-2xl shadow-sm border border-stone-800">
                <span className="text-4xl font-black text-[#D35400] block mb-1">60%</span>
                <p className="text-stone-200 text-sm font-semibold mb-3 leading-snug">
                  do Cerrado pode desaparecer sem inovação.
                </p>
                <p className="text-xs text-stone-400 border-t border-stone-700 pt-3">
                  Berço das águas do Brasil; impacta bacias de todo o continente sul-americano.
                </p>
              </div>
            </div>

            <div className="h-full rounded-2xl border border-[#e3cfa8] border-l-4 border-l-[#D35400] bg-white p-5 shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
              <h2 className="text-lg font-bold text-stone-900 mb-2">Sociedade 5.0</h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Vivemos na era da Sociedade 5.0, onde a tecnologia deve servir ao bem-estar humano. No entanto, enfrentamos um paradoxo: estamos mais conectados do que nunca, mas desconectados das urgências ambientais do nosso próprio bioma.
              </p>
            </div>
            
            <div className="h-full rounded-2xl border border-[#e3cfa8] border-l-4 border-l-[#D35400] bg-white p-5 shadow-[0_10px_28px_-14px_rgba(120,78,35,0.4)]">
              <h2 className="text-lg font-bold text-stone-900 mb-2">Falha no engajamento</h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                O grande desafio atual não é apenas a falta de informação, mas a falha no engajamento. Ações sustentáveis são vistas como tarefas isoladas e cansativas, sem um retorno imediato ou social que motive a constância.
              </p>
            </div>

          </div>
        </Reveal>
      </section>

  
      <section aria-labelledby="solucao-title" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div>
            <span className="inline-block text-xs font-extrabold tracking-[0.14em] uppercase text-[#35685b] bg-[#e3efe9] rounded-full px-3 py-1 mb-3">
              Solução
            </span>
            <h2 id="solucao-title" className="text-3xl sm:text-4xl font-extrabold text-[#a84312]">
              A Solução Lobo-guará Tech
            </h2>
            <div className="w-24 h-1.5 bg-[#D35400]/40 mt-4 mb-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardsSolucao.map((item, index) => (
              <div 
                key={item.numero} 
                className="bg-white flex flex-col h-full border border-stone-200 rounded-xl overflow-hidden shadow-sm transition-colors hover:border-[#D35400]/50"
              >
                
                <div className="w-full relative">
                  <video
                    src={visuaisDireita[index].video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto block opacity-90"
                  />
                  <div className="absolute top-2 left-2 bg-[#D35400] text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm z-10">
                    {item.numero}
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-grow text-left">
                  <h3 className="text-base font-bold text-stone-900 mb-2">
                    {item.titulo}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

     
      <section aria-labelledby="roadmap-title" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <span className="inline-block text-xs font-extrabold tracking-[0.14em] uppercase text-[#35685b] bg-[#e3efe9] rounded-full px-3 py-1 mb-3">
                Roadmap
              </span>
              <h2 id="roadmap-title" className="text-3xl sm:text-4xl font-extrabold text-[#a84312]">
                Roadmap de Desenvolvimento
              </h2>
              <div className="w-24 h-1.5 bg-[#D35400]/40 mt-4 mb-4 rounded-full"></div>
              <p className="text-sm text-stone-600">
                Os passos fundamentais para a consolidação da plataforma.
              </p>
            </div>
            
            <div className="lg:col-span-8">
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-300">
                {etapasRoadmap.map((etapa) => (
                  <TimelineItem key={etapa.numero} {...etapa} />
                ))}
              </div>
            </div>

          </div>
        </Reveal>
      </section>

    </main>
  );
}