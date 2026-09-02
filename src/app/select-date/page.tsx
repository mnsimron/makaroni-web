"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp, FaCalendarAlt, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { GiCookie } from "react-icons/gi";

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
    router.push(`/order/makaroni/${formattedDate}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-brand-tertiary flex flex-col font-sans">
      {/* NAVBAR HEADER (SAMA DENGAN HOME) */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo Kiri */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
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

          {/* Button Kanan */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-brand-tertiary text-brand-tertiary hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <FaWhatsapp className="text-lg text-emerald-600" />
              <span className="hidden sm:inline">Contact</span>
            </a>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-brand-primary text-brand-tertiary hover:opacity-90 transition-all shadow-sm"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* BODY SELECTION PAGE */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center my-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-tertiary mb-4 self-start"
        >
          <FaArrowLeft /> Kembali ke Beranda
        </button>

        <div className="bg-white p-6 rounded-2xl border-2 border-brand-tertiary shadow-[6px_6px_0px_0px_#1E1E1E] space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-brand-tertiary">
              <FaCalendarAlt className="text-2xl" />
            </div>
            <div>
              <h1 className="font-black text-xl text-brand-tertiary">Jadwal Pengiriman</h1>
              <p className="text-xs text-gray-500">Pilih tanggal Anda ingin menikmati makaroni</p>
            </div>
          </div>

          <form onSubmit={handleDateSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-brand-tertiary uppercase mb-2">
                Pilih Tanggal Makan (H-1)
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3.5 rounded-xl border-2 border-brand-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-tertiary font-bold text-sm bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-secondary text-brand-tertiary font-black rounded-xl border-2 border-brand-tertiary shadow-[3px_3px_0px_0px_#1E1E1E] hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <span>Lanjutkan Pemesanan</span>
              <FaArrowRight />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}