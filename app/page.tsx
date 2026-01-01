"use client";
import Link from "next/link";
import Image from "next/image";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#3A1B4E] text-white selection:bg-[#FFC100] selection:text-[#3A1B4E] overflow-hidden" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-between py-6 px-4 md:py-12 md:px-12 animate-fade">

        {/* Logo Section - Elevado y con mayor escala */}
        <div className="flex flex-col items-center shrink min-h-0 pt-2 md:pt-4">
          <div className="relative h-[25vh] max-h-[280px] min-h-[140px] aspect-square transition-all duration-700 hover:scale-105 ease-out">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Title Section - Espaciado Generoso y Ajuste de Altura */}
        <div className="text-center space-y-3 md:space-y-4 shrink-0 px-2">
          <h1 className="text-[min(11vw,9vh)] sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.8] uppercase text-white transition-all transform-gpu">
            SISTEMA DE<br />
            ELECCIONES
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="h-0.5 w-12 bg-[#FFC100] rounded-full opacity-50" />
            <p className="text-[min(2.5vw,1.6vh)] sm:text-[10px] md:text-xs font-black text-white/40 leading-relaxed tracking-[0.4em] uppercase opacity-90">
              Plataforma Institucional <span className="text-white/70">V2.9.5</span>
            </p>
          </div>
        </div>

        {/* Main Actions - Grid con espaciado promediado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-10 w-full max-w-3xl px-4 shrink-0 mb-4 md:mb-8">
          <Link href="/votar" className="group">
            <div className="h-full bg-white/5 p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 hover:bg-white/15 hover:border-[#FFC100]/40 transition-all duration-500 flex flex-col items-center gap-3 md:gap-6 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FFC100]" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-[#FFC100] rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <LucideVote className="w-6 h-6 md:w-10 md:h-10 text-[#3A1B4E]" />
              </div>
              <div className="space-y-1">
                <span className="block font-black text-xl md:text-3xl tracking-tighter uppercase font-poppins">ENTRAR A VOTAR</span>
                <span className="text-[8px] md:text-xs font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] group-hover:opacity-100 group-hover:text-[#FFC100] transition-all uppercase">SALA PÚBLICA <LucideArrowRight className="w-3 h-3 md:w-4 md:h-4" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group hidden sm:block">
            <div className="h-full bg-white/5 p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 hover:bg-white/15 hover:border-white/30 transition-all duration-500 flex flex-col items-center gap-3 md:gap-6 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-white/20" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                <LucideLayoutDashboard className="w-6 h-6 md:w-10 md:h-10 text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div className="space-y-1 text-white">
                <span className="block font-black text-xl md:text-3xl tracking-tighter uppercase font-poppins">ADMINISTRADOR</span>
                <span className="text-[8px] md:text-xs font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] uppercase group-hover:opacity-100 transition-all">Panel de Control <LucideArrowRight className="w-3 h-3 md:w-4 md:h-4" /></span>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Footer - Sutil y fuera del camino de los botones */}
        <footer className="pb-4 md:pb-6 flex flex-col items-center opacity-10 hover:opacity-100 transition-all duration-700 shrink-0">
          <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[1.5em] text-white/50">Escrutinio Digital Profesional</p>
        </footer>
      </main>
    </div>
  );
}
