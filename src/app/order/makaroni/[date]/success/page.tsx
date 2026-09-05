"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaCheckCircle, FaCalendarAlt, FaPepperHot, FaBox } from "react-icons/fa";
import { MessageCircle, Smile } from "lucide-react";

export default function OrderSuccessPage() {
  const params = useParams();
  const routeDate = Array.isArray(params.date) ? params.date[0] : params.date;
  const orderDate = routeDate || "";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil data detail pesanan dari URL query parameter
  const getQueryValue = (key: string, fallback: string) => {
    const value = searchParams.get(key);
    return value ? decodeURIComponent(value) : fallback;
  };

  const orderCode = getQueryValue("code", "#MKO-000");
  const name = getQueryValue("name", "-");
  const size = getQueryValue("size", "-");
  const flavor = getQueryValue("flavor", "-");
  const spicy = getQueryValue("spicy", "-");

  return (
    <div className="min-h-screen bg-slate-50 text-brand-tertiary flex flex-col font-sans">
      <header className="site-nav"><div className="nav-inner">
        <button onClick={() => router.push("/")} className="brand" aria-label="makar-oni home"><span className="brand-mark"><Smile size={30} strokeWidth={2.5} /></span><span className="brand-name">makar-oni</span></button>
        <div className="nav-actions"><a className="button button-outline nav-contact" href="https://wa.me/6281290158831" target="_blank" rel="noreferrer"><MessageCircle size={17} /><span>Contact</span></a><button className="button button-mint" onClick={() => router.push("/")}>Home</button></div>
      </div></header>

      {/* BODY KARTU REKAP DETAIL */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center my-6">
        <div className="bg-white p-6 border-sketch border-2 border-brand-tertiary shadow-[6px_6px_0px_0px_#1E1E1E] space-y-5 relative">
          
          {/* Badge Status Sukses */}
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
              <FaCheckCircle className="text-xl" />
              <span>Pesanan Terdaftar</span>
            </div>
            <span className="text-xs font-black bg-brand-primary text-brand-tertiary px-2.5 py-1 border-sketch-btn border border-brand-tertiary/30">
              {orderDate}
            </span>
          </div>

          <div className="text-center py-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kode Pesanan</span>
            <h1 className="text-3xl font-black text-brand-tertiary bg-brand-secondary/30 py-1 px-4 border-sketch-btn border border-brand-secondary inline-block mt-1">
              {orderCode}
            </h1>
          </div>

          {/* DETAIL LISTING ITEM */}
          <div className="space-y-2.5 text-sm font-semibold bg-slate-50 p-4 border-sketch-alt border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500 text-xs font-bold uppercase">Nama Pemesan</span>
              <span className="font-extrabold text-base text-brand-tertiary">{name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs flex items-center gap-1 font-bold">
                Ukuran (Pack)
              </span>
              <span className="font-black text-brand-tertiary">{size}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs font-bold">Rasa</span>
              <span className="font-black text-emerald-700">{flavor}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs flex items-center gap-1 font-bold">
                Pedas
              </span>
              <span className="font-black text-red-600">{spicy}</span>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 italic">
            Pesanan Anda sudah tercatat dan siap disiapkan <br /> untuk tanggal <span className="font-bold">{orderDate}</span>.
          </p>

          {/* TOMBOL AKSI */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => router.push(`/order/makaroni/${orderDate}`)}
              className="w-full py-3 bg-brand-secondary text-brand-tertiary font-extrabold border-sketch-btn border-2 border-brand-tertiary shadow-[2px_2px_0px_0px_#1E1E1E] hover:opacity-90 transition-all text-sm"
            >
              Pesan Lagi Untuk Tanggal Ini
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold border-sketch-btn border-2 border-transparent hover:border-brand-tertiary transition-all text-xs"
            >
              Kembali ke Halaman Utama
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}