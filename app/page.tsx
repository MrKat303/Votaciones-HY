import Link from "next/link";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center cream-bg text-[#3A1B4E] p-6 overflow-hidden">

      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#3A1B4E]/5 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#3A1B4E]/5 rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none" />

      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-12 animate-fade">

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#3A1B4E]/5 border border-[#3A1B4E]/10 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gestión de Asamblea Digital</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase">
            Votaciones<br />
            <span className="text-[#6d28d9]">HiveYoung</span>
          </h1>
          <p className="text-sm font-bold opacity-50 max-w-sm mx-auto pt-4 leading-relaxed tracking-tight">
            Plataforma de escrutinio institucional con seguridad de grado militar y resultados en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Link href="/votar" className="group">
            <div className="h-full bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center gap-6 text-center border border-[#3A1B4E]/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC100]" />
              <div className="w-14 h-14 bg-[#FFC100] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <LucideVote className="w-7 h-7 text-[#3A1B4E]" />
              </div>
              <div className="space-y-1">
                <span className="block font-black text-xl">ENTRAR A VOTAR</span>
                <span className="text-[10px] font-bold opacity-30 flex items-center justify-center gap-1.5">SALA PÚBLICA <LucideArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group">
            <div className="h-full bg-[#3A1B4E] p-10 rounded-[2.5rem] shadow-xl hover:shadow-[#3A1B4E]/30 hover:-translate-y-2 transition-all flex flex-col items-center gap-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white transition-all">
                <LucideLayoutDashboard className="w-7 h-7 text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div className="space-y-1 text-white">
                <span className="block font-black text-xl">ADMINISTRADOR</span>
                <span className="text-[10px] font-bold opacity-30 flex items-center justify-center gap-1.5 uppercase">Panel de Control <LucideArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>
        </div>

        <footer className="pt-4 flex flex-col items-center gap-2">
          <div className="w-10 h-1 bg-[#3A1B4E]/10 rounded-full" />
          <p className="opacity-20 text-[8px] font-black uppercase tracking-[0.8em]">
            HiveYoung Secure Core © 2024
          </p>
        </footer>
      </main>
    </div>
  );
}
