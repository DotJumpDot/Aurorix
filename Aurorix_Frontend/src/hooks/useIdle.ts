"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Luminexis from "luminexis";

interface UseIdleOptions {
  timeout?: string;
  warning?: string;
  onIdle?: () => void;
  onActive?: () => void;
  onWarning?: (remainingMs: number) => void;
  immediate?: boolean;
}

interface UseIdleReturn {
  isIdle: boolean;
  isRunning: boolean;
  idleTime: number;
  remainingTime: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
  destroy: () => void;
}

export function useIdle(options: UseIdleOptions = {}): UseIdleReturn {
  const {
    timeout = "10s",
    warning = "2s",
    onIdle,
    onActive,
    onWarning,
    immediate = true,
  } = options;

  const idleRef = useRef<Luminexis | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const start = useCallback(() => {
    idleRef.current?.start();
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    idleRef.current?.stop();
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    idleRef.current?.reset();
    setIsIdle(false);
    setIdleTime(0);
  }, []);

  const destroy = useCallback(() => {
    idleRef.current?.destroy();
    idleRef.current = null;
    setIsRunning(false);
    setIsIdle(false);
  }, []);

  useEffect(() => {
    idleRef.current = new Luminexis({
      timeout,
      warning,
      immediate,
    });

    idleRef.current.on("idle", () => {
      setIsIdle(true);
      onIdle?.();
    });

    idleRef.current.on("active", () => {
      setIsIdle(false);
      setIdleTime(0);
      onActive?.();
    });

    idleRef.current.on("warning", (remaining) => {
      setRemainingTime(remaining);
      onWarning?.(remaining);
    });

    idleRef.current.on("tick", (time) => {
      setIdleTime(time);
    });

    return () => {
      destroy();
    };
  }, [timeout, warning, immediate, onIdle, onActive, onWarning, destroy]);

  return {
    isIdle,
    isRunning,
    idleTime,
    remainingTime,
    start,
    stop,
    reset,
    destroy,
  };
}

export default useIdle;
