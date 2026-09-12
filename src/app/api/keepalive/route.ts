import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  await supabase.from("app_settings").select("id").limit(1);

  return NextResponse.json({
    status: "awake",
    timestamp: new Date().toISOString(),
  });
}
