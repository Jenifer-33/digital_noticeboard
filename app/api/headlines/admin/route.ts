import { supabaseAdmin } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || searchParams.get("query");

    // If requesting a specific headline by ID
    if (id) {
      const { data, error } = await supabaseAdmin
        .from("headlines")
        .select("*")
        .eq("id", id)
        .order("published_date", { ascending: false })
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch headline" },
          { status: 500 }
        );
      }

      return NextResponse.json({ headlines: [data] });
    }

    let query = supabaseAdmin
      .from("headlines")
      .select(
        `
        *,
        created_by_user:users!headlines_created_by_fkey(email),
        modified_by_user:users!headlines_modified_by_fkey(email),
        published_by_user:users!headlines_published_by_fkey(email)
      `
      )
      .order("published_date", { ascending: false });

    if (status && status !== "ALL") {
      query = query.eq("status", status);
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      console.log("Searching for:", searchTerm);
      query = query.or(
        `title.ilike.${searchTerm},description.ilike.${searchTerm}`
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch headlines" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      headlines: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin headlines API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
