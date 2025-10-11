import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabaseAdmin
      .from("headlines")
      .select("*")
      .eq("status", "PUBLISHED")
      .order("published_date", { ascending: false })
      .limit(limit + 1); // Get one extra to check if there are more

    if (cursor) {
      // For cursor-based pagination, we'll use published_date
      query = query.lt("published_date", cursor);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Public headlines API error:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch headlines",
          details: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    const headlines = data || [];
    const hasMore = headlines.length > limit;
    const nextCursor = hasMore ? headlines[limit - 1]?.published_date : null;

    return NextResponse.json({
      headlines: headlines.slice(0, limit),
      nextCursor,
      hasMore,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
