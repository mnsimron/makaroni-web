"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaCheckCircle, FaPepperHot } from "react-icons/fa";
import { GiCookie } from "react-icons/gi";
import { supabase } from "@/lib/supabase";

export default function OrderPage() {
  const params = useParams();
  const orderDate = params?.date as string;
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [size, setSize] = useState("Sedang");
  const [flavor, setFlavor] = useState("Jagung Bakar");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Opsi Pilihan Form
const sizeOptions = [
  { label: "Kecil", price: "5k" },
  { label: "Sedang", price: "8k" },
  { label: "Aduh Besar", price: "15k" },
];
  const flavorOptions = ["Keju", "Jagung Bakar", "BBQ", "Original Asin Gurih"];
// 1. Array level pedas
const spicyLevels = ["Tidak Pedas", "Dikit", "Sedang", "Aduh Pedas"];

// 2. State angka kontinu 0 - 100 untuk gerakan smooth (default 33 = Dikit)
const [spicyValue, setSpicyValue] = useState(33);

// 3. Fungsi konversi angka 0-100 ke level teks terdekat (snap)
const getSpicyLevelText = (val: number) => {
  if (val < 25) return spicyLevels[0]; // Tidak Pedas
  if (val < 50) return spicyLevels[1]; // Dikit
  if (val < 75) return spicyLevels[2]; // Sedang
  return spicyLevels[3];                // Aduh Pedas
};

// Teks label terhitung yang akan dikirim ke Supabase
const spicyLevel = getSpicyLevelText(spicyValue);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!customerName.trim()) return;

  setIsSubmitting(true);

  try {
    // 1. Ambil jumlah pesanan pada tanggal tersebut untuk kode penomoran
    const { count, error: countError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("order_date", orderDate);

    if (countError) throw countError;

    const nextNumber = (count || 0) + 1;
    const orderCode = `#MKO-${String(nextNumber).padStart(3, "0")}`;

    const selectedSizeObj = sizeOptions.find((item) => item.label === size);
    const sizeFormatted = selectedSizeObj
      ? `${selectedSizeObj.label} (${selectedSizeObj.price})`
      : size;

    // 2. Insert data ke Supabase
    const { error: insertError } = await supabase.from("orders").insert([
      {
        order_code: orderCode,
        order_date: orderDate,
        customer_name: customerName,
        size: sizeFormatted,
        flavor,
        spicy_level: spicyLevel,
      },
    ]);

    if (insertError) throw insertError;

    // 3. Redirect ke Halaman Rekap Pesanan Baru
    const queryParams = new URLSearchParams({
      code: orderCode,
      name: customerName,
      size: sizeFormatted,
      flavor,
      spicy: spicyLevel,
    }).toString();

    router.push(`/order/makaroni/${orderDate}/success?${queryParams}`);
  } catch (err: unknown) {
    console.error("Detail Error Supabase:", err);
    alert("Gagal menyimpan pesanan. Silakan coba lagi.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 text-brand-tertiary flex flex-col font-sans">
      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-tertiary"
          >
            <FaArrowLeft /> Kembali
          </button>
          <span className="text-xs font-black bg-brand-primary text-brand-tertiary px-2.5 py-1 border-sketch-btn">
            Pesanan: {orderDate}
          </span>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-8 sm:py-12 flex flex-col justify-center">
        {isSuccess ? (
          <div className="w-full max-w-[580px] mx-auto bg-white p-5 sm:p-8 border-sketch border-2 border-[#1E1E1E] shadow-[6px_6px_0_#1E1E1E] text-center">
            <div className="w-16 h-16 bg-[#96F2D7] text-[#1E1E1E] border-sketch-alt flex items-center justify-center mx-auto">
              <FaCheckCircle className="text-emerald-600" />
            </div>
            <h2 className="mt-5 text-2xl sm:text-3xl font-black">Pesanan Terdaftar!</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Terima kasih <span className="font-bold text-brand-tertiary">{customerName}</span>, pesanan Anda untuk tanggal <span className="font-bold">{orderDate}</span> telah tercatat di sistem dapur.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setCustomerName("");
              }}
              className="w-full mt-6 min-h-14 bg-[#FFD43B] text-[#1E1E1E] font-black border-sketch-btn border-2 border-[#1E1E1E] shadow-[4px_4px_0_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1E1E1E] transition-all"
            >
              Pesan Lagi
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[600px] mx-auto bg-white p-5 sm:p-8 border-sketch border-2 border-[#1E1E1E] shadow-[6px_6px_0_#1E1E1E] space-y-6"
          >
            <div className="flex items-center justify-between gap-4 border-b-2 border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border-sketch-alt bg-[#96F2D7] flex items-center justify-center text-[#1E1E1E]">
                  <GiCookie className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#1E1E1E]">makar-oni</h1>
                  <p className="text-xs text-gray-500">Isi detail pesanan Anda di bawah ini</p>
                </div>
              </div>
              <span className="shrink-0 bg-[#FFD43B] text-[#1E1E1E] px-2.5 py-1 border-sketch-btn text-[10px] font-black tracking-wider">
                STEP 2 / 2
              </span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2" htmlFor="customer-name">
                Nama Lengkap / Panggilan
              </label>
              <input
                id="customer-name"
                type="text"
                required
                placeholder="Contoh: Edward"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full min-h-13 px-4 border-sketch border-2 border-[#1E1E1E] bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#96F2D7] text-sm font-semibold transition-shadow"
              />
            </div>

            <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2">Ukuran (Pack)</label>
            <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((item) => (
                <button
                    type="button"
                    key={item.label}
                    onClick={() => setSize(item.label)}
                    className={`min-h-20 px-1 text-xs font-bold border-sketch-btn border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    size === item.label
                        ? "bg-[#96F2D7] border-[#1E1E1E] text-[#1E1E1E] shadow-[3px_3px_0_#1E1E1E]"
                        : "bg-white border-slate-200 text-gray-600 hover:border-[#1E1E1E]"
                    }`}
                >
                    <span className="font-black">{item.label}</span>
                    <span className="text-[10px] bg-[#FFD43B] text-[#1E1E1E] px-1.5 py-0.5 border-sketch-btn font-black border border-[#1E1E1E]/20">
                    {item.price}
                    </span>
                </button>
                ))}
            </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Varian Rasa</label>
              <div className="grid grid-cols-2 gap-3">
                {flavorOptions.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setFlavor(item)}
                    className={`min-h-13 px-3 text-xs font-bold border-sketch-btn border-2 transition-all ${
                      flavor === item
                        ? "bg-[#FFD43B] border-[#1E1E1E] text-[#1E1E1E] shadow-[3px_3px_0_#1E1E1E]"
                        : "bg-white border-slate-200 text-gray-600 hover:border-[#1E1E1E]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
            <div className="flex justify-between items-center gap-3">
                <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <FaPepperHot className={spicyValue > 15 ? "text-red-500" : "text-gray-400"} />
                  Tingkat Pedas
                </label>
                <span className="text-xs font-black px-2.5 py-1 border-sketch-btn bg-[#1E1E1E] text-white border-2 border-[#1E1E1E] transition-all">
                {spicyLevel}
                </span>
            </div>

            <div className="relative pt-1">
                <input
                type="range"
                min="0"
                max="100"
                value={spicyValue}
                onChange={(e) => setSpicyValue(Number(e.target.value))}
                aria-label="Tingkat pedas"
                className="w-full h-4 border-sketch-btn appearance-none cursor-pointer border-2 border-[#1E1E1E] accent-[#1E1E1E] shadow-[2px_2px_0_#1E1E1E]"
                style={{
                    background: "linear-gradient(to right, #FFD43B 0%, #FF922B 40%, #FF6B6B 75%, #E03131 100%)",
                }}
                />

                <div className="grid grid-cols-4 gap-1 text-center text-[9px] sm:text-[10px] font-extrabold text-gray-500 mt-2 uppercase">
                  <span>Tidak Pedas</span>
                  <span>Dikit</span>
                  <span>Sedang</span>
                  <span>Aduh Pedas</span>
                </div>
            </div>
            </div>            
            <button
              type="submit"
              disabled={isSubmitting || !customerName.trim()}
              className="w-full min-h-14 px-5 bg-[#96F2D7] text-[#1E1E1E] font-black border-sketch-btn border-2 border-[#1E1E1E] shadow-[4px_4px_0_#1E1E1E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1E1E1E] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-500 disabled:shadow-[4px_4px_0_#94a3b8] disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#94a3b8] transition-all text-sm uppercase tracking-wide"
            >
              {isSubmitting ? "Loading Sebentar..." : "Buat Pesanan"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}