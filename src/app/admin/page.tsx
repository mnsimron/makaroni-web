"use client";

import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaRedo,
  FaTrashAlt,
  FaCheck,
  FaBox,
  FaPepperHot,
  FaWhatsapp,
  FaCopy,
  FaLink,
  FaTimes,
} from "react-icons/fa";
import { GiCookie } from "react-icons/gi";
import { supabase } from "@/lib/supabase";

interface Order {
  id: string;
  order_code: string;
  order_date: string;
  customer_name: string;
  size: string;
  flavor: string;
  spicy_level: string;
  created_at: string;
}

const indonesianDays = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const indonesianMonths = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatIndonesianDate = (dateString: string) => {
  const [day, month, year] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (!day || !month || !year || Number.isNaN(date.getTime())) return dateString;

  return `${indonesianDays[date.getDay()]}, ${String(day).padStart(2, "0")} ${indonesianMonths[month - 1]} ${year}`;
};

export default function AdminDashboard() {
  // Set default tanggal hari ini format DD-MM-YYYY
  const getTodayFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const orderSummary = [
    `makar-oni order (${formatIndonesianDate(selectedDate)}) :`,
    "",
    ...orders.map(
      (item, index) =>
      `${index + 1}. ${item.customer_name} | ${item.flavor} | ${item.size} | Pedas: ${item.spicy_level}`
    ),
  ].join("\n");

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(orderSummary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOrderLink = async () => {
    const url = `${window.location.origin}/order/makaroni/${selectedDate}`;
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2000);
  };

  // Ambil data pesanan dari Supabase berdasarkan tanggal
  const fetchOrders = async (dateStr: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_date", dateStr)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Gagal mengambil data pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  // Hapus pesanan dari Supabase
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return;

    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      setOrders((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal menghapus pesanan:", err);
    }
  };

  // Toggle status selesai disiapkan di layar admin
  const toggleComplete = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Ubah input HTML Date (YYYY-MM-DD) ke format DD-MM-YYYY
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [year, month, day] = e.target.value.split("-");
    setSelectedDate(`${day}-${month}-${year}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-brand-tertiary flex flex-col font-sans pb-12">
      {/* HEADER DASHBOARD */}
      <header className="bg-white border-b-2 border-brand-tertiary sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="font-black text-lg leading-none">Admin makar-oni</h1>
              <p className="text-[10px] text-gray-500 font-semibold">Dashboard Pencatatan Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSummaryOpen(true);
                setCopied(false);
              }}
              className="p-2 bg-emerald-100 text-emerald-700 border-sketch-btn border-2 border-brand-tertiary hover:opacity-90 transition-all shadow-[2px_2px_0px_0px_#1E1E1E]"
              title="Bagikan Ringkasan WhatsApp"
            >
              <FaWhatsapp className="text-sm" />
            </button>
            <button
              onClick={() => fetchOrders(selectedDate)}
              className="p-2 bg-brand-secondary border-sketch-btn border-2 border-brand-tertiary hover:opacity-90 transition-all shadow-[2px_2px_0px_0px_#1E1E1E]"
              title="Refresh Data"
            >
              <FaRedo className={`text-sm ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-6">
        {/* PANEL FILTER TANGGAL & RINGKASAN */}
        <div className="bg-white p-4 border-sketch border-2 border-brand-tertiary shadow-[4px_4px_0px_0px_#1E1E1E] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Menampilkan Pesanan Untuk:
            </span>
            <h2 className="text-xl font-black text-brand-tertiary flex items-center gap-2">
              <FaCalendarAlt className="text-brand-secondary text-lg" />
              Pesanan {selectedDate}
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="date"
              onChange={handleDateChange}
              className="p-2 text-xs font-bold border-sketch border-2 border-brand-tertiary bg-slate-50 focus:outline-none"
            />
            <button
              onClick={handleCopyOrderLink}
              className="p-2 bg-brand-primary border-sketch-btn border-2 border-brand-tertiary hover:opacity-90 transition-all shadow-[2px_2px_0px_0px_#1E1E1E]"
              title={linkCopied ? "Link berhasil disalin" : "Salin link pesanan"}
              aria-label={linkCopied ? "Link berhasil disalin" : "Salin link pesanan"}
            >
              {linkCopied ? <FaCheck className="text-sm" /> : <FaLink className="text-sm" />}
            </button>
            <div className="bg-brand-primary/40 border-sketch-btn border-2 border-brand-tertiary px-3 py-1.5 text-xs font-black">
              Total: {orders.length} Pack
            </div>
          </div>
        </div>

        {/* LISTING CARD PESANAN */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-bold text-sm">
            Memuat data pesanan...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border-sketch p-8 border-2 border-brand-tertiary shadow-[4px_4px_0px_0px_#1E1E1E] text-center space-y-2">
            <p className="font-bold text-gray-500">Belum ada pesanan terdaftar untuk tanggal ini.</p>
              <p className="text-xs text-gray-400">
              Bagikan link <code className="bg-slate-100 px-1 py-0.5 border-sketch-alt border">/order/makaroni/{selectedDate}</code> ke teman kantor Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((item) => {
              const isCompleted = completedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white border-sketch p-5 border-2 border-brand-tertiary transition-all relative ${
                    isCompleted
                      ? "opacity-60 bg-gray-50 shadow-none border-dashed"
                      : "shadow-[4px_4px_0px_0px_#1E1E1E]"
                  }`}
                >
                  {/* HEADER CARD */}
                  <div className="flex justify-between items-center border-b-2 border-gray-100 pb-2 mb-3">
                    <span className="font-black text-lg text-brand-tertiary tracking-wide bg-brand-secondary/30 px-2.5 py-0.5 border-sketch-btn border border-brand-secondary">
                      {item.order_code}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`p-1.5 border-sketch-btn border-2 border-brand-tertiary transition-all ${
                          isCompleted
                            ? "bg-emerald-400 text-white"
                            : "bg-slate-100 hover:bg-emerald-100"
                        }`}
                        title="Tandai Selesai"
                      >
                        <FaCheck className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 border-sketch-btn border-2 border-brand-tertiary transition-all"
                        title="Hapus Pesanan"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* BODY CARD DETAIL */}
                  <div className="space-y-2 text-sm font-semibold">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs uppercase font-bold">Nama</span>
                      <span className="font-extrabold text-base text-brand-tertiary">
                        {item.customer_name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2 border-sketch-alt border border-gray-200">
                      <span className="text-gray-600 text-xs flex items-center gap-1 font-bold">
                        <FaBox className="text-brand-tertiary text-xs" /> Ukuran (pack)
                      </span>
                      <span className="font-black text-brand-tertiary">{item.size}</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2 border-sketch-alt border border-gray-200">
                      <span className="text-gray-600 text-xs font-bold">Rasa</span>
                      <span className="font-black text-emerald-700">{item.flavor}</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2 border-sketch-alt border border-gray-200">
                      <span className="text-gray-600 text-xs flex items-center gap-1 font-bold">
                        <FaPepperHot className="text-red-500 text-xs" /> Pedas
                      </span>
                      <span className="font-black text-red-600">{item.spicy_level}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isSummaryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="summary-title"
          onClick={() => setIsSummaryOpen(false)}
        >
          <div
            className="w-full max-w-lg border-sketch border-2 border-brand-tertiary bg-white p-5 shadow-[6px_6px_0px_0px_#1E1E1E]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="summary-title" className="text-lg font-black">
                Ringkasan Pesanan WhatsApp
              </h2>
              <button
                onClick={() => setIsSummaryOpen(false)}
                className="border-sketch-btn border-2 border-brand-tertiary p-1.5 hover:bg-slate-100"
                title="Tutup"
                aria-label="Tutup ringkasan"
              >
                <FaTimes />
              </button>
            </div>
            <textarea
              value={orderSummary}
              readOnly
              rows={Math.min(Math.max(orders.length + 3, 5), 14)}
              className="mb-4 w-full resize-none border-sketch border-2 border-brand-tertiary bg-slate-50 p-3 text-sm font-semibold focus:outline-none"
              aria-label="Pratinjau ringkasan pesanan"
            />
            <button
              onClick={handleCopySummary}
              className="flex w-full items-center justify-center gap-2 border-sketch-btn border-2 border-brand-tertiary bg-brand-primary px-4 py-2.5 font-black shadow-[2px_2px_0px_0px_#1E1E1E] hover:opacity-90"
            >
              <FaCopy />
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}