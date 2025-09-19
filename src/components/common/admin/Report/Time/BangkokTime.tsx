"use client";

import { useEffect, useState } from "react";

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
    <div className="w-full h-full flex flex-col items-center justify-center p-4 rounded-xl
                    bg-white shadow
                    dark:bg-gray-800 dark:shadow-lg">
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">เวลาประเทศไทย</p>
      <p className="text-2xl font-bold text-blue-600 mt-2 dark:text-blue-400">{dateTime}</p>
    </div>
  );
}
