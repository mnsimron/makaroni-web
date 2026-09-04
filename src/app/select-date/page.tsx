"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { CalendarDays, Heart, Leaf, MessageCircle, Zap } from "lucide-react";

export default function SelectDatePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    // Format tanggal YYYY-MM-DD ke DD-MM-YYYY
    const [year, month, day] = selectedDate.split("-");
    const formattedDate = `${day}-${month}-${year}`;

    // Navigasi ke form order per tanggal
    router.push(`/order/makaroni/${formattedDate}/guide`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-brand-tertiary flex flex-col font-sans">
      <header className="site-nav"><div className="nav-inner">
        <button onClick={() => router.push("/")} className="brand" aria-label="makar-oni home"><span className="brand-name">makar-oni</span></button>
        <div className="nav-actions"><a className="button button-outline nav-contact" href="https://wa.me/6281290158831" target="_blank" rel="noreferrer"><MessageCircle size={17} /><span>Contact</span></a><button className="button button-mint" onClick={() => router.push("/")}>Home</button></div>
      </div></header>

      <main className="flex-1 w-full px-4 py-8 sm:py-12 flex flex-col justify-center">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-tertiary mb-5 mx-auto w-full max-w-[580px] transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          Kembali ke Beranda
        </button>

        <div className="w-full max-w-[580px] mx-auto bg-white p-5 sm:p-8 rounded-[24px] border-2 border-[#1E1E1E] shadow-[6px_6px_0_#1E1E1E]">
          <div className="flex items-start justify-between gap-4 pb-6 border-b-2 border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#96F2D7] flex items-center justify-center text-[#1E1E1E]">
                <CalendarDays size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-black text-2xl sm:text-3xl text-[#1E1E1E] leading-tight">Buat Kapan?</h1>
                <p className="mt-1 text-sm text-gray-500">Pilih tanggal untuk menikmati makaroni.</p>
              </div>
            </div>
            <span className="shrink-0 bg-[#FFD43B] text-[#1E1E1E] px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider">
              ORDER H-1
            </span>
          </div>

          <form onSubmit={handleDateSubmit} className="pt-6 space-y-6">
            <div>
              <label htmlFor="order-date" className="block text-xs font-black text-[#1E1E1E] tracking-wider mb-2">
                KAPAN MAKAN NYA?
              </label>
              <input
                id="order-date"
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full min-h-14 px-4 rounded-2xl border-2 border-[#1E1E1E] focus:outline-none focus:ring-4 focus:ring-[#96F2D7] text-[#1E1E1E] font-bold bg-slate-50 transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDate}
              className="w-full min-h-14 px-5 bg-[#FFD43B] text-[#1E1E1E] font-black rounded-2xl border-2 border-[#1E1E1E] shadow-[4px_4px_0_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1E1E1E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#1E1E1E] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>Lanjutkan Pemesanan</span>
              <FaArrowRight />
            </button>
          </form>

          <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-center gap-5 text-xs font-semibold text-gray-400">
            <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#1E1E1E]" /> Renyah</span>
            <span className="flex items-center gap-1.5"><Leaf size={14} className="text-[#1E1E1E]" /> Asli Makar-oni</span>
            <span className="flex items-center gap-1.5"><Heart size={14} className="text-[#1E1E1E]" /> Nagih</span>
          </div>
        </div>
      </main>
    </div>
  );
}