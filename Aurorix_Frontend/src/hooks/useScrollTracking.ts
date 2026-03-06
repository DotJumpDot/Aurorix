"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { watchReadingProgress, CometSight } from "cometsight";

interface UseScrollTrackingOptions {
  threshold?: "top" | "center" | "bottom" | string;
  selector: string;
  minTime?: number;
  debounce?: number;
  onEnter?: (element: Element) => void;
  onLeave?: (element: Element) => void;
}

interface UseScrollTrackingReturn {
  start: () => void;
  destroy: () => void;
  isTracking: boolean;
}

/**
 * CometSight Scroll Tracking Hook
 *
 * Suggestions for usage:
 *
 * 1. **Reading Progress Tracking** - Track which paragraph/section
 *    the user is currently reading for analytics
 *
 * 2. **Lazy Loading** - Load content when user scrolls to specific sections
 *
 * 3. **Scroll-based Animations** - Trigger animations when elements
 *    enter the viewport focus zone
 *
 * 4. **Reading Time Estimation** - Calculate how long users spend
 *    reading each section
 *
 * 5. **Content Engagement Analytics** - Track which sections get
 *    the most attention
 *
 * 6. **Auto-Bookmark** - Save the last read position for returning users
 *
 * 7. **Table of Contents** - Highlight current section in TOC
 *    based on scroll position
 *
 * 8. **Scroll Depth Tracking** - Track how far users scroll down pages
 */
export function useScrollTracking(options: UseScrollTrackingOptions): UseScrollTrackingReturn {
  const { threshold = "center", selector, minTime = 0, debounce = 300, onEnter, onLeave } = options;

  const trackerRef = useRef<CometSight | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const start = useCallback(() => {
    if (isTracking || !selector) return;

    trackerRef.current = watchReadingProgress(threshold, selector, {
      minTime,
      debounce,
    });

    if (onEnter) {
      trackerRef.current.onSectionEnter(onEnter);
    }

    if (onLeave) {
      trackerRef.current.onSectionLeave(onLeave);
    }

    setIsTracking(true);
  }, [threshold, selector, minTime, debounce, onEnter, onLeave, isTracking]);

  const destroy = useCallback(() => {
    if (trackerRef.current) {
      trackerRef.current.destroy();
      trackerRef.current = null;
      setIsTracking(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      destroy();
    };
  }, [destroy]);

  return {
    start,
    destroy,
    isTracking,
  };
}

// Pre-built hooks for common use cases
export function useReadingProgress(selector: string) {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [readingTime, setReadingTime] = useState<Record<string, number>>({});

  const tracker = useScrollTracking({
    selector,
    threshold: "center",
    minTime: 1000,
    onEnter: (element) => {
      const id = element.id || element.getAttribute("data-section");
      setCurrentSection(id || null);
    },
  });

  return {
    ...tracker,
    currentSection,
    readingTime,
  };
}

export default useScrollTracking;
