import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id } = await params;

    // Check if status is changing to PUBLISHED
    const { data: currentHeadline } = await supabaseAdmin
      .from("headlines")
      .select("status")
      .eq("id", id)
      .single();

    const updateData: Record<string, unknown> = {
      ...data,
      modified_date: new Date().toISOString(),
      auto_publish_date:
        data.auto_publish_date && data.auto_publish_date.trim() !== ""
          ? new Date(data.auto_publish_date).toISOString()
          : null,
    };

    // If changing to PUBLISHED and not already published
    if (
      data.status === "PUBLISHED" &&
      currentHeadline?.status !== "PUBLISHED"
    ) {
      updateData.published_date = new Date().toISOString();
      updateData.published_by = data.modified_by;
    }

    const { data: headline, error } = await supabaseAdmin
      .from("headlines")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update headline" },
        { status: 500 }
      );
    }

    return NextResponse.json(headline);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get headline to delete associated files
    const { data: headline } = await supabaseAdmin
      .from("headlines")
      .select("cover_image_url, files")
      .eq("id", id)
      .single();

    // Delete files from storage
    if (headline?.cover_image_url) {
      await deleteFile(headline.cover_image_url);
    }

    if (headline?.files && Array.isArray(headline.files)) {
      const fileUrls = headline.files.map((file: { url: string }) => file.url);
      await deleteFiles(fileUrls);
    }

    const { error } = await supabaseAdmin
      .from("headlines")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete headline" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions for file deletion
async function deleteFile(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucket = pathParts[2];
    const filePath = pathParts.slice(3).join("/");

    await supabaseAdmin.storage.from(bucket).remove([filePath]);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

async function deleteFiles(urls: string[]): Promise<void> {
  await Promise.all(urls.map(deleteFile));
}
