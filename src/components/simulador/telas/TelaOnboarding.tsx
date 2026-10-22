import { useState } from 'react';
import { useSimulador } from '../../../hooks/useSimulador';
import { momentos, objetivos, temasInteresse, MIN_TEMAS } from '../../../data/onboarding';

const titulos = ['Conta um pouco sobre você.', 'O que você espera da Soul Up?', 'Quais temas te interessam?'];

// Botão de opção: preenchido quando selecionado
const classeOpcao = (ativo: boolean) =>
  `w-full rounded-2xl border p-3 text-left cursor-pointer ${
    ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
  }`;

export default function TelaOnboarding() {
  const { usuario, complementos, salvarComplemento, trocarPara, voltar, podeVoltar } = useSimulador();

  // Se o usuário já respondeu antes (edição pelas Configurações), começa com as respostas dele
  const atual = usuario ? complementos[usuario.id] : undefined;

  const [etapa, setEtapa] = useState(0);
  const [bio, setBio] = useState(atual?.bio ?? '');
  const [momento, setMomento] = useState(atual?.momento ?? '');
  const [objetivo, setObjetivo] = useState(atual?.objetivo ?? '');
  const [interesses, setInteresses] = useState<string[]>(atual?.interesses ?? []);
  const [erro, setErro] = useState('');

  if (!usuario) return null;

  // Depois do cadastro vai para o feed; vindo das Configurações, volta para lá
  const sair = () => (podeVoltar ? voltar() : trocarPara('inicio'));

  const alternarTema = (tema: string) =>
    setInteresses((anteriores) =>
      anteriores.includes(tema) ? anteriores.filter((t) => t !== tema) : [...anteriores, tema],
    );

  const avancar = () => {
    if (etapa === 0 && !momento) return setErro('Escolha a opção que mais combina com você.');
    if (etapa === 1 && !objetivo) return setErro('Escolha seu objetivo principal.');
    if (etapa === 2) {
      if (interesses.length < MIN_TEMAS) return setErro(`Selecione ao menos ${MIN_TEMAS} temas de interesse.`);
      salvarComplemento(usuario.id, { bio: bio.trim(), momento, objetivo, interesses });
      sair();
      return;
    }
    setErro('');
    setEtapa(etapa + 1);
  };

  const etapaAnterior = () => {
    setErro('');
    setEtapa(etapa - 1);
  };

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-[#4F46E5]">Passo {etapa + 1} de 3</p>
        <div className="grid grid-cols-3 gap-2" aria-hidden="true">
          {[0, 1, 2].map((passo) => (
            <span key={passo} className={`h-1.5 rounded-full ${passo <= etapa ? 'bg-[#4F46E5]' : 'bg-slate-200'}`} />
          ))}
        </div>
        <h1 className="pt-1 text-xl font-bold leading-snug">{titulos[etapa]}</h1>
      </div>

      {etapa === 0 && (
        <div className="space-y-2">
          {momentos.map((m) => (
            <button key={m.id} type="button" onClick={() => setMomento(m.id)} className={classeOpcao(momento === m.id)}>
              <span className="block text-sm font-semibold">{m.label}</span>
              <span className={`block text-xs ${momento === m.id ? 'text-white/85' : 'text-slate-500'}`}>{m.texto}</span>
            </button>
          ))}

          <label htmlFor="onb-bio" className="block pt-2 text-xs font-bold">
            Bio (opcional)
          </label>
          <input
            id="onb-bio"
            value={bio}
            maxLength={140}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Composteira em casa e bike todo dia."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5]"
          />
        </div>
      )}

      {etapa === 1 && (
        <div className="space-y-2">
          {objetivos.map((o) => (
            <button key={o.id} type="button" onClick={() => setObjetivo(o.id)} className={classeOpcao(objetivo === o.id)}>
              <span className="block text-sm font-semibold">{o.label}</span>
              <span className={`block text-xs ${objetivo === o.id ? 'text-white/85' : 'text-slate-500'}`}>{o.texto}</span>
            </button>
          ))}
        </div>
      )}

      {etapa === 2 && (
        <div className="flex flex-wrap gap-2">
          {temasInteresse.map((t) => {
            const ativo = interesses.includes(t.label);
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => alternarTema(t.label)}
                aria-pressed={ativo}
                className={`rounded-full border px-3 py-2 text-xs font-semibold cursor-pointer ${
                  ativo ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-200 bg-white'
                }`}
              >
                {t.emoji} {t.label}
              </button>
            );
          })}
        </div>
      )}

      {erro && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {erro}
        </p>
      )}

      <div className="space-y-2">
        <button
          type="button"
          onClick={avancar}
          className="w-full rounded-full bg-[#4F46E5] py-3 text-sm font-bold text-white cursor-pointer"
        >
          {etapa === 2 ? 'Salvar' : 'Continuar'}
        </button>

        {etapa > 0 ? (
          <button type="button" onClick={etapaAnterior} className="block w-full py-2 text-center text-sm font-semibold text-[#4F46E5] cursor-pointer">
            Etapa anterior
          </button>
        ) : (
          <button type="button" onClick={sair} className="block w-full py-2 text-center text-sm font-semibold text-[#4F46E5] underline cursor-pointer">
            Pular por agora
          </button>
        )}
      </div>
    </>
  );
}