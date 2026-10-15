import { Link } from 'react-router-dom';
import type { IntegranteProps } from '../types/types';
import iconeGithub from '../assets/github.svg';
import iconeLinkedin from '../assets/linkedin.svg';

export default function CardIntegrante({
  nome,
  rm,
  turma,
  foto,
  github,
  linkedin,
}: IntegranteProps) {

  const efeitoOnda =
    "relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-[1] after:pointer-events-none after:rounded-t-[45%] after:bg-amber-400/20 after:translate-y-full after:transition-transform after:duration-500 hover:after:translate-y-[10%] active:after:translate-y-[10%]";

  return (
    <article className="group w-full h-full bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-orange-600 transition-all duration-300 flex flex-col items-center text-center">
   
      <Link
        to={`/integrantes/${rm}`}
        aria-label={`Ver detalhes de ${nome}`}
        className="flex flex-col items-center w-full flex-1 rounded-lg focus-visible:outline-2 focus-visible:outline-orange-600"
      >
        <div className="relative mb-4 shrink-0">
          <img
            src={foto}
            alt={`Foto de ${nome}`}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-stone-100 group-hover:border-orange-600 transition-colors shadow-sm"
          />
        </div>

        <h2
          title={nome}
          className="min-h-14 w-full flex items-center justify-center text-base sm:text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors leading-snug px-1 mb-2"
        >
          {nome}
        </h2>

        <div className="bg-stone-50 rounded-xl py-2 px-4 w-full mb-6 border border-stone-100 space-y-1 text-xs sm:text-sm text-stone-600">
          <p>
            <strong className="text-stone-800">RM:</strong> {rm}
          </p>
          <p>
            <strong className="text-stone-800">Turma:</strong> {turma}
          </p>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-3 w-full mt-auto">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`GitHub de ${nome}`}
          title="GitHub"
          className={`${efeitoOnda} py-2.5 bg-stone-900 hover:bg-black rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center border border-stone-800`}
        >
          <img src={iconeGithub} alt="GitHub" className="w-5 h-5 brightness-0 invert" />
        </a>

        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${nome}`}
          title="LinkedIn"
          className={`${efeitoOnda} py-2.5 bg-[#0A66C2] hover:bg-[#084e96] rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center border border-[#0A66C2]`}
        >
          <img src={iconeLinkedin} alt="LinkedIn" className="w-5 h-5 brightness-0 invert" />
        </a>
      </div>
    </article>
  );
}