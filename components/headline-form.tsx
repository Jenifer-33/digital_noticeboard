"use client";

import { useAuth } from "@/hooks/use-auth";
import type { Headline } from "@/lib/types";
import { uploadAttachments, uploadCoverImage } from "@/lib/upload-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const headlineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]),
  auto_publish_date: z.string().optional(),
});

type HeadlineForm = z.infer<typeof headlineSchema>;

interface HeadlineFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const HeadlineForm = ({
  id,
  onSuccess,
  onCancel,
}: HeadlineFormProps) => {
  const { user } = useAuth();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([]);

  const [headline, setHeadline] = useState<Headline | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeadline();

    return () => {
      setHeadline(null);
      reset();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchHeadline = async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/headlines/admin?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch headline");

      const data = await response.json();
      console.log(data);
      setHeadline(data.headlines[0]);
      reset(data.headlines[0]);
    } catch {
      setError("Failed to load headline");
      setHeadline(null);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HeadlineForm>({
    resolver: zodResolver(headlineSchema),
    defaultValues: {
      status: "DRAFT",
    },
  });

  // Reset form when headline data is loaded
  useEffect(() => {
    if (headline) {
      reset({
        title: headline.title,
        description: headline.description,
        status: headline.status,
        auto_publish_date: headline.auto_publish_date?.split("T")[0] || "",
      });
    }
  }, [headline, reset]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Cover image must be less than 2MB");
        return;
      }
      setCoverFile(file);
      setError("");
    }
  };

  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 10 * 1024 * 1024) {
      setError("Total attachment size must be less than 10MB");
      return;
    }

    setAttachmentFiles(files);
    setError("");
  };

  const handleRemoveCoverImage = () => {
    setRemoveCoverImage(true);
    setCoverFile(null);
  };

  const handleRemoveAttachment = (index: number) => {
    if (headline?.files?.[index]) {
      setRemovedAttachments([...removedAttachments, headline.files[index].url]);
    }
  };

  const onSubmit = async (data: HeadlineForm) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      let coverImageUrl = headline?.cover_image_url;
      let files = headline?.files || [];

      // Handle cover image
      if (removeCoverImage) {
        coverImageUrl = undefined;
      } else if (coverFile) {
        const headlineId = headline?.id || "temp-" + Date.now();
        coverImageUrl = await uploadCoverImage(coverFile, headlineId);
      }

      // Handle attachments - filter out removed ones and add new ones
      files = files.filter((file) => !removedAttachments.includes(file.url));

      if (attachmentFiles.length > 0) {
        const headlineId = headline?.id || "temp-" + Date.now();
        const uploadedFiles = await uploadAttachments(
          attachmentFiles,
          headlineId
        );
        files = [...files, ...uploadedFiles];
      }

      const headlineData = {
        ...data,
        cover_image_url: coverImageUrl,
        files,
        created_by: headline?.created_by || user.id,
        modified_by: user.id,
        published_by:
          data.status === "PUBLISHED" ? user.id : headline?.published_by,
      };

      const url = headline ? `/api/headlines/${headline.id}` : "/api/headlines";
      const method = headline ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(headlineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save headline");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving headline:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save headline"
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-lg font-bold text-[#e66030] py-8">
        Loading headline...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title *
        </label>
        <input
          {...register("title")}
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description *
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cover"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Image
        </label>

        {/* Current cover image preview */}
        {headline?.cover_image_url && !removeCoverImage && (
          <div className="mt-2 mb-4">
            <div className="relative inline-block">
              <Image
                src={headline.cover_image_url}
                alt="Current cover"
                width={128}
                height={96}
                className="w-32 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveCoverImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Current cover image</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500">Max 2MB, JPG/PNG/WebP/GIF</p>
      </div>

      <div>
        <label
          htmlFor="attachments"
          className="block text-sm font-medium text-gray-700"
        >
          Attachments
        </label>

        {/* Current attachments */}
        {headline?.files && headline.files.length > 0 && (
          <div className="mt-2 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Current attachments:
            </p>
            <div className="space-y-2">
              {headline.files.map((file, index) => {
                if (removedAttachments.includes(file.url)) return null;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {file.name || `Attachment ${index + 1}`}
                      </span>
                      {file.size && (
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <input
          type="file"
          multiple
          onChange={handleAttachmentsChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          Max 2MB per file, 10MB total
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            {...register("status")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* <div>
          <label
            htmlFor="auto_publish_date"
            className="block text-sm font-medium text-gray-700"
          >
            Auto Publish Date
          </label>
          <input
            {...register("auto_publish_date")}
            type="datetime-local"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting || isUploading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};
