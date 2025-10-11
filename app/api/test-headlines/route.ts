import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    console.log("Testing headlines API...");

    // Test 1: Check if headlines table exists and is accessible
    const { error: tableError } = await supabaseAdmin
      .from("headlines")
      .select("count")
      .limit(1);

    if (tableError) {
      return NextResponse.json({
        success: false,
        error: "Table access failed",
        details: tableError.message,
        code: tableError.code,
        hint: tableError.hint,
      });
    }

    // Test 2: Try to get all headlines (should work with service role)
    const { data: allHeadlines, error: allError } = await supabaseAdmin
      .from("headlines")
      .select("*")
      .limit(5);

    if (allError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch headlines",
        details: allError.message,
        code: allError.code,
        hint: allError.hint,
      });
    }

    // Test 3: Try to get published headlines specifically
    const { data: publishedHeadlines, error: publishedError } =
      await supabaseAdmin
        .from("headlines")
        .select("*")
        .eq("status", "PUBLISHED")
        .limit(5);

    if (publishedError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch published headlines",
        details: publishedError.message,
        code: publishedError.code,
        hint: publishedError.hint,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Headlines API test successful",
      results: {
        tableAccess: "✅ Working",
        totalHeadlines: allHeadlines?.length || 0,
        publishedHeadlines: publishedHeadlines?.length || 0,
        sampleData: allHeadlines?.slice(0, 2) || [],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Headlines test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Headlines test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
