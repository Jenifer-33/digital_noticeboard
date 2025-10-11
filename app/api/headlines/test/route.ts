import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    console.log("Testing headlines table access...");

    // Test 1: Basic table access
    const { data: basicTest, error: basicError } = await supabaseAdmin
      .from("headlines")
      .select("id")
      .limit(1);

    if (basicError) {
      return NextResponse.json({
        success: false,
        error: "Basic table access failed",
        details: basicError.message,
        code: basicError.code,
        hint: basicError.hint,
        query: "SELECT id FROM headlines LIMIT 1",
      });
    }

    // Test 2: Published headlines query (exact same as public API)
    const { data: publishedTest, error: publishedError } = await supabaseAdmin
      .from("headlines")
      .select("*")
      .eq("status", "PUBLISHED")
      .order("published_date", { ascending: false })
      .limit(11);

    if (publishedError) {
      return NextResponse.json({
        success: false,
        error: "Published headlines query failed",
        details: publishedError.message,
        code: publishedError.code,
        hint: publishedError.hint,
        query:
          "SELECT * FROM headlines WHERE status = 'PUBLISHED' ORDER BY published_date DESC LIMIT 11",
      });
    }

    // Test 3: Check if there are any headlines at all
    const { data: allHeadlines, error: allError } = await supabaseAdmin
      .from("headlines")
      .select("id, title, status")
      .limit(5);

    if (allError) {
      return NextResponse.json({
        success: false,
        error: "All headlines query failed",
        details: allError.message,
        code: allError.code,
        hint: allError.hint,
        query: "SELECT id, title, status FROM headlines LIMIT 5",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Headlines table access successful",
      results: {
        basicAccess: basicTest ? "✅ Working" : "❌ Failed",
        publishedAccess: publishedTest
          ? `✅ Working (${publishedTest.length} found)`
          : "❌ Failed",
        allHeadlines: allHeadlines
          ? `✅ Working (${allHeadlines.length} found)`
          : "❌ Failed",
        publishedHeadlines: publishedTest || [],
        allHeadlinesData: allHeadlines || [],
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
