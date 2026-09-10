"use client";

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

const settingLabels: Record<SettingKey, string> = {
  size_kecil: "Ukuran Kecil",
  size_sedang: "Ukuran Sedang",
  size_besar: "Ukuran Besar",
  flavor_keju: "Rasa Keju",
  flavor_bbq: "Rasa BBQ",
  flavor_jagung_bakar: "Rasa Jagung Bakar",
};

interface InventoryControlsProps {
  settings: InventorySettings;
  toggleStatus: (formData: FormData) => Promise<void>;
}

export default function InventoryControls({
  settings,
  toggleStatus,
}: InventoryControlsProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 pt-6">
      <div className="border-sketch border-2 border-brand-tertiary bg-white p-4 shadow-[4px_4px_0px_0px_#1E1E1E]">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Pengaturan Ketersediaan
          </p>
          <h2 className="text-2xl font-black text-brand-tertiary">
            Kontrol Stok &amp; Menu
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {settingKeys.map((key) => {
            const isAvailable = settings[key];

            return (
              <form
                key={key}
                action={toggleStatus}
                className="border-sketch-btn flex items-center justify-between gap-3 border-2 border-brand-tertiary bg-slate-50 px-3 py-2"
              >
                <input type="hidden" name="setting" value={key} />
                <span className="min-w-0 text-xs font-black uppercase leading-tight text-brand-tertiary">
                  {settingLabels[key]}
                </span>
                <label className="inline-flex shrink-0 cursor-pointer items-center gap-2">
                  <span className="text-[10px] font-black text-gray-500">
                    {isAvailable ? "Tersedia" : "Habis"}
                  </span>
                  <input
                    type="checkbox"
                    name="available"
                    checked={isAvailable}
                    onChange={(event) => event.currentTarget.form?.requestSubmit()}
                    className="peer sr-only"
                    aria-label={`${settingLabels[key]} ${isAvailable ? "tersedia" : "habis"}`}
                  />
                  <span
                    aria-hidden="true"
                    className={`relative h-6 w-11 rounded-full border-2 border-brand-tertiary p-0.5 shadow-[2px_2px_0px_0px_#1E1E1E] transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-secondary ${
                      isAvailable ? "bg-[#96F2D7]" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full border-2 border-brand-tertiary bg-white transition-transform ${
                        isAvailable ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </span>
                </label>
              </form>
            );
          })}
        </div>
      </div>
    </section>
  );
}
