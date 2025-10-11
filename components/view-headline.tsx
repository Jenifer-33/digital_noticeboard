import Image from "next/image";
import { Headline } from "../lib/types";
import { Description } from "./ui/Description";
import { PublishedDate } from "./ui/PublishedDate";
import { Title } from "./ui/Title";

export const ViewHeadline = ({ headline }: { headline: Headline | null }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cover Image */}
      {headline?.cover_image_url && (
        <div className="relative w-full h-64 sm:h-80">
          <Image
            src={headline?.cover_image_url}
            alt={headline?.title || ""}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 sm:p-8">
        {/* Title */}
        <Title title={headline?.title || ""} />

        {/* Meta Information */}
        <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
          <PublishedDate published_date={headline?.published_date} />
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              headline?.status === "PUBLISHED"
                ? "bg-green-100 text-green-800"
                : headline?.status === "DRAFT"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {headline?.status}
          </span>
        </div>

        {/* Description */}
        <div className="prose prose-lg max-w-none">
          <Description
            description={headline?.description || ""}
            lineClamp={100000}
          />
        </div>

        {/* File Attachments */}
        {headline?.files && headline?.files.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Attachments ({headline?.files.length})
            </h3>
            <div className="space-y-2">
              {headline.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name || `Attachment ${index + 1}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {file.size
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : "Unknown size"}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
