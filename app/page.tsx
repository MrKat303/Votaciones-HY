"use client";
import Link from "next/link";
import Image from "next/image";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#3A1B4E] text-white selection:bg-[#FFC100] selection:text-[#3A1B4E] overflow-hidden" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>

      {/* Contenedor principal sin scroll, todo ajustado a la pantalla */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-center h-full max-h-screen p-4 animate-fade gap-[2vh]">

        {/* Logo Section - Altura dinámica basada en el viewport */}
        <div className="flex flex-col items-center shrink transition-all duration-300">
          <div className="relative h-[20vh] max-h-[220px] aspect-square transition-all duration-500 hover:scale-105">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Title Section - Escalado agresivo para que nunca se coma el espacio */}
        <div className="text-center shrink-0 flex flex-col gap-[1vh]">
          <h1 className="text-[min(10vw,7vh)] sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase text-white transition-all transform-gpu">
            SISTEMA DE<br />
            ELECCIONES
          </h1>
          <div className="flex flex-col items-center gap-1">
            <div className="h-0.5 w-[5vw] max-w-[60px] bg-[#FFC100] rounded-full opacity-60" />
            <p className="text-[min(3vw,1.5vh)] md:text-[10px] font-bold text-white/50 leading-relaxed tracking-[0.4em] uppercase opacity-90">
              Plataforma Institucional <span className="text-white/80">V2.9.6</span>
            </p>
          </div>
        </div>

        {/* Main Actions - Se compactan si falta altura */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2vh] w-full max-w-2xl px-4 shrink transition-all duration-300 h-[30vh] min-h-[160px]">
          <Link href="/votar" className="group h-full">
            <div className="h-full bg-white/5 p-[2vh] rounded-[2rem] border border-white/10 hover:bg-white/15 hover:border-[#FFC100]/40 transition-all duration-300 flex flex-col items-center justify-center gap-[1.5vh] text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC100]" />
              <div className="w-[6vh] h-[6vh] bg-[#FFC100] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <LucideVote className="w-[3vh] h-[3vh] text-[#3A1B4E]" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block font-black text-[min(5vw,3vh)] tracking-tighter uppercase font-poppins leading-tight">ENTRAR A VOTAR</span>
                <span className="text-[min(3vw,1.2vh)] font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] group-hover:opacity-100 group-hover:text-[#FFC100] transition-all uppercase mt-1">SALA PÚBLICA <LucideArrowRight className="w-[1.2vh] h-[1.2vh]" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group hidden sm:block h-full">
            <div className="h-full bg-white/5 p-[2vh] rounded-[2rem] border border-white/5 hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex flex-col items-center justify-center gap-[1.5vh] text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
              <div className="w-[6vh] h-[6vh] bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all">
                <LucideLayoutDashboard className="w-[3vh] h-[3vh] text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block font-black text-[min(5vw,3vh)] tracking-tighter uppercase font-poppins leading-tight">ADMINISTRADOR</span>
                <span className="text-[min(3vw,1.2vh)] font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] uppercase group-hover:opacity-100 transition-all mt-1">Panel de Control <LucideArrowRight className="w-[1.2vh] h-[1.2vh]" /></span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer - Siempre visible al final */}
        <footer className="flex flex-col items-center opacity-40 hover:opacity-100 transition-all duration-300 shrink-0 mt-auto pb-4">
          <p className="text-[min(2.5vw,1vh)] font-bold uppercase tracking-[0.2em] text-white hover:text-[#FFC100] transition-colors cursor-default">Hecho por HiveYoung Labs</p>
        </footer>
      </main>
    </div>
  );
}
