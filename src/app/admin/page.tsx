import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import AdminDashboardClient from "./AdminDashboardClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

type AppSettings = {
  orders_open: boolean;
};

export default async function AdminPage() {
  const { data: settings, error } = await supabase
    .from("app_settings")
    .select("orders_open")
    .eq("id", 1)
    .single<AppSettings>();

  if (error) {
    throw new Error(`Gagal mengambil pengaturan stok: ${error.message}`);
  }

  async function toggleOrderStatus() {
    "use server";

    const { data: currentSettings, error: fetchError } = await supabase
      .from("app_settings")
      .select("orders_open")
      .eq("id", 1)
      .single<Pick<AppSettings, "orders_open">>();

    if (fetchError) {
      throw new Error(`Gagal membaca status pesanan: ${fetchError.message}`);
    }

    const { error: updateError } = await supabase
      .from("app_settings")
      .update({ orders_open: !currentSettings.orders_open })
      .eq("id", 1);

    if (updateError) {
      throw new Error(`Gagal memperbarui status pesanan: ${updateError.message}`);
    }

    revalidatePath("/admin");
    revalidatePath("/", "layout");
  }

  return (
    <>
      <AdminDashboardClient
        ordersOpen={settings.orders_open}
        toggleOrderStatus={toggleOrderStatus}
      />
    </>
  );
}