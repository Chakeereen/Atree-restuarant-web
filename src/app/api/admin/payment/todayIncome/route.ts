// file: src/app/api/admin/payment/todayIncome/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/utils/date";

export async function GET(req: Request) {
  try {
    // เวลาปัจจุบัน
    const now = new Date();

    // สร้าง start และ end ของวัน ตาม Asia/Bangkok (+7)
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Query จาก DB
    const result = await prisma.payment.aggregate({
      _sum: {
        totalCost: true,
      },
      where: {
        status: "PAID",
        dateTime: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    const todayIncome = result._sum.totalCost
      ? Number(result._sum.totalCost)
      : 0;

    return NextResponse.json({
      success: true,
      // ใช้ formatDateTime แปลงเป็นวันไทย แต่ query ใช้ Date UTC ตรง ๆ
      date: formatDateTime(now, "th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      todayIncome,
    });
  } catch (error) {
    console.error("Error fetching today income:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
