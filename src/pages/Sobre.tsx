import { useState, useEffect, useRef } from 'react';
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
  const [progressoScroll, setProgressoScroll] = useState(0);
  const [itemAtivo, setItemAtivo] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const atualizarProgresso = () => {
      const scrollAtual = window.scrollY;
      const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
      
      if (alturaTotal > 0) {
        const porcentagem = (scrollAtual / alturaTotal) * 100;
        setProgressoScroll(porcentagem);
      } else {
        setProgressoScroll(0);
      }
    };

    window.addEventListener('scroll', atualizarProgresso);
    atualizarProgresso();

    return () => window.removeEventListener('scroll', atualizarProgresso);
  }, []);

  useEffect(() => {
    const lidarComScrollPin = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const distanciaRolavel = height - windowHeight;
      let progresso = -top / distanciaRolavel;
      
      progresso = Math.max(0, Math.min(1, progresso));
      
      let index = Math.floor(progresso * cardsSolucao.length);
      if (index === cardsSolucao.length) index = cardsSolucao.length - 1;
      
      setItemAtivo(index);
    };

    window.addEventListener('scroll', lidarComScrollPin);
    return () => window.removeEventListener('scroll', lidarComScrollPin);
  }, []);

  const visuaisDireita = [
    { video: '/video-inovacao.mp4', bg: 'bg-orange-100' },
    { video: '/video-gamificacao.mp4', bg: 'bg-amber-100' },
    { video: '/video-impacto.mp4', bg: 'bg-emerald-100' },
    { video: '/video-comunidades.mp4', bg: 'bg-blue-100' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1.5 bg-transparent z-[100] pointer-events-none">
        <div 
          className="h-full bg-[#D35400] transition-all duration-150 ease-out rounded-r-full shadow-[0_0_10px_rgba(211,84,0,0.5)]"
          style={{ width: `${progressoScroll}%` }}
        ></div>
      </div>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 relative">
        
        <section aria-labelledby="contexto-title" className="space-y-8">
          
          <Reveal>
            <div className="inline-block bg-white rounded-xl px-5 py-2.5 border border-[#ead9b6]/60 shadow-sm">
              <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block">
                O Desafio
              </span>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={100}>
              <h1
                id="contexto-title"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight"
              >
                Contexto e o <span className="text-[#D35400]">Problema</span>
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <div className="w-20 h-1.5 bg-[#D35400]/40 rounded-full"></div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            <Reveal delay={200} className="md:col-span-7 flex">
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#ead9b6]/50 flex flex-col justify-center space-y-6 w-full">
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                  Vivemos na era da <strong className="text-stone-900 font-semibold">Sociedade 5.0</strong>, onde a tecnologia deve servir ao bem-estar humano. No entanto, enfrentamos um paradoxo: estamos mais conectados do que nunca, mas desconectados das urgências ambientais do nosso próprio bioma.
                </p>
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                  O grande desafio atual não é apenas a falta de informação, mas a{' '}
                  <strong className="text-stone-900 font-semibold">falha no engajamento</strong>. Ações sustentáveis são vistas como tarefas isoladas e cansativas, sem um retorno imediato ou social que motive a constância.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300} className="md:col-span-5 flex">
              <aside
                role="figure"
                aria-label="Estatística: 60% do Cerrado pode desaparecer se não houver inovação na preservação"
                className="group bg-[#1C1C1C] text-white p-8 sm:p-10 rounded-3xl flex flex-col items-center justify-center text-center shadow-md w-full transition-all duration-300 hover:shadow-xl border border-stone-800"
              >
                <span className="text-5xl sm:text-6xl font-black text-[#D35400] tracking-tight mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                  60%
                </span>
                <p className="text-sm sm:text-base text-stone-200 leading-snug font-medium mb-4">
                  do Cerrado pode desaparecer se não houver inovação na preservação.
                </p>
                
                <div className="border-t border-stone-800 pt-4 text-left w-full">
                  <p className="text-xs sm:text-sm text-orange-200 leading-relaxed">
                    <strong className="text-white block mb-1">Curiosidade:</strong> 
                    O Cerrado é o "berço das águas" do Brasil. A sua destruição impacta bacias hidrográficas de todo o continente sul-americano.
                  </p>
                </div>
              </aside>
            </Reveal>

          </div>
        </section>

        <section ref={containerRef} aria-labelledby="solucao-title" className="relative w-full h-[300vh] pt-10">
          <div className="sticky top-0 w-full h-screen flex flex-col justify-center overflow-hidden">
            
            <Reveal>
              <div className="inline-block bg-white rounded-xl px-5 py-2.5 border border-[#ead9b6]/60 shadow-sm mb-8">
                <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block">
                  Nossa Resposta
                </span>
              </div>
              <h2
                id="solucao-title"
                className="text-3xl sm:text-4xl font-black text-stone-900 mb-12"
              >
                A Solução <span className="text-[#D35400]">Lobo-guará Tech</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              
              <div className="flex flex-col gap-6 justify-center">
                {cardsSolucao.map((item, index) => (
                  <div key={item.numero} className="flex flex-col items-start transition-all duration-700 ease-in-out">
                    
                    <h3 
                      className={`font-extrabold tracking-tight transition-all duration-500 cursor-pointer flex items-center gap-3 ${
                        itemAtivo === index 
                          ? 'text-2xl sm:text-3xl text-[#D35400] scale-100 origin-left' 
                          : 'text-xl sm:text-2xl text-stone-400 scale-95 origin-left hover:text-stone-500'
                      }`}
                      onClick={() => {
                        if(containerRef.current) {
                          const scrollStep = (containerRef.current.scrollHeight - window.innerHeight) / cardsSolucao.length;
                          window.scrollTo({
                            top: containerRef.current.offsetTop + (scrollStep * index) + 10,
                            behavior: 'smooth'
                          });
                        }
                      }}
                    >
                      <span className={`text-sm px-2.5 py-1 rounded-lg ${itemAtivo === index ? 'bg-orange-100 text-[#D35400]' : 'bg-stone-100 text-stone-400'}`}>
                        {item.numero}
                      </span>
                      {item.titulo}
                    </h3>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                        itemAtivo === index ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 mt-0 opacity-0'
                      }`}
                    >
                      <p className="text-stone-600 text-sm sm:text-base leading-relaxed pl-12 max-w-md">
                        {item.descricao}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

              <div className="hidden lg:flex justify-center items-center h-[55vh]">
                <div className="relative w-full max-w-md h-full rounded-3xl bg-white border border-[#ead9b6]/60 shadow-xl overflow-hidden p-3">
                  
                  {visuaisDireita.map((visual, index) => (
                    <div 
                      key={index}
                      className={`absolute inset-3 rounded-2xl overflow-hidden transition-opacity duration-1000 ease-in-out ${
                        itemAtivo === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <video
                        src={visual.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 mix-blend-multiply opacity-20 ${visual.bg}`}></div>
                    </div>
                  ))}

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-stone-300/60 rounded-full z-20"></div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section aria-labelledby="roadmap-title" className="space-y-8 pt-12">
          <Reveal>
            <div className="inline-block bg-white rounded-xl px-5 py-2.5 border border-[#ead9b6]/60 shadow-sm mb-2">
              <span className="text-xs font-bold tracking-widest text-[#D35400] uppercase block">
                Próximos Passos
              </span>
            </div>
            <h2
              id="roadmap-title"
              className="text-3xl sm:text-4xl font-black text-stone-900 mb-8"
            >
              Roadmap de <span className="text-[#D35400]">Desenvolvimento</span>
            </h2>
          </Reveal>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-[17px] sm:before:left-[21px] before:top-3 before:bottom-3 before:w-[2px] before:bg-stone-200">
            {etapasRoadmap.map((etapa, index) => (
              <Reveal key={etapa.numero} delay={200 + index * 150}>
                <TimelineItem {...etapa} />
              </Reveal>
            ))}
          </div>
        </section>
        
      </main>
    </>
  );
}