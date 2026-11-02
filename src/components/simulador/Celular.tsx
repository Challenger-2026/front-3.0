import type { ReactNode } from 'react';

type CelularProps = {
  children: ReactNode;
};

export default function Celular({ children }: CelularProps) {
  return (
    <div className="relative mx-auto w-[340px] sm:w-[360px] h-[720px] rounded-[3rem] border-[10px] border-[#16173A] bg-[#16173A] shadow-2xl">
      {/* Câmera / notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 h-6 w-32 rounded-b-2xl bg-[#16173A]" />

      {/* Tela */}
      <div className="h-full w-full overflow-hidden rounded-[2.3rem] bg-[#F8F8FD]">
        {children}
      </div>
    </div>
  );
}