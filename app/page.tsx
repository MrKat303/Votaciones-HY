import Link from "next/link";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="full-screen-container cream-bg text-[#3A1B4E] !p-4">
      <div className="max-w-2xl w-full flex flex-col items-center gap-10 animate-fade">

        <div className="text-center space-y-3">
          <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em] block">Sistemas de Gestión de Asamblea</span>
          <h1 className="text-5xl font-black tracking-tighter leading-[0.9]">
            VOTACIONES<br />
            <span className="text-[#6d28d9]">HIVEYOUNG</span>
          </h1>
          <p className="text-sm font-bold opacity-40 max-w-sm mx-auto pt-2 leading-relaxed">
            Plataforma de escrutinio seguro y resultados en tiempo real para votaciones institucionales.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Link href="/votar" className="group">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 text-center border border-[#3A1B4E]/5">
              <div className="w-12 h-12 bg-[#FFC100] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <LucideVote className="w-6 h-6 text-[#3A1B4E]" />
              </div>
              <div>
                <span className="block font-black text-lg">ENTRAR A VOTAR</span>
                <span className="text-[9px] font-bold opacity-30 flex items-center justify-center gap-1">ACCEDER A LA SALA <LucideArrowRight className="w-2 h-2" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group">
            <div className="bg-[#3A1B4E] p-8 rounded-[2rem] shadow-xl hover:shadow-[#3A1B4E]/20 hover:-translate-y-1 transition-all flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                <LucideLayoutDashboard className="w-6 h-6 text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div>
                <span className="block font-black text-white text-lg">ADMINISTRADOR</span>
                <span className="text-[9px] font-bold text-white/30 flex items-center justify-center gap-1">PANEL DE CONTROL <LucideArrowRight className="w-2 h-2" /></span>
              </div>
            </div>
          </Link>
        </div>

        <div className="pt-8 opacity-20 text-[8px] font-black uppercase tracking-[1em]">
          HIVEYOUNG CORE © 2024
        </div>
      </div>
    </div>
  );
}
