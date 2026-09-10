import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import InventoryControls from "../InventoryControls";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

const settingKeys = [
  "size_kecil",
  "size_sedang",
  "size_besar",
  "flavor_keju",
  "flavor_bbq",
  "flavor_jagung_bakar",
] as const;

type SettingKey = (typeof settingKeys)[number];
type InventorySettings = Record<SettingKey, boolean>;

export default async function InventoryPage() {
  const { data: settings, error } = await supabase
    .from("app_settings")
    .select(settingKeys.join(", "))
    .eq("id", 1)
    .single<InventorySettings>();

  if (error) {
    throw new Error(`Gagal mengambil pengaturan stok: ${error.message}`);
  }

  async function toggleStatus(formData: FormData) {
    "use server";

    const key = formData.get("setting");
    if (typeof key !== "string" || !settingKeys.includes(key as SettingKey)) {
      throw new Error("Pengaturan stok tidak valid");
    }

    const settingKey = key as SettingKey;
    const { data: currentSettings, error: fetchError } = await supabase
      .from("app_settings")
      .select(settingKey)
      .eq("id", 1)
      .single<Pick<InventorySettings, SettingKey>>();

    if (fetchError) {
      throw new Error(`Gagal membaca status stok: ${fetchError.message}`);
    }

    const { error: updateError } = await supabase
      .from("app_settings")
      .update({ [settingKey]: !currentSettings[settingKey] })
      .eq("id", 1);

    if (updateError) {
      throw new Error(`Gagal memperbarui status stok: ${updateError.message}`);
    }

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidatePath("/", "layout");
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-12 text-brand-tertiary">
      <header className="border-b-2 border-brand-tertiary bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">
              Admin makar-oni
            </p>
            <h1 className="text-xl font-black">Kontrol Stok &amp; Menu</h1>
          </div>
          <Link
            href="/admin"
            className="border-sketch-btn border-2 border-brand-tertiary bg-[#FFD43B] px-3 py-2 text-xs font-black shadow-[2px_2px_0px_0px_#1E1E1E] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Kembali ke Admin
          </Link>
        </div>
      </header>

      <InventoryControls settings={settings} toggleStatus={toggleStatus} />
    </main>
  );
}
