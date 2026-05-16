import { useEffect, useState } from "react";
import { generateSnapshot, type SensorReading } from "@/lib/hppe/data";

export function useLiveReadings(intervalMs = 2500) {
  const [tick, setTick] = useState(1);
  const [readings, setReadings] = useState<SensorReading[]>(() => generateSnapshot(1));
  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const nt = t + 1;
        setReadings(generateSnapshot(nt));
        return nt;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return { readings, tick };
}