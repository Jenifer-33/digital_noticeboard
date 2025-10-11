import type { Headline, HeadlineStatus } from "@/lib/types";
import { FileEdit, FilePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Description } from "./ui/Description";
import { Drawer } from "./ui/Drawer";
import { PublishedDate } from "./ui/PublishedDate";
import { Title } from "./ui/Title";
import { ViewHeadline } from "./view-headline";

interface HeadlineListProps {
  headlines: Headline[];
  onStatusChange?: (id: string, status: HeadlineStatus) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  showActions?: boolean;
}

export const HeadlineList = ({
  headlines,
  onStatusChange,
  onDelete,
  onEdit,
  showActions = false,
}: HeadlineListProps) => {
  const [showViewHeadline, setShowViewHeadline] = useState(false);
  const [viewingHeadline, setViewingHeadline] = useState<Headline | null>(null);

  const handleView = (headlineId: string) => {
    setViewingHeadline(headlines.find((h) => h.id === headlineId) || null);
    setShowViewHeadline(true);
  };

  const getStatusColor = (status: HeadlineStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 border-green-300";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (headlines?.length === 0) {
    return (
      <div className="text-center py-8 text-black flex flex-col gap-4 items-center justify-center gap-2">
        <FilePlus className="w-50 h-50 text-[#e66030]" />
        <h2 className="text-2xl font-bold text-[#e66030]">
          No headlines found
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {headlines.map((headline) => (
        <div
          key={headline.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <div className="flex items-center">
            {/* Cover Image */}
            {headline.cover_image_url && (
              <div className="flex-shrink-0 w-32 h-24 sm:w-40 sm:h-28 px-2">
                <Image
                  src={headline.cover_image_url}
                  alt={headline.title}
                  className="object-cover rounded-lg"
                  style={{ height: "100px" }}
                  loading="lazy"
                  width={160}
                  height={100}
                />
              </div>
            )}

            {!headline.cover_image_url && (
              <div className="flex-shrink-0 w-32 h-24 sm:w-40 sm:h-28 px-2">
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="https://placehold.co/400x200/e66030/FFFFFF?text=SSMIET&font=Montserrat"
                    alt={headline.title}
                  />
                }
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center space-x-2"
                    onClick={() => handleView(headline.id)}
                  >
                    <Title className="cursor-pointer" title={headline.title} />
                  </div>
                  <Description description={headline.description} />

                  {/* Meta information */}
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <PublishedDate published_date={headline.published_date} />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {showActions && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 gap-4">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(headline.id)}
                        className="text-[#e66030] hover:text-orange-600 text-sm font-medium flex items-center space-x-2 cursor-pointer"
                      >
                        <FileEdit className="w-4 h-4" />{" "}
                        <span className=" ">Edit</span>
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(headline.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-2 cursor-pointer"
                      >
                        <Trash className="w-4 h-4" />{" "}
                        <span className=" ">Delete</span>
                      </button>
                    )}
                  </div>
                  <div>
                    {onStatusChange && (
                      <select
                        value={headline.status}
                        onChange={(e) =>
                          onStatusChange(
                            headline.id,
                            e.target.value as HeadlineStatus
                          )
                        }
                        className={
                          "text-sm border-2 p-1 text-white rounded-md cursor-pointer " +
                          getStatusColor(headline.status)
                        }
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold border-1 rounded-lg text-gray-700 p-2 ${getStatusColor(
                        headline.status
                      )}`}
                    >
                      {headline.status}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {showViewHeadline && (
        <Drawer onClose={() => setShowViewHeadline(false)}>
          <ViewHeadline headline={viewingHeadline || null} />
        </Drawer>
      )}
    </div>
  );
};
