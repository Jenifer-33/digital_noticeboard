import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    console.log("Testing RLS policies...");

    // Test 1: Check if we can access headlines table at all
    const { data: basicAccess, error: basicError } = await supabaseAdmin
      .from("headlines")
      .select("id, title, status")
      .limit(1);

    if (basicError) {
      return NextResponse.json({
        success: false,
        error: "Basic table access failed",
        details: basicError.message,
        code: basicError.code,
        hint: basicError.hint,
      });
    }

    // Test 2: Check if we can access published headlines (this should work)
    const { data: publishedAccess, error: publishedError } = await supabaseAdmin
      .from("headlines")
      .select("id, title, status, published_date")
      .eq("status", "PUBLISHED")
      .limit(5);

    if (publishedError) {
      return NextResponse.json({
        success: false,
        error: "Published headlines access failed",
        details: publishedError.message,
        code: publishedError.code,
        hint: publishedError.hint,
      });
    }

    // Test 3: Check if we can access all headlines (admin access)
    const { data: allAccess, error: allError } = await supabaseAdmin
      .from("headlines")
      .select("id, title, status, created_date")
      .limit(5);

    if (allError) {
      return NextResponse.json({
        success: false,
        error: "All headlines access failed",
        details: allError.message,
        code: allError.code,
        hint: allError.hint,
      });
    }

    // Test 4: Check table structure
    const { error: tableError } = await supabaseAdmin
      .from("headlines")
      .select("*")
      .limit(0);

    return NextResponse.json({
      success: true,
      message: "RLS test successful",
      results: {
        basicAccess: basicAccess ? "✅ Working" : "❌ Failed",
        publishedAccess: publishedAccess
          ? `✅ Working (${publishedAccess.length} found)`
          : "❌ Failed",
        allAccess: allAccess
          ? `✅ Working (${allAccess.length} found)`
          : "❌ Failed",
        tableStructure: tableError ? "❌ Failed" : "✅ Working",
        publishedHeadlines: publishedAccess || [],
        allHeadlines: allAccess || [],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("RLS test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "RLS test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
