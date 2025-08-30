"use client";

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

type TimerProps = {
  duration: number; // in seconds
  onTimeUp: () => void;
};

export function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const progress = (timeLeft / duration) * 100;
  
  const getProgressColor = () => {
    if (progress > 50) return "bg-primary";
    if (progress > 25) return "bg-yellow-500";
    return "bg-red-500";
  }

  return (
    <div className="flex items-center gap-2 w-24">
      <div className="text-lg font-mono font-semibold tabular-nums w-12 text-center">{timeLeft}s</div>
    </div>
  );
}
