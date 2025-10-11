import { supabaseAdmin } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("admin_invites")
      .select("email, expires_at, used")
      .eq("token", token)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false });
    }

    const isExpired = new Date(data.expires_at) < new Date();
    const isValid = !data.used && !isExpired;

    return NextResponse.json({
      valid: isValid,
      email: isValid ? data.email : undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
