import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    console.log("Testing database schema...");

    // Test 1: Check if headlines table exists
    const { error: headlinesError } = await supabaseAdmin
      .from("headlines")
      .select("id")
      .limit(1);

    if (headlinesError) {
      return NextResponse.json({
        success: false,
        error: "Headlines table not accessible",
        details: headlinesError.message,
        code: headlinesError.code,
        hint: headlinesError.hint,
      });
    }

    // Test 2: Check if users table exists
    const { error: usersError } = await supabaseAdmin
      .from("users")
      .select("id")
      .limit(1);

    if (usersError) {
      return NextResponse.json({
        success: false,
        error: "Users table not accessible",
        details: usersError.message,
        code: usersError.code,
        hint: usersError.hint,
      });
    }

    // Test 3: Check if admin_invites table exists
    const { error: invitesError } = await supabaseAdmin
      .from("admin_invites")
      .select("id")
      .limit(1);

    if (invitesError) {
      return NextResponse.json({
        success: false,
        error: "Admin invites table not accessible",
        details: invitesError.message,
        code: invitesError.code,
        hint: invitesError.hint,
      });
    }

    // Test 4: Check storage buckets
    const { data: buckets, error: bucketsError } =
      await supabaseAdmin.storage.listBuckets();

    if (bucketsError) {
      return NextResponse.json({
        success: false,
        error: "Storage buckets not accessible",
        details: bucketsError.message,
      });
    }

    // Test 5: Check if we can insert a test headline (and then delete it)
    const testHeadline = {
      title: "Test Headline",
      description: "This is a test headline for schema validation",
      status: "DRAFT",
      created_by: "00000000-0000-0000-0000-000000000000", // Dummy UUID
      modified_by: "00000000-0000-0000-0000-000000000000", // Dummy UUID
    };

    const { data: insertTest, error: insertError } = await supabaseAdmin
      .from("headlines")
      .insert(testHeadline)
      .select("id");

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: "Cannot insert into headlines table",
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
      });
    }

    // Clean up the test headline
    if (insertTest && insertTest[0]) {
      await supabaseAdmin.from("headlines").delete().eq("id", insertTest[0].id);
    }

    return NextResponse.json({
      success: true,
      message: "Database schema test successful",
      results: {
        headlinesTable: "✅ Working",
        usersTable: "✅ Working",
        adminInvitesTable: "✅ Working",
        storageBuckets: buckets
          ? `✅ Working (${buckets.length} buckets)`
          : "❌ Failed",
        insertTest: "✅ Working",
        buckets: buckets?.map((b) => b.name) || [],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Schema test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Schema test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
