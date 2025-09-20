"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function BangkokClock() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formatted = new Intl.DateTimeFormat("th-TH", options).format(now);
      setDateTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full h-full shadow-md rounded-2xl">
      <CardContent className="flex flex-col items-center justify-center gap-3 w-full h-full">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-700">
          <Clock className="w-6 h-6 text-blue-600" />
          เวลาประเทศไทย
        </div>

        <p className="text-2xl font-bold text-blue-600">{dateTime}</p>
      </CardContent>
    </Card>
  );
}
