import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    // Fetch all published headlines
    const { data, error } = await supabaseAdmin
      .from("headlines")
      .select("*")
      .eq("status", "PUBLISHED")
      .order("published_date", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch headlines" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      headlines: data || [],
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
