import { Calendar } from "lucide-react";

export const PublishedDate = ({
  published_date,
}: {
  published_date: string | undefined;
}) => {
  if (!published_date) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="space-x-2 flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-3 py-2 rounded-md w-fit">
        <Calendar className="h-4 w-4" />
        <span>
          {published_date
            ? new Date(published_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            : new Date(published_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
        </span>
      </div>
    </div>
  );
};
