import type { Headline, HeadlineStatus } from "@/lib/types";
import { FileEdit, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Description } from "./ui/Description";
import { Drawer } from "./ui/Drawer";
import { PublishedDate } from "./ui/PublishedDate";
import { Title } from "./ui/Title";
import { ViewHeadline } from "./view-headline";

interface HeadlineCardProps {
  headline: Headline;
  showActions?: boolean;
  onStatusChange?: (id: string, status: HeadlineStatus) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const HeadlineCard = ({
  headline,
  showActions = false,
  onStatusChange,
  onDelete,
  onEdit,
}: HeadlineCardProps) => {
  const [showViewHeadline, setShowViewHeadline] = useState(false);

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {headline.cover_image_url && (
        <div className="aspect-w-16 aspect-h-9">
          <Image
            src={headline.cover_image_url}
            alt={headline.title}
            className="w-full h-48 object-cover"
            loading="lazy"
            width={1000}
            height={1000}
          />
        </div>
      )}
      {!headline.cover_image_url && (
        <div className="aspect-w-16 aspect-h-9">
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="https://placehold.co/400x200/e66030/FFFFFF?text=SSMIET&font=Montserrat"
              alt={headline.title}
              className="w-full h-48 object-cover"
            />
          }
        </div>
      )}
      <div className="p-6">
        <div onClick={() => setShowViewHeadline(true)}>
          <Title title={headline.title} />
        </div>
        <Description description={headline.description} />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <PublishedDate published_date={headline.published_date} />
          {headline.files && headline.files.length > 0 && (
            <span className="flex items-center">
              📎 {headline.files.length} file
              {headline.files.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {showActions && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 gap-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(headline.id)}
                  className="text-[#e66030] hover:text-orange-600 text-sm font-medium flex items-center space-x-2 cursor-pointer"
                >
                  <FileEdit className="w-4 h-4" />{" "}
                  <span className="sr-only sm:not-sr-only ">Edit</span>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(headline.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-2 cursor-pointer"
                >
                  <Trash className="w-4 h-4" />{" "}
                  <span className="sr-only sm:not-sr-only ">Delete</span>
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
      {showViewHeadline && (
        <Drawer onClose={() => setShowViewHeadline(false)}>
          <ViewHeadline headline={headline} />
        </Drawer>
      )}
    </div>
  );
};
