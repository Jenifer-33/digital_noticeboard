"use client";

import { HeadlineCard } from "@/components/headline-card";
import { HeadlineGrid } from "@/components/headline-grid";
import { useHeadlines } from "@/hooks/use-headlines";
import { useEffect } from "react";
import { HeadlineList } from "../components/headline-list";
import { Header } from "../components/ui/Header";
import { SubTitle } from "../components/ui/SubTitle";

export default function HomePage() {
  const {
    headlines,
    hasMore,
    isLoading,
    viewMode,
    setViewMode,
    fetchHeadlines,
    loadMore,
  } = useHeadlines();

  useEffect(() => {
    fetchHeadlines();
  }, [fetchHeadlines]);

  const renderHeadlines = () => {
    if (isLoading && headlines.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-center text-lg font-bold text-[#e66030] py-8">
            Loading headlines...
          </p>
        </div>
      );
    }

    switch (viewMode) {
      case "list":
        return <HeadlineList headlines={headlines} />;
      case "grid":
        return <HeadlineGrid headlines={headlines} />;
      case "card":
        return (
          <div className="space-y-4">
            {headlines.map((headline) => (
              <HeadlineCard key={headline.id} headline={headline} />
            ))}
          </div>
        );
      default:
        return <HeadlineGrid headlines={headlines} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* View Mode Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <SubTitle subTitle="Headlines" />
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`hidden sm:block px-3 py-1 text-sm font-medium cursor-pointer rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`hidden sm:block px-3 py-1 text-sm font-medium cursor-pointer rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  List
                </button>
                {/* <button
                  onClick={() => setViewMode("card")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "card"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Table
                </button> */}
              </div>
            </div>
          </div>

          {/* Headlines Content */}
          {renderHeadlines()}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
