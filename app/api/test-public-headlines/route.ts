import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    console.log("Testing public headlines API...");
    
    // Test the exact same query as the public headlines API
    const { data, error } = await supabaseAdmin
      .from("headlines")
      .select("*")
      .eq("status", "PUBLISHED")
      .order("published_date", { ascending: false })
      .limit(11); // Same as the original API (limit + 1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: "Public headlines query failed",
        details: error.message,
        code: error.code,
        hint: error.hint,
        query: "SELECT * FROM headlines WHERE status = 'PUBLISHED' ORDER BY published_date DESC LIMIT 11",
      });
    }

    const headlines = data || [];
    const hasMore = headlines.length > 10;
    const nextCursor = hasMore ? headlines[9]?.published_date : null;

    return NextResponse.json({
      success: true,
      message: "Public headlines test successful",
      results: {
        totalFound: headlines.length,
        hasMore,
        nextCursor,
        headlines: headlines.slice(0, 10), // Return first 10 like the real API
        sampleHeadline: headlines[0] || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Public headlines test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Public headlines test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
