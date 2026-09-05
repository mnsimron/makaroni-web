"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Box, ChevronLeft, Flame, Package } from "lucide-react";

const portionOptions = [
  { name: "Kecil", price: "5K", weight: "± 50 gram", image: "/images/kecil.png" },
  { name: "Sedang", price: "8K", weight: "± 80 gram", image: "/images/sedang.png", recommended: true },
  { name: "Aduh Besar", price: "15K", weight: "± 150 gram", image: "/images/aduh-besar.png" },
];

const spiceOptions = [
  { name: "DIKIT", amount: "1 Scoop", description: "Pedas ringan, tetap nyaman dinikmati.", scoops: 1 },
  { name: "SEDANG", amount: "2 Scoops", description: "Pedas seimbang, bikin makin nagih.", scoops: 2 },
  { name: "ADUH PEDAS", amount: "4 Scoops", description: "Untuk pencinta pedas sejati.", scoops: 4, hot: true },
];

export default function GuidePage() {
  const router = useRouter();
  const params = useParams<{ date: string }>();
  const orderDate = params?.date;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#1E1E1E] font-sans">
      <header className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-tertiary"
          >
            <ChevronLeft size={15} /> Kembali
          </button>
          <span className="text-xs font-black bg-brand-primary text-brand-tertiary px-2.5 py-1 border-sketch-btn">
            Pesanan: {orderDate}
          </span>
        </div>
      </header>

      <main className="w-full px-4 py-10 sm:px-6 sm:py-14">
        <section className="mx-auto max-w-[1160px]">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex border-sketch-btn bg-[#FFD43B] px-4 py-2 text-xs font-black tracking-widest">
              STEP 1 OF 2
            </span>
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
              Panduan Porsi &amp; Level Pedas
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Kenali ukuran dan level pedas favoritmu sebelum lanjut pesan.
            </p>
          </div>

          <section className="mt-10 border-sketch border-[3px] border-[#1E1E1E] bg-white p-5 shadow-[6px_6px_0_#1E1E1E] sm:mt-14 sm:p-8">
            <div className="flex items-start gap-4 border-b-2 border-slate-100 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border-sketch-alt bg-[#96F2D7]">
                <Package size={25} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black sm:text-2xl">PILIHAN UKURAN</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Pilih porsi yang paling pas untuk menemani waktu santaimu di kantor.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {portionOptions.map((portion) => (
                <article
                  key={portion.name}
                  className={`relative border-sketch border-[3px] p-4 text-center transition-transform hover:-translate-y-1 ${
                    portion.recommended
                      ? "border-[#1E1E1E] bg-[#96F2D7] shadow-[4px_4px_0_#1E1E1E]"
                      : "border-slate-200 bg-white shadow-[3px_3px_0_#dbe3e8]"
                  }`}
                >
                  {portion.recommended && (
                    <span className="absolute right-3 top-3 border-sketch-btn border-2 border-[#1E1E1E] bg-[#FFD43B] px-2 py-1 text-[10px] font-black tracking-wider">
                      FAVORIT
                    </span>
                  )}
                  <div className="flex h-48 items-center justify-center sm:h-56">
                    <Image
                      src={portion.image}
                      alt={`Pouch makaroni ${portion.name}`}
                      width={220}
                      height={260}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <h3 className="mt-3 text-lg font-black">{portion.name}</h3>
                  <p className="mt-1 text-2xl font-black">{portion.price}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{portion.weight}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 border-sketch border-[3px] border-[#1E1E1E] bg-white p-5 shadow-[6px_6px_0_#1E1E1E] sm:mt-10 sm:p-8">
            <div className="flex items-start gap-4 border-b-2 border-slate-100 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border-sketch-alt bg-[#FFD43B]">
                <Flame size={25} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black sm:text-2xl">LEVEL PEDAS</h2>
                <p className="mt-1 text-sm text-gray-500">Sesuaikan tingkat pedas dengan selera kamu.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {spiceOptions.map((spice) => (
                <article key={spice.name} className="border-sketch-alt border-2 border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black tracking-wide">{spice.name}</h3>
                    {spice.hot ? <Flame size={19} className="text-red-500" /> : <Box size={19} className="text-[#1E1E1E]" />}
                  </div>
                  <div className="mt-5 flex h-14 items-end gap-2" aria-label={`${spice.amount} level pedas`}>
                    {Array.from({ length: spice.scoops }).map((_, index) => (
                      <span key={index} className="h-10 w-10 border-sketch-alt border-2 border-[#1E1E1E] bg-gradient-to-t from-red-500 to-orange-300 shadow-[2px_2px_0_#1E1E1E]" />
                    ))}
                  </div>
                  <p className="mt-4 text-lg font-black">{spice.amount}</p>
                  <p className="mt-1 text-sm leading-5 text-gray-500">{spice.description}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:mt-12 sm:flex-row">
            <button onClick={() => router.back()} className="inline-flex min-h-14 items-center justify-center gap-2 border-sketch-btn border-2 border-[#1E1E1E] bg-white px-5 font-black transition-transform hover:-translate-y-0.5">
              <ChevronLeft size={19} /> Kembali
            </button>
            <button onClick={() => router.push(`/order/makaroni/${orderDate}`)} className="inline-flex min-h-14 flex-1 items-center justify-center gap-3 border-sketch-btn border-[3px] border-[#1E1E1E] bg-[#FFD43B] px-5 font-black shadow-[4px_4px_0_#1E1E1E] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#1E1E1E] active:translate-x-1 active:translate-y-1 active:shadow-none">
              Sudah Mengerti, Lanjutkan Pesan <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
