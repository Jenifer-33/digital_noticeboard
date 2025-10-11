import { useAtom } from "jotai";
import { useCallback } from "react";
import {
  headlinesAtom,
  currentCursorAtom,
  hasMoreAtom,
  headlinesLoadingAtom,
  viewModeAtom,
} from "@/lib/atoms";
import type { HeadlinesResponse } from "@/lib/types";

export const useHeadlines = () => {
  const [headlines, setHeadlines] = useAtom(headlinesAtom);
  const [currentCursor, setCurrentCursor] = useAtom(currentCursorAtom);
  const [hasMore, setHasMore] = useAtom(hasMoreAtom);
  const [isLoading, setIsLoading] = useAtom(headlinesLoadingAtom);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  const fetchHeadlines = useCallback(
    async (cursor?: string | null) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          limit: "10",
        });

        if (cursor) {
          params.append("cursor", cursor);
        }

        const response = await fetch(`/api/headlines/public?${params}`);
        if (!response.ok) throw new Error("Failed to fetch headlines");

        const data: HeadlinesResponse = await response.json();

        if (cursor) {
          setHeadlines((prev) => [...prev, ...data.headlines]);
        } else {
          setHeadlines(data.headlines);
        }

        setCurrentCursor(data.nextCursor || null);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error fetching headlines:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setHeadlines, setCurrentCursor, setHasMore, setIsLoading]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading && currentCursor) {
      fetchHeadlines(currentCursor);
    }
  }, [hasMore, isLoading, currentCursor, fetchHeadlines]);

  const refresh = useCallback(() => {
    setHeadlines([]);
    setCurrentCursor(null);
    setHasMore(true);
    fetchHeadlines();
  }, [setHeadlines, setCurrentCursor, setHasMore, fetchHeadlines]);

  return {
    headlines,
    currentCursor,
    hasMore,
    isLoading,
    viewMode,
    setViewMode,
    fetchHeadlines,
    loadMore,
    refresh,
  };
};
