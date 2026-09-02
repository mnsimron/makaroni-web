"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaCheckCircle, FaWhatsapp, FaCalendarAlt, FaPepperHot, FaBox } from "react-icons/fa";
import {GiCookie } from "react-icons/gi";

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function OrderSuccessPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderDate = resolvedParams.date;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil data detail pesanan dari URL query parameter
  const orderCode = searchParams.get("code") || "#MKO-000";
  const name = searchParams.get("name") || "-";
  const size = searchParams.get("size") || "-";
  const flavor = searchParams.get("flavor") || "-";
  const spicy = searchParams.get("spicy") || "-";

  return (
    <div className="min-h-screen bg-slate-50 text-brand-tertiary flex flex-col font-sans">
      {/* NAVBAR HEADER SAMA DENGAN LANDING PAGE */}
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

      {/* BODY KARTU REKAP DETAIL */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center my-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-brand-tertiary shadow-[6px_6px_0px_0px_#1E1E1E] space-y-5 relative">
          
          {/* Badge Status Sukses */}
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
              <FaCheckCircle className="text-xl" />
              <span>Pesanan Terdaftar</span>
            </div>
            <span className="text-xs font-black bg-brand-primary text-brand-tertiary px-2.5 py-1 rounded-full border border-brand-tertiary/30">
              {orderDate}
            </span>
          </div>

          <div className="text-center py-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kode Pesanan</span>
            <h1 className="text-3xl font-black text-brand-tertiary bg-brand-secondary/30 py-1 px-4 rounded-xl border border-brand-secondary inline-block mt-1">
              {orderCode}
            </h1>
          </div>

          {/* DETAIL LISTING ITEM */}
          <div className="space-y-2.5 text-sm font-semibold bg-slate-50 p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500 text-xs font-bold uppercase">Nama Pemesan</span>
              <span className="font-extrabold text-base text-brand-tertiary">{name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs flex items-center gap-1 font-bold">
                <FaBox className="text-brand-tertiary text-xs" /> Ukuran (Pack)
              </span>
              <span className="font-black text-brand-tertiary">{size}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs font-bold">Rasa</span>
              <span className="font-black text-emerald-700">{flavor}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs flex items-center gap-1 font-bold">
                <FaPepperHot className="text-red-500 text-xs" /> Pedas
              </span>
              <span className="font-black text-red-600">{spicy}</span>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 italic">
            Pesanan Anda sudah tercatat di sistem dapur dan siap disiapkan untuk tanggal <span className="font-bold">{orderDate}</span>.
          </p>

          {/* TOMBOL AKSI */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => router.push(`/order/makaroni/${orderDate}`)}
              className="w-full py-3 bg-brand-secondary text-brand-tertiary font-extrabold rounded-xl border-2 border-brand-tertiary shadow-[2px_2px_0px_0px_#1E1E1E] hover:opacity-90 transition-all text-sm"
            >
              Pesan Lagi Untuk Tanggal Ini
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl border-2 border-transparent hover:border-brand-tertiary transition-all text-xs"
            >
              Kembali ke Halaman Utama
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}