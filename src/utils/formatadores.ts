export const formatarPontos = (valor: number) =>
  valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export const formatarData = (iso: string) => iso.split('-').reverse().join('/');

// Hora de um ISO no fuso do navegador: 2026-10-23T18:30:12.000Z → 15:30:12
export const formatarHora = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR');