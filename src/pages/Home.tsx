import { Link } from 'react-router-dom';
import CardMini, { type CardMiniProps } from '../components/CardMini';

const listaResumo: CardMiniProps[] = [
  {
    icone: '🌿',
    titulo: 'Descrição',
    descricao:
      'O projeto Lobo-guará Tech transforma ações sustentáveis em um sistema de recompensas e desafios com rankeamento. Unindo inovação incremental e disruptiva, conectamos mecanismos já existentes com as lacunas da sustentabilidade — criando uma plataforma de gamificação que torna o engajamento ambiental tangível e motivador.',
  },
  {
    icone: '🎯',
    titulo: 'Objetivo',
    descricao:
      'Colocar o usuário no centro da solução: tornar a sustentabilidade não apenas uma escolha consciente, mas um hábito reforçado por recompensas reais. A plataforma escala o impacto ambiental de forma ágil, transformando o compromisso com o planeta em uma experiência digital recompensadora.',
  },
  {
    icone: '🏆',
    titulo: 'Diferencial',
    descricao:
      'Comunidades ligadas a ONGs focadas em impacto ambiental e um sistema de ranking. Sistema de medalhas mensais inspirado na fauna brasileira, rankeamento entre usuários e ciclos de engajamento personalizados. A identidade do lobo-guará reforça o vínculo entre tecnologia e natureza, criando uma experiência única e com propósito.',
  },
];

export default function Home() {

  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      
      <section aria-labelledby="hero-title" className="text-center max-w-4xl mx-auto mb-20">
        <div className="relative z-10 bg-[#fffbed]/90 rounded-2xl px-6 py-6 md:px-10 md:py-8 border border-[#ead9b6]/40 shadow-sm">
          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-6"
          >
            Tecnologia com rastro de inovação e sustentabilidade
          </h1>

          <p className="text-stone-700 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Transformamos ações sustentáveis em recompensas reais unindo gamificação, tecnologia e hábitos sustentáveis.
          </p>

          <Link
            to="/sobre"
            className={`${efeitoOnda} inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#D35400] hover:bg-[#b84500] text-white font-bold shadow-sm transition-all duration-200 select-none active:scale-95`}
          > Conheça o Projeto</Link>
        </div>
      </section>

      <section aria-labelledby="resumo-title" className="w-full">
        <h2
          id="resumo-title"
          className="text-2xl sm:text-3xl font-bold text-[#D35400] text-center mb-10"
        >
          O Projeto em Resumo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {listaResumo.map((item) => (
            <CardMini key={item.titulo} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
}