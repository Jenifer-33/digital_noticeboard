import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
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

    // Test Supabase connection with detailed error info
    let supabaseTest = "❌ Not tested";
    let supabaseError = null;
    let supabaseData = null;

    try {
      const { createClient } = await import("@supabase/supabase-js");

      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.SUPABASE_SERVICE_ROLE_KEY
      ) {
        throw new Error("Missing environment variables");
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      // Test basic connection
      const { data, error } = await supabase
        .from("headlines")
        .select("id, title, status")
        .limit(1);

      if (error) {
        supabaseTest = "❌ Database query failed";
        supabaseError = {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
        };
      } else {
        supabaseTest = "✅ Database connection working";
        supabaseData = data;
      }
    } catch (err) {
      supabaseTest = "❌ Connection failed";
      supabaseError = {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      };
    }

    // Test the exact same query as the public headlines API
    let headlinesTest = "❌ Not tested";
    let headlinesError = null;
    let headlinesData = null;

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabase
        .from("headlines")
        .select("*")
        .eq("status", "PUBLISHED")
        .order("published_date", { ascending: false })
        .limit(11);

      if (error) {
        headlinesTest = "❌ Headlines query failed";
        headlinesError = {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
        };
      } else {
        headlinesTest = "✅ Headlines query working";
        headlinesData = data;
      }
    } catch (err) {
      headlinesTest = "❌ Headlines query failed";
      headlinesError = {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      };
    }

    return NextResponse.json({
      status: "Vercel Debug Information",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      region: process.env.VERCEL_REGION || "unknown",
      deployment: {
        url: process.env.VERCEL_URL || "unknown",
        branch: process.env.VERCEL_GIT_COMMIT_REF || "unknown",
        commit: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
      },
      envCheck,
      supabaseTest,
      supabaseError,
      supabaseData,
      headlinesTest,
      headlinesError,
      headlinesData,
      // Don't expose actual values in production
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Vercel debug failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
