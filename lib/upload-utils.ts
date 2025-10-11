import { supabaseClient } from "./supabase-client";
import { v4 as uuidv4 } from "uuid";
import type { HeadlineFile } from "./types";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const validateFile = (file: File, isImage = false): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `File "${file.name}" is too large. Maximum size is 2MB.`;
  }

  const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_ATTACHMENT_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return `File "${file.name}" has an unsupported type.`;
  }

  return null;
};

export const validateFiles = (files: File[]): string | null => {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > MAX_TOTAL_SIZE) {
    return `Total file size exceeds 10MB limit.`;
  }

  for (const file of files) {
    const error = validateFile(file, false);
    if (error) return error;
  }

  return null;
};

export const uploadCoverImage = async (
  file: File,
  headlineId: string
): Promise<string> => {
  const error = validateFile(file, true);
  if (error) throw new Error(error);

  const fileExt = file.name.split(".").pop();
  const fileName = `${headlineId}-${uuidv4()}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("covers")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Failed to upload cover image: ${uploadError.message}`);
  }

  const { data } = supabaseClient.storage.from("covers").getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadAttachments = async (
  files: File[],
  headlineId: string
): Promise<HeadlineFile[]> => {
  const error = validateFiles(files);
  if (error) throw new Error(error);

  const uploadPromises = files.map(async (file) => {
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `attachments/${headlineId}/${fileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("attachments")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
    }

    const { data } = supabaseClient.storage
      .from("attachments")
      .getPublicUrl(filePath);

    return {
      name: file.name,
      url: data.publicUrl,
      size: file.size,
    };
  });

  return Promise.all(uploadPromises);
};

export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Extract bucket and path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucket = pathParts[2]; // covers or attachments
    const filePath = pathParts.slice(3).join("/");

    const { error } = await supabaseClient.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("Failed to delete file:", error);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const deleteFiles = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(deleteFile));
};
