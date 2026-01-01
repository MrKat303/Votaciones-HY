"use client";
import Link from "next/link";
import Image from "next/image";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#3A1B4E] text-white selection:bg-[#FFC100] selection:text-[#3A1B4E] overflow-hidden" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-between py-8 md:py-16 px-6 animate-fade">

        {/* Logo Section - Mayor presencia visual */}
        <div className="flex flex-col items-center shrink min-h-0">
          <div className="relative h-[28vh] max-h-[280px] aspect-square transition-all duration-700 hover:scale-105 drop-shadow-[0_0_30px_rgba(255,193,0,0.1)]">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Title Section - Más aireado */}
        <div className="text-center space-y-4 shrink-0 px-4">
          <h1 className="text-[min(11vw,9vh)] sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-white transition-all transform-gpu">
            SISTEMA DE<br />
            ELECCIONES
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-1 bg-[#FFC100] rounded-full opacity-50" />
            <p className="text-[min(2.8vw,1.6vh)] sm:text-[11px] md:text-sm font-bold text-white/40 leading-relaxed tracking-[0.4em] uppercase">
              Plataforma de escrutinio institucional <span className="text-white/70">V2.9.5</span>
            </p>
          </div>
        </div>

        {/* Main Actions - Espaciado de rejilla optimizado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 w-full max-w-3xl px-2 shrink-0">
          <Link href="/votar" className="group">
            <div className="h-full bg-white/5 p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 hover:bg-white/15 hover:border-[#FFC100]/40 transition-all flex flex-col items-center gap-4 md:gap-6 text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FFC100]" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-[#FFC100] rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(255,193,0,0.2)] group-hover:scale-110 transition-transform duration-500">
                <LucideVote className="w-6 h-6 md:w-10 md:h-10 text-[#3A1B4E]" />
              </div>
              <div className="space-y-1">
                <span className="block font-black text-xl md:text-3xl tracking-tighter uppercase">ENTRAR A VOTAR</span>
                <span className="text-[9px] md:text-xs font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.3em] group-hover:opacity-100 transition-opacity uppercase">SALA PÚBLICA <LucideArrowRight className="w-3 h-3 md:w-4 md:h-4" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group hidden sm:block">
            <div className="h-full bg-white/5 p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 hover:bg-white/15 hover:border-white/20 transition-all flex flex-col items-center gap-4 md:gap-6 text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-white/20" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                <LucideLayoutDashboard className="w-6 h-6 md:w-10 md:h-10 text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div className="space-y-1">
                <span className="block font-black text-xl md:text-3xl tracking-tighter uppercase">ADMINISTRADOR</span>
                <span className="text-[9px] md:text-xs font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.3em] uppercase group-hover:opacity-100 transition-opacity">Panel de Control <LucideArrowRight className="w-3 h-3 md:w-4 md:h-4" /></span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer - Elegant and subtle */}
        <footer className="flex flex-col items-center opacity-30 hover:opacity-100 transition-opacity shrink-0">
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[1.2em] transform-gpu">Escrutinio Digital</p>
        </footer>
      </main>
    </div>
  );
}
