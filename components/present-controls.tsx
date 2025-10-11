"use client";

import { useState, useEffect } from "react";
import { useFullscreen } from "@/hooks/use-fullscreen";

interface PresentControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  totalSlides: number;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onExit: () => void;
}

export const PresentControls = ({
  isPlaying,
  currentIndex,
  totalSlides,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onExit,
}: PresentControlsProps) => {
  const { exitFullscreen } = useFullscreen();
  const [isVisible, setIsVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Show controls on mouse move, hide after 3 seconds
  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      setTimeoutId(newTimeoutId);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          if (isPlaying) {
            onPause();
          } else {
            onPlay();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        case "Escape":
          e.preventDefault();
          onExit();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, onPlay, onPause, onPrevious, onNext, onExit]);

  const handleExit = async () => {
    await exitFullscreen();
    onExit();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black bg-opacity-75 rounded-lg px-6 py-3 flex items-center space-x-4">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          className="text-white hover:text-gray-300 transition-colors"
          title="Previous (←)"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="text-white hover:text-gray-300 transition-colors"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="text-white hover:text-gray-300 transition-colors"
          title="Next (→)"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Slide Counter */}
        <div className="text-white text-sm px-3">
          {currentIndex + 1} / {totalSlides}
        </div>

        {/* Exit Button */}
        <button
          onClick={handleExit}
          className="text-white hover:text-gray-300 transition-colors"
          title="Exit (Esc)"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
