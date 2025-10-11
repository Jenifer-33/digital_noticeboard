import { supabaseAdmin } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { email, createdBy } = await request.json();

    if (!email || !createdBy) {
      return NextResponse.json(
        { error: "Email and createdBy are required" },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = uuidv4();

    // Create invite record
    const { error } = await supabaseAdmin
      .from("admin_invites")
      .insert({
        email,
        token,
        created_by: createdBy,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create invite" },
        { status: 500 }
      );
    }

    // Send email with invite link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/admin-onboarding?token=${token}`;

    // For now, we'll just return the invite link
    // In production, you'd integrate with an email service
    console.log("Admin invite created:", { email, inviteLink });

    return NextResponse.json({
      success: true,
      inviteLink, // Remove this in production
      message: "Invite created successfully. Check console for invite link.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
