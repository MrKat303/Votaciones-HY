"use client";
import Link from "next/link";
import Image from "next/image";
import { LucideVote, LucideLayoutDashboard, LucideArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#3A1B4E] text-white p-6 overflow-hidden" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10 animate-fade">

        {/* Header: Logo y Título con armonía mejorada */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative w-48 h-48 md:w-60 md:h-60">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase text-white">
              SISTEMA DE<br />
              ELECCIONES
            </h1>
            <p className="text-xs md:text-sm font-bold text-white/40 max-w-lg mx-auto pt-2 leading-relaxed tracking-[0.2em] uppercase">
              Plataforma de escrutinio institucional <span className="text-white/60">version V2.9</span>
            </p>
          </div>
        </div>

        {/* Acciones Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link href="/votar" className="group">
            <div className="h-full bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center gap-6 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC100]" />
              <div className="w-14 h-14 bg-[#FFC100] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <LucideVote className="w-7 h-7 text-[#3A1B4E]" />
              </div>
              <div className="space-y-1">
                <span className="block font-black text-2xl tracking-tighter uppercase">ENTRAR A VOTAR</span>
                <span className="text-[10px] font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em]">SALA PÚBLICA <LucideArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group hidden md:block">
            <div className="h-full bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-6 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white transition-all">
                <LucideLayoutDashboard className="w-7 h-7 text-white group-hover:text-[#3A1B4E] transition-colors" />
              </div>
              <div className="space-y-1 text-white">
                <span className="block font-black text-2xl tracking-tighter uppercase">ADMINISTRADOR</span>
                <span className="text-[10px] font-black opacity-30 flex items-center justify-center gap-2 tracking-[0.2em] uppercase">Panel de Control <LucideArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>
        </div>

        {/* Separador sutil */}
        <footer className="pt-8 flex flex-col items-center">
          <div className="w-12 h-0.5 bg-white/10 rounded-full" />
        </footer>
      </main>
    </div>
  );
}
