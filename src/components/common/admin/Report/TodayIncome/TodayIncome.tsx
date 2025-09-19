"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Wallet } from "lucide-react";

interface TodayIncomeResponse {
  success: boolean;
  date: string;
  todayIncome: number;
}

export default function TodayIncomeCard() {
  const [data, setData] = useState<TodayIncomeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayIncome = async () => {
      try {
        const res = await fetch("/api/admin/payment/todayIncome");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching today income:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayIncome();
  }, []);

  return (
    <Card className="w-full h-full shadow-md rounded-2xl">
      <CardContent className="flex flex-col items-center justify-center gap-3 w-full h-full">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-700">
          <Wallet className="w-6 h-6 text-green-600" />
          ยอดขายวันนี้
        </div>

        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        ) : (
          <>
            <p className="text-3xl font-bold text-green-700">
              {data?.todayIncome.toLocaleString("th-TH")} บาท
            </p>
            <p className="text-sm text-gray-500">
              วันที่ {data?.date}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
