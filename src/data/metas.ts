import type { MetaAtividades, PeriodoMeta } from '../types/types';

export const PERIODOS_META: PeriodoMeta[] = [7, 15, 30];

// Faixas crescentes: dias 1–7 = 1 pt/dia, 8–15 = 2 pts/dia, 16–30 = 3 pts/dia
export const FAIXAS_META = [
  { de: 1, ate: 7, pontosPorDia: 1 },
  { de: 8, ate: 15, pontosPorDia: 2 },
  { de: 16, ate: 30, pontosPorDia: 3 },
];

// Pontos do n-ésimo dia de atividade (n começa em 1)
export const pontosDoDiaMeta = (n: number) => FAIXAS_META.find((f) => n <= f.ate)?.pontosPorDia ?? 3;

// Soma da sequência: ex.: 9 dias = 7×1 + 2×2 = 11
export const pontosSequencia = (dias: number) => {
  let total = 0;
  for (let n = 1; n <= Math.min(dias, 30); n++) total += pontosDoDiaMeta(n);
  return total;
};

// Próxima métrica (7 → 15 → 30); null quando já está na de 30
export const proximaMetrica = (periodo: PeriodoMeta): PeriodoMeta | null => {
  const i = PERIODOS_META.indexOf(periodo);
  return PERIODOS_META[i + 1] ?? null;
};

export const fimDaMeta = (meta: MetaAtividades) => {
  const data = new Date(`${meta.iniciadaEm}T00:00:00`);
  data.setDate(data.getDate() + meta.periodoDias);
  return data;
};

export const diasRestantes = (meta: MetaAtividades) =>
  Math.max(0, Math.ceil((fimDaMeta(meta).getTime() - Date.now()) / 86_400_000));

// Data de hoje no formato do Java (AAAA-MM-DD), no fuso do navegador
export const hojeIso = () => {
  const d = new Date();
  const doisDigitos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;
};