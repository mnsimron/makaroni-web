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
          <span className="text-xs font-black bg-brand-primary text-brand-tertiary px-2.5 py-1 rounded-full">
            Pesanan: {orderDate}
          </span>
        </div>
      </header>

      {/* FORM BODY */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center">
        {isSuccess ? (
          <div className="bg-white p-6 rounded-2xl border-2 border-brand-tertiary shadow-[6px_6px_0px_0px_#1E1E1E] text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary/30 text-brand-tertiary rounded-full flex items-center justify-center mx-auto text-3xl">
              <FaCheckCircle className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black">Pesanan Terdaftar!</h2>
            <p className="text-sm text-gray-600">
              Terima kasih <span className="font-bold text-brand-tertiary">{customerName}</span>, pesanan Anda untuk tanggal <span className="font-bold">{orderDate}</span> telah tercatat di sistem dapur.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setCustomerName("");
              }}
              className="w-full py-3 bg-brand-secondary text-brand-tertiary font-extrabold rounded-xl border-2 border-brand-tertiary shadow-[2px_2px_0px_0px_#1E1E1E]"
            >
              Pesan Lagi
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl border-2 border-brand-tertiary shadow-[6px_6px_0px_0px_#1E1E1E] space-y-5"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <GiCookie className="text-3xl text-brand-secondary" />
              <div>
                <h1 className="text-xl font-black">makar-oni</h1>
                <p className="text-xs text-gray-500">Isi detail pesanan Anda di bawah ini</p>
              </div>
            </div>

            {/* Nama Pemesan */}
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Nama Lengkap / Panggilan
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Edward"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-brand-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-semibold"
              />
            </div>

            {/* Ukuran Pack */}
            <div>
            <label className="block text-xs font-black uppercase mb-1">Ukuran (Pack)</label>
            <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((item) => (
                <button
                    type="button"
                    key={item.label}
                    onClick={() => setSize(item.label)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                    size === item.label
                        ? "bg-brand-primary border-brand-tertiary text-brand-tertiary shadow-[2px_2px_0px_0px_#1E1E1E]"
                        : "border-gray-200 text-gray-600 hover:border-brand-tertiary"
                    }`}
                >
                    <span>{item.label}</span>
                    <span className="text-[10px] bg-brand-secondary text-brand-tertiary px-1.5 py-0.2 rounded-md font-black border border-brand-tertiary/20">
                    {item.price}
                    </span>
                </button>
                ))}
            </div>
            </div>

            {/* Varian Rasa */}
            <div>
              <label className="block text-xs font-black uppercase mb-1">Varian Rasa</label>
              <div className="grid grid-cols-2 gap-2">
                {flavorOptions.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setFlavor(item)}
                    className={`py-2.5 px-2 text-xs font-bold rounded-xl border-2 transition-all ${
                      flavor === item
                        ? "bg-brand-secondary border-brand-tertiary text-brand-tertiary shadow-[2px_2px_0px_0px_#1E1E1E]"
                        : "border-gray-200 text-gray-600 hover:border-brand-tertiary"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Pedas (Smooth Slider Gradasi) */}
            <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase flex items-center gap-1">
                <FaPepperHot className={spicyValue > 15 ? "text-red-500" : "text-gray-400"} />
                Tingkat Pedas
                </label>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-brand-tertiary text-white border border-brand-tertiary transition-all">
                {spicyLevel}
                </span>
            </div>

            {/* Slider Control Smooth */}
            <div className="relative pt-1">
                <input
                type="range"
                min="0"
                max="100"
                value={spicyValue}
                onChange={(e) => setSpicyValue(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer border-2 border-brand-tertiary accent-brand-tertiary shadow-[1px_1px_0px_0px_#1E1E1E]"
                style={{
                    background: "linear-gradient(to right, #FFD43B 0%, #FF922B 40%, #FF6B6B 75%, #E03131 100%)",
                }}
                />

                {/* Indikator Titik Level */}
                <div className="flex justify-between text-[10px] font-extrabold text-gray-500 mt-1 uppercase">
                <span>Tidak Pedas</span>
                <span>Dikit</span>
                <span>Sedang</span>
                <span>Aduh Pedas 🔥</span>
                </div>
            </div>
            </div>            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-brand-primary text-brand-tertiary font-black rounded-xl border-2 border-brand-tertiary shadow-[3px_3px_0px_0px_#1E1E1E] hover:opacity-90 transition-all text-sm uppercase tracking-wide disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Kirim Pesanan"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}