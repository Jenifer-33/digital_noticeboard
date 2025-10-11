import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (error) {
      console.error("Admin check API error:", error);
      return NextResponse.json(
        {
          error: "Failed to check admin status",
          details: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ hasAdmins: data.length > 0 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
