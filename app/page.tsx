"use client";
import Link from "next/link";
import Image from "next/image";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#3A1B4E] text-white selection:bg-[#FFC100] selection:text-[#3A1B4E] overflow-hidden" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>

      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-around p-4 sm:p-6 md:p-10 animate-fade">

        {/* Logo Section - Altamente flexible */}
        <div className="flex flex-col items-center shrink min-h-0 mt-4">
          <div className="relative h-[22vh] max-h-[220px] aspect-square transition-all duration-500 hover:scale-105">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Title Section - Escalado dinámico */}
        <div className="text-center space-y-2 shrink-0">
          <h1 className="text-[min(10vw,8vh)] sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] uppercase text-white transition-all">
            SISTEMA DE<br />
            ELECCIONES
          </h1>
          <p className="text-[min(2.5vw,1.5vh)] sm:text-[10px] md:text-xs font-bold text-white/40 leading-relaxed tracking-[0.3em] uppercase opacity-80">
            Plataforma de escrutinio institucional <span className="text-white/70">V2.9.4</span>
          </p>
        </div>

        {/* Main Actions - Grid compacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 w-full max-w-2xl px-2 shrink-0">
          <Link href="/votar" className="group">
            <div className="h-full bg-white/5 p-4 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 hover:border-[#FFC100]/30 transition-all flex flex-col items-center gap-2 md:gap-4 text-center relative overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC100]" />
              <div className="w-10 h-10 md:w-16 md:h-16 bg-[#FFC100] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <LucideVote className="w-5 h-5 md:w-8 md:h-8 text-[#3A1B4E]" />
              </div>
              <div className="space-y-0 text-white">
                <span className="block font-black text-lg md:text-2xl tracking-tighter uppercase">ENTRAR A VOTAR</span>
                <span className="text-[8px] md:text-[10px] font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] group-hover:opacity-60 transition-opacity uppercase">SALA PÚBLICA <LucideArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group">
            <div className="h-full bg-white/5 p-4 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 hover:bg-white/15 hover:border-white/20 transition-all flex flex-col items-center gap-2 md:gap-4 text-center relative overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
              <div className="w-10 h-10 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <LucideLayoutDashboard className="w-5 h-5 md:w-8 md:h-8 text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div className="space-y-0 text-white">
                <span className="block font-black text-lg md:text-2xl tracking-tighter uppercase">ADMINISTRADOR</span>
                <span className="text-[8px] md:text-[10px] font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] uppercase group-hover:opacity-60 transition-opacity">Panel de Control <LucideArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer - Súper compacto */}
        <footer className="flex flex-col items-center opacity-20 shrink-0">
          <div className="w-10 h-0.5 bg-white/50 rounded-full mb-2" />
          <p className="text-[7px] font-black uppercase tracking-[1em]">Escrutinio Digital</p>
        </footer>
      </main>
    </div>
  );
}
