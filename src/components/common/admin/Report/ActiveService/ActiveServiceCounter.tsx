"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function ActiveServiceCounter() {
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveCount = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/serviceActive");
      const data = await res.json();
      if (data.success) {
        setActiveCount(data.activeCount);
      } else {
        setActiveCount(0);
      }
    } catch (error) {
      console.error("Error fetching active service count:", error);
      setActiveCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveCount(); // เรียกครั้งแรก
    const interval = setInterval(fetchActiveCount, 10000); // อัพเดททุก 10 วิ
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full h-full shadow-md rounded-2xl">
      <CardContent className="flex flex-col items-center justify-center gap-3 w-full h-full">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 dark:text-gray-200">
          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          ผู้ใช้บริการ ตอนนี้
        </div>

        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-400" />
        ) : (
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {activeCount?.toLocaleString("th-TH")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
