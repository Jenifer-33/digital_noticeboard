"use client";

import { PresentControls } from "@/components/present-controls";
import { PresentSlide } from "@/components/present-slide";
import { useFullscreen } from "@/hooks/use-fullscreen";
import type { Headline } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PresentPage() {
  const router = useRouter();
  const { enterFullscreen } = useFullscreen();
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Enter fullscreen on load
  useEffect(() => {
    enterFullscreen();
  }, [enterFullscreen]);

  // ✅ Fetch headlines and auto-refresh every 20 seconds
  const fetchHeadlines = async () => {
    try {
      const response = await fetch("/api/headlines/public");
      if (!response.ok) throw new Error("Failed to fetch headlines");

      const data = await response.json();
      setHeadlines(data.headlines || []);
    } catch {
      setError("Failed to load headlines");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadlines(); // initial fetch

    const interval = setInterval(fetchHeadlines, 20000); // every 20 sec
    return () => clearInterval(interval);
  }, []);

  // ✅ Slide navigation
  useEffect(() => {
    if (!isPlaying || headlines.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 10000); // 10 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying, headlines.length]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + headlines.length) % headlines.length);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % headlines.length);
  };
  const handleExit = () => router.push("/");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-xl">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error || headlines.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">No headlines available</h1>
          <p className="text-gray-300 mb-6">
            {error || "There are no published headlines to display."}
          </p>
          <button
            onClick={handleExit}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <PresentSlide headline={headlines[currentIndex]} />
        </motion.div>
      </AnimatePresence>

      <PresentControls
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        totalSlides={headlines.length}
        onPlay={handlePlay}
        onPause={handlePause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onExit={handleExit}
      />
    </div>
  );
}
