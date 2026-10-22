export const formatarPontos = (valor: number) =>
  valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export const formatarData = (iso: string) => iso.split('-').reverse().join('/');