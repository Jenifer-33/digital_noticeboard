import type { Headline } from "@/lib/types";
import { FilePlus } from "lucide-react";
import { HeadlineCard } from "./headline-card";

interface HeadlineGridProps {
  headlines: Headline[];
}

export const HeadlineGrid = ({ headlines }: HeadlineGridProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {headlines.map((headline) => (
        <div key={headline.id}>
          <HeadlineCard headline={headline} />
        </div>
      ))}
    </div>
  );
};
