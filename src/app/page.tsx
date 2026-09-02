"use client";

import { useRouter } from "next/navigation";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { GiCookie } from "react-icons/gi";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-brand-tertiary flex flex-col font-sans">
      {/* NAVBAR HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-tertiary font-bold">
              <GiCookie className="text-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-brand-tertiary leading-none">
                makar-oni
              </span>
              <span className="text-[10px] text-gray-500 font-medium">by.dimsum-dotcom</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6281290158831"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-brand-tertiary text-brand-tertiary hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <FaWhatsapp className="text-lg text-emerald-600" />
              <span className="hidden sm:inline">Contact</span>
            </a>
            <button
              onClick={() => router.push("/select-date")}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-brand-primary text-brand-tertiary hover:opacity-90 transition-all shadow-sm"
            >
              Order Now
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION - TEPAT DI TENGAH (CENTERED) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl my-auto py-12">
          <span className="bg-brand-secondary/30 text-brand-tertiary text-xs font-extrabold px-3 py-1 rounded-full border border-brand-secondary uppercase tracking-wider inline-block mb-4">
            Sistem Pesan H-1 Kantor
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-tertiary tracking-tight mb-4 leading-tight">
            Camilan Gurih & Renyah Siap Kirim Ke Meja Kerja!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-8">
            Pesan hari ini untuk jadwal makan besok. Pilih ukuran, rasa favorit, dan tingkat pedas sesuai selera.
          </p>
          <button
            onClick={() => router.push("/select-date")}
            className="px-8 py-4 bg-brand-secondary text-brand-tertiary font-black rounded-xl border-2 border-brand-tertiary shadow-[4px_4px_0px_0px_#1E1E1E] hover:opacity-90 transition-all inline-flex items-center gap-3 text-base uppercase tracking-wider"
          >
            <span>Pilih Tanggal Pesanan</span>
            <FaArrowRight />
          </button>
        </div>
      </main>
    </div>
  );
}