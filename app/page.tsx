"use client";
import Link from "next/link";
import Image from "next/image";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#3A1B4E] text-white selection:bg-[#FFC100] selection:text-[#3A1B4E] overflow-y-auto" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>

      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-6 md:p-12 animate-fade py-10 md:py-20">

        {/* Header Section - Dinámico y adaptable */}
        <div className="flex flex-col items-center gap-4 md:gap-8 text-center w-full">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 transition-all duration-500 hover:scale-105 shrink-0">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-3 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-white transform-gpu transition-all">
              SISTEMA DE<br />
              ELECCIONES
            </h1>
            <p className="text-[9px] sm:text-[10px] md:text-sm font-bold text-white/40 max-w-lg mx-auto leading-relaxed tracking-[0.3em] uppercase opacity-80">
              Plataforma de escrutinio institucional <span className="text-white/70 block sm:inline">V2.9.3</span>
            </p>
          </div>
        </div>

        {/* Acciones Principales - Grid responsivo que no se corta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl px-4 mt-8 md:mt-16">
          <Link href="/votar" className="group">
            <div className="h-full bg-white/5 p-6 sm:p-8 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-white/10 hover:bg-white/15 hover:border-[#FFC100]/30 transition-all flex flex-col items-center gap-4 md:gap-8 text-center relative overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FFC100]" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-[#FFC100] rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <LucideVote className="w-6 h-6 md:w-10 md:h-10 text-[#3A1B4E]" />
              </div>
              <div className="space-y-1 md:space-y-2 text-white">
                <span className="block font-black text-xl md:text-3xl tracking-tighter uppercase">ENTRAR A VOTAR</span>
                <span className="text-[10px] md:text-xs font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] group-hover:opacity-60 transition-opacity uppercase text-center">SALA PÚBLICA <LucideArrowRight className="w-3 md:w-4 h-3 md:h-4" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group hidden sm:block">
            <div className="h-full bg-white/5 p-6 sm:p-8 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-white/5 hover:bg-white/15 hover:border-white/20 transition-all flex flex-col items-center gap-4 md:gap-8 text-center relative overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-white/20" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <LucideLayoutDashboard className="w-6 h-6 md:w-10 md:h-10 text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div className="space-y-1 md:space-y-2 text-white">
                <span className="block font-black text-xl md:text-3xl tracking-tighter uppercase">ADMINISTRADOR</span>
                <span className="text-[10px] md:text-xs font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] uppercase group-hover:opacity-60 transition-opacity text-center">Panel de Control <LucideArrowRight className="w-3 md:w-4 h-3 md:h-4" /></span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Minimalista - Estructura de pie de página real */}
        <footer className="w-full pt-12 pb-10 flex flex-col items-center opacity-20 hover:opacity-100 transition-opacity group">
          <div className="w-12 h-0.5 bg-white/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[1em]">Escrutinio Digital</p>
            <p className="text-[7px] font-bold text-white/50 uppercase tracking-[0.2em]">SISTEMA DE ELECCIONES V2.9.3</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
