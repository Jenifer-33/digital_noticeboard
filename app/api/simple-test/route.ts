import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test 1: Check if we can import Supabase
    let importTest = "❌ Failed";
    try {
      await import("@supabase/supabase-js");
      importTest = "✅ Success";
    } catch (err) {
      importTest = `❌ Import failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`;
    }

    // Test 2: Check environment variables
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    };

    // Test 3: Try to create Supabase client
    let clientTest = "❌ Failed";
    let clientError = null;
    try {
      const { createClient } = await import("@supabase/supabase-js");
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      clientTest = "✅ Success";
    } catch (err) {
      clientTest = "❌ Failed";
      clientError = err instanceof Error ? err.message : "Unknown error";
    }

    // Test 4: Try a simple query
    let queryTest = "❌ Failed";
    let queryError = null;
    let queryData = null;
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabase
        .from("headlines")
        .select("id")
        .limit(1);

      if (error) {
        queryTest = "❌ Query failed";
        queryError = error.message;
      } else {
        queryTest = "✅ Query successful";
        queryData = data;
      }
    } catch (err) {
      queryTest = "❌ Query failed";
      queryError = err instanceof Error ? err.message : "Unknown error";
    }

    return NextResponse.json({
      status: "Simple Test Results",
      timestamp: new Date().toISOString(),
      tests: {
        importTest,
        clientTest,
        queryTest,
      },
      errors: {
        clientError,
        queryError,
      },
      data: {
        queryData,
      },
      envVars: {
        supabaseUrl: envVars.supabaseUrl ? "Set" : "Missing",
        supabaseAnonKey: envVars.supabaseAnonKey ? "Set" : "Missing",
        supabaseServiceKey: envVars.supabaseServiceKey ? "Set" : "Missing",
        baseUrl: envVars.baseUrl ? "Set" : "Missing",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Simple test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
