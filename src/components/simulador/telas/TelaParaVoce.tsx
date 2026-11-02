import ParaVoce from '../ParaVoce';

export default function TelaParaVoce() {
  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Para você</p>
        <h1 className="text-xl font-bold leading-snug">Sugestões com a sua cara.</h1>
      </div>
      <ParaVoce />
    </>
  );
}