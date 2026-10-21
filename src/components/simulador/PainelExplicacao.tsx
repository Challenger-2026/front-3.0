import { explicacoes } from '../../data/explicacoes';
import { useSimulador } from '../../hooks/useSimulador';
import Botao from '../Botao';

export default function PainelExplicacao() {
  const { telaAtual, reiniciar } = useSimulador();
  const explicacao = explicacoes[telaAtual];

  return (
    <section
      key={telaAtual}
      aria-live="polite"
      className="animate-fade-in rounded-2xl border border-[#ead9b6] bg-[#fffbed]/95 p-6 shadow-[0_15px_35px_rgba(120,78,35,0.1)]"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#35685b]">Você está vendo</p>
      <h2 className="mt-1 text-2xl font-extrabold text-[#a84312]">{explicacao.titulo}</h2>

      <p className="mt-4 text-stone-700 leading-relaxed">{explicacao.descricao}</p>

      <ul className="mt-4 space-y-2">
        {explicacao.destaques.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-stone-700">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#D35400]" />
            {item}
          </li>
        ))}
      </ul>

      {explicacao.proximaAcao && (
        <p className="mt-5 rounded-lg bg-[#f9e8c9] px-4 py-3 text-sm font-semibold text-[#66513c]">
          👉 {explicacao.proximaAcao}
        </p>
      )}

      <Botao variante="secundario" acao={reiniciar} className="mt-6">
        Reiniciar simulação
      </Botao>
    </section>
  );
}