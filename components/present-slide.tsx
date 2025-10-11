import type { Headline } from "@/lib/types";
import Image from "next/image";
import { PublishedDate } from "./ui/PublishedDate";

interface PresentSlideProps {
  headline: Headline;
}

export const PresentSlide = ({ headline }: PresentSlideProps) => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-600 to-yellow-700">
      {/* Background Image or Gradient */}
      {headline.cover_image_url ? (
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-6 leading-tight absolute left-0 top-10 right-0 text-center">
            {headline.title}
          </h1>
          <div
            className="inset-20 left-0 right-0 bg-contain bg-center bg-no-repeat"
            // style={{ backgroundImage: `url(${headline.cover_image_url})` }}
          >
            <Image
              loading="lazy"
              src={headline.cover_image_url}
              alt={headline.title}
              className="object-contain h-[calc(100vh-250px)]"
              width={1000}
              height={1000}
            />
          </div>
          <div className="mt-8">
            <PublishedDate published_date={headline.published_date} />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-orange-700" />
      )}

      {!headline.cover_image_url && (
        <div className="relative z-10 text-center text-white px-8 max-w-4xl mx-auto">
          <>
            <h1 className="text-3xl font-bold mb-6 leading-tight">
              {headline.title}
            </h1>
            <p className="text-xl md:text-xl leading-relaxed opacity-90">
              {headline.description?.slice(0, 1500)}
              {headline.description?.length > 1500 && <span>...</span>}
            </p>
          </>

          {/* Date */}
          <div className="mt-8">
            <PublishedDate published_date={headline.published_date} />
          </div>
        </div>
      )}
    </div>
  );
};
