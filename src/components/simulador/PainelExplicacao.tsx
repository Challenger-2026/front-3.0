import { Link } from 'react-router-dom';
import { explicacoes } from '../../data/explicacoes';
import { endpointsDaTela } from '../../data/endpoints';
import { useSimulador } from '../../hooks/useSimulador';
import Botao from '../Botao';

export default function PainelExplicacao() {
  const { telaAtual, reiniciar } = useSimulador();
  const explicacao = explicacoes[telaAtual];
  const endpointsTela = endpointsDaTela(telaAtual);

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

      <div className="mt-5 rounded-lg border border-[#ead9b6] bg-white/70 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#35685b]">
          {endpointsTela.length === 1 ? 'Endpoint desta tela' : 'Endpoints desta tela'}
        </p>
        {endpointsTela.length === 0 ? (
          <p className="mt-1 text-sm text-stone-600">
            Nenhuma chamada própria: a tela usa os dados carregados ao abrir o simulador.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {endpointsTela.map((e) => (
              <li key={`${e.metodo} ${e.rota}`}>
                <p className="font-mono text-xs text-stone-800">
                  <span className="font-bold">{e.metodo}</span> {e.rota}
                </p>
                <p className="text-xs text-stone-600">{e.descricao}</p>
              </li>
            ))}
          </ul>
        )}
        <Link to="/simulador/status" className="mt-2 inline-block text-xs font-semibold text-[#35685b] underline">
          Ver o status da API
        </Link>
      </div>

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