import { useState, useEffect } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(targetDays: number[], targetHour: number = 20): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSession = new Date(now);

      let found = false;
      for (let i = 0; i <= 7; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(now.getDate() + i);
        const dayOfWeek = checkDate.getDay();

        if (targetDays.includes(dayOfWeek)) {
          checkDate.setHours(targetHour, 0, 0, 0);
          if (checkDate.getTime() > now.getTime()) {
            nextSession.setTime(checkDate.getTime());
            found = true;
            break;
          }
        }
      }

      if (!found) {
        nextSession.setDate(now.getDate() + 2);
        nextSession.setHours(targetHour, 0, 0, 0);
      }

      const diff = Math.max(0, nextSession.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDays, targetHour]);

  return timeLeft;
}
