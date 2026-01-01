"use client";
import Link from "next/link";
import Image from "next/image";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#3A1B4E] text-white selection:bg-[#FFC100] selection:text-[#3A1B4E] overflow-x-hidden" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-8 md:gap-12 p-6 md:p-12 animate-fade">

        {/* Logo Section - Tamaño optimizado para no empujar el contenido */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 transition-all duration-700 hover:scale-105 drop-shadow-[0_0_30px_rgba(255,193,0,0.15)]">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Title Section - Espaciado armonioso */}
        <div className="text-center space-y-4 md:space-y-6 shrink-0">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-white transition-all transform-gpu">
            SISTEMA DE<br />
            ELECCIONES
          </h1>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-1 bg-[#FFC100] rounded-full opacity-60" />
            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-white/40 leading-relaxed tracking-[0.4em] uppercase">
              Plataforma de escrutinio institucional <span className="text-white/70">version V3.0</span>
            </p>
          </div>
        </div>

        {/* Main Actions - Grid amplio y claro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 w-full max-w-3xl px-4 shrink-0">
          <Link href="/votar" className="group">
            <div className="h-full bg-white/5 p-8 sm:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 hover:bg-white/10 hover:border-[#FFC100]/50 transition-all flex flex-col items-center gap-6 text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#FFC100]" />
              <div className="w-14 h-14 md:w-20 md:h-20 bg-[#FFC100] rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-[0_10px_40px_rgba(255,193,0,0.3)] group-hover:scale-110 transition-transform duration-500">
                <LucideVote className="w-8 h-8 md:w-10 md:h-10 text-[#3A1B4E]" />
              </div>
              <div className="space-y-1">
                <span className="block font-black text-2xl md:text-3xl tracking-tighter uppercase">ENTRAR A VOTAR</span>
                <span className="text-[10px] md:text-xs font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.3em] group-hover:opacity-100 transition-opacity uppercase">SALA PÚBLICA <LucideArrowRight className="w-3 h-3 md:w-4 md:h-4" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group hidden sm:block">
            <div className="h-full bg-white/5 p-8 sm:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 hover:bg-white/10 hover:border-white/30 transition-all flex flex-col items-center gap-6 text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-2 bg-white/20" />
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                <LucideLayoutDashboard className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div className="space-y-1 text-white">
                <span className="block font-black text-2xl md:text-3xl tracking-tighter uppercase">ADMINISTRADOR</span>
                <span className="text-[10px] md:text-xs font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.3em] uppercase group-hover:opacity-100 transition-opacity">Panel de Control <LucideArrowRight className="w-3 h-3 md:w-4 md:h-4" /></span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer - Sólido y con aire al final */}
        <footer className="mt-8 pb-12 flex flex-col items-center opacity-30 hover:opacity-100 transition-opacity">
          <div className="w-16 h-1 bg-white/20 rounded-full mb-6" />
          <p className="text-[10px] font-black uppercase tracking-[1.2em]">Escrutinio Digital</p>
        </footer>

      </main>
    </div>
  );
}
