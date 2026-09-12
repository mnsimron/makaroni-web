import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FaCheckCircle } from "react-icons/fa";
import { MessageCircle, Smile } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type OrderSuccessPageProps = {
  params: Promise<{ date: string | string[] }>;
  searchParams: Promise<{ code?: string | string[] }>;
};

type Order = {
  order_code: string;
  order_date: string;
  customer_name: string;
  size: string;
  flavor: string;
  spicy_level: string;
};

type OrderNotFoundProps = {
  orderCode?: string;
  error?: unknown;
  hasServiceKey: boolean;
};

export default async function OrderSuccessPage({ params, searchParams }: OrderSuccessPageProps) {
  const resolvedParams = await params;
  const { code: rawCode } = await searchParams;
  const orderCode = Array.isArray(rawCode) ? rawCode[0] : rawCode;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const orderDate = Array.isArray(resolvedParams.date)
    ? resolvedParams.date[0]
    : resolvedParams.date;

  if (!orderCode || !orderDate) {
    return <OrderNotFound orderCode={orderCode} hasServiceKey={hasServiceKey} />;
  }

  let code: string;
  try {
    code = decodeURIComponent(orderCode);
  } catch {
    return <OrderNotFound orderCode={orderCode} hasServiceKey={hasServiceKey} />;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("order_code, order_date, customer_name, size, flavor, spicy_level")
    .eq("order_code", code)
    .eq("order_date", orderDate)
    .maybeSingle<Order>();

  if (error || !order) {
    return <OrderNotFound orderCode={orderCode} error={error} hasServiceKey={hasServiceKey} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-brand-tertiary flex flex-col font-sans">
      <header className="site-nav"><div className="nav-inner">
        <Link href="/" className="brand" aria-label="makar-oni home"><span className="brand-mark"><Smile size={30} strokeWidth={2.5} /></span><span className="brand-name">makar-oni</span></Link>
        <div className="nav-actions"><a className="button button-outline nav-contact" href="https://wa.me/6281290158831" target="_blank" rel="noreferrer"><MessageCircle size={17} /><span>Contact</span></a><Link href="/" className="button button-mint">Home</Link></div>
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
              {order.order_date}
            </span>
          </div>

          <div className="text-center py-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kode Pesanan</span>
            <h1 className="text-3xl font-black text-brand-tertiary bg-brand-secondary/30 py-1 px-4 border-sketch-btn border border-brand-secondary inline-block mt-1">
              {order.order_code}
            </h1>
          </div>

          {/* DETAIL LISTING ITEM */}
          <div className="space-y-2.5 text-sm font-semibold bg-slate-50 p-4 border-sketch-alt border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500 text-xs font-bold uppercase">Nama Pemesan</span>
              <span className="font-extrabold text-base text-brand-tertiary">{order.customer_name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs flex items-center gap-1 font-bold">
                Ukuran (Pack)
              </span>
              <span className="font-black text-brand-tertiary">{order.size}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs font-bold">Rasa</span>
              <span className="font-black text-emerald-700">{order.flavor}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs flex items-center gap-1 font-bold">
                Pedas
              </span>
              <span className="font-black text-red-600">{order.spicy_level}</span>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 italic">
            Pesanan Anda sudah tercatat dan siap disiapkan <br /> untuk tanggal <span className="font-bold">{order.order_date}</span>.
          </p>

          {/* TOMBOL AKSI */}
          <div className="flex flex-col gap-4 mt-6 w-full">
            <Link
              href={`/order/makaroni/${order.order_date}`}
              className="block w-full text-center px-4 py-3 font-bold bg-[#FFD43B] text-black border-sketch-btn border-2 border-black hover:opacity-90 transition-all"
            >
              Pesan Lagi Untuk Tanggal Ini
            </Link>
            <Link
              href="/"
              className="block w-full text-center px-4 py-3 font-bold bg-white text-black border-sketch-btn border-2 border-black hover:bg-gray-50 transition-all"
            >
              Kembali ke Halaman Utama
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

function OrderNotFound({ orderCode, error, hasServiceKey }: OrderNotFoundProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-brand-tertiary flex flex-col font-sans">
      <header className="site-nav"><div className="nav-inner">
        <Link href="/" className="brand" aria-label="makar-oni home"><span className="brand-mark"><Smile size={30} strokeWidth={2.5} /></span><span className="brand-name">makar-oni</span></Link>
      </div></header>
      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center my-6">
        <div className="bg-white p-6 border-sketch border-2 border-brand-tertiary shadow-[6px_6px_0px_0px_#1E1E1E] text-center">
          <h1 className="text-2xl font-black">Pesanan tidak ditemukan</h1>
          <p className="mt-3 text-sm text-gray-500">Kode pesanan tidak valid atau sudah tidak tersedia.</p>
          <pre className="mt-4 bg-slate-800 p-4 text-left text-xs text-green-400">
{`Searched Code: ${orderCode || "Kosong/Null"}
Service Key Configured: ${hasServiceKey ? "YES" : "NO"}
DB Error: ${JSON.stringify(error) || "Tidak ada pesan error"}`}
          </pre>
          <Link href="/" className="button button-mint mt-6 inline-flex">Kembali ke Halaman Utama</Link>
        </div>
      </main>
    </div>
  );
}