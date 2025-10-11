import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "✅ Set"
        : "❌ Missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "✅ Set"
        : "❌ Missing",
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "✅ Set"
        : "❌ Missing",
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL ? "✅ Set" : "❌ Missing",
    };

    // Test Supabase connection
    let supabaseTest = "❌ Not tested";
    let supabaseError = null;

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error } = await supabase
        .from("headlines")
        .select("count")
        .limit(1);

      if (error) {
        supabaseTest = "❌ Failed";
        supabaseError = error.message;
      } else {
        supabaseTest = "✅ Working";
      }
    } catch (err) {
      supabaseTest = "❌ Connection failed";
      supabaseError = err instanceof Error ? err.message : "Unknown error";
    }

    return NextResponse.json({
      status: "Debug information",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      envVars,
      supabaseTest,
      supabaseError,
      // Don't expose actual values in production
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
